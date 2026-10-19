const Complaint = require("../models/Complaint");
const StatusUpdate = require("../models/StatusUpdate");
const { createUniqueTrackingNumber } = require("../services/trackingNumber");
const { routeByCategory } = require("../services/routing");
const { asyncHandler } = require("../utils/asyncHandler");
const { publicComplaint, isStale } = require("../utils/publicShape");

function locationFromBody(body) {
  const location = {
    region: body.region,
    area: body.area,
    landmark: body.landmark || "",
  };
  const lng = Number(body.lng);
  const lat = Number(body.lat);
  if (Number.isFinite(lng) && Number.isFinite(lat)) {
    location.coordinates = { type: "Point", coordinates: [lng, lat] };
  }
  return location;
}

function titleFromDescription(description, category) {
  const first = description.trim().split(/[.!?\n]/)[0];
  if (first && first.length >= 8) return first.slice(0, 80);
  return `${category.replace("_", " ")} report`;
}

const createComplaint = asyncHandler(async (req, res) => {
  const trackingNumber = await createUniqueTrackingNumber();
  const department = await routeByCategory(req.body.category);
  const photoUrl = req.file ? `/uploads/${req.file.filename}` : undefined;

  const complaint = await Complaint.create({
    trackingNumber,
    category: req.body.category,
    title: req.body.title || titleFromDescription(req.body.description, req.body.category),
    description: req.body.description,
    location: locationFromBody(req.body),
    photoUrl,
    status: department ? "assigned" : "received",
    department: department?._id,
    reporter: {
      user: req.user && req.user.role === "citizen" ? req.user._id : undefined,
      name: req.body.reporterName,
      phone: req.body.phone,
      email: req.body.email,
    },
  });

  await StatusUpdate.create({
    complaint: complaint._id,
    type: "status_change",
    fromStatus: null,
    toStatus: "received",
    message: "Complaint received.",
    visibility: "public",
  });

  if (department) {
    await StatusUpdate.create({
      complaint: complaint._id,
      type: "status_change",
      fromStatus: "received",
      toStatus: "assigned",
      message: `Routed to ${department.name}.`,
      visibility: "public",
    });
  }

  const populated = await Complaint.findById(complaint._id).populate(
    "department",
    "name contactEmail contactPhone"
  );
  return res.status(201).json({
    trackingNumber,
    complaint: publicComplaint(populated),
  });
});

const trackComplaint = asyncHandler(async (req, res) => {
  const complaint = await Complaint.findOne({
    trackingNumber: req.params.trackingNumber.toUpperCase(),
  }).populate("department", "name contactEmail contactPhone");
  if (!complaint) {
    return res.status(404).json({ message: "No complaint matches that tracking number.", errors: [] });
  }
  const updates = await StatusUpdate.find({
    complaint: complaint._id,
    visibility: "public",
  })
    .sort({ createdAt: 1 })
    .populate("author", "name");
  return res.json({ complaint: publicComplaint(complaint, updates) });
});

const listPublic = asyncHandler(async (req, res) => {
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(req.query.limit) || 12, 1), 50);
  const filter = { isPublic: true };
  if (req.query.region) filter["location.region"] = req.query.region;
  if (req.query.area) filter["location.area"] = new RegExp(req.query.area, "i");
  if (req.query.category) filter.category = req.query.category;
  if (req.query.status) filter.status = req.query.status;

  const [items, total] = await Promise.all([
    Complaint.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("department", "name contactEmail contactPhone"),
    Complaint.countDocuments(filter),
  ]);

  return res.json({
    items: items.map((item) => publicComplaint(item)),
    page,
    limit,
    total,
    pages: Math.ceil(total / limit) || 1,
  });
});

const publicDetail = asyncHandler(async (req, res) => {
  const complaint = await Complaint.findOne({ _id: req.params.id, isPublic: true }).populate(
    "department",
    "name contactEmail contactPhone"
  );
  if (!complaint) {
    return res.status(404).json({ message: "Complaint not found.", errors: [] });
  }
  const updates = await StatusUpdate.find({
    complaint: complaint._id,
    visibility: "public",
  })
    .sort({ createdAt: 1 })
    .populate("author", "name");
  return res.json({ complaint: publicComplaint(complaint, updates) });
});

const myComplaints = asyncHandler(async (req, res) => {
  const items = await Complaint.find({ "reporter.user": req.user._id })
    .sort({ createdAt: -1 })
    .populate("department", "name");
  return res.json({ items: items.map((item) => publicComplaint(item)) });
});

const listAdmin = asyncHandler(async (req, res) => {
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(req.query.limit) || 20, 1), 100);
  const filter = {};
  if (req.user.role === "staff") filter.department = req.user.department;
  if (req.query.status) filter.status = req.query.status;
  if (req.query.category) filter.category = req.query.category;
  if (req.query.region) filter["location.region"] = req.query.region;
  if (req.query.area) filter["location.area"] = new RegExp(req.query.area, "i");
  if (req.query.urgency === "true") filter.isUrgent = true;
  if (req.query.urgency === "false") filter.isUrgent = false;
  if (req.query.q) {
    filter.$or = [
      { trackingNumber: new RegExp(req.query.q, "i") },
      { description: new RegExp(req.query.q, "i") },
      { title: new RegExp(req.query.q, "i") },
    ];
  }
  if (req.query.from || req.query.to) {
    filter.createdAt = {};
    if (req.query.from) filter.createdAt.$gte = new Date(req.query.from);
    if (req.query.to) filter.createdAt.$lte = new Date(req.query.to);
  }

  const [items, total] = await Promise.all([
    Complaint.find(filter)
      .sort({ isUrgent: -1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("department", "name"),
    Complaint.countDocuments(filter),
  ]);

  return res.json({
    items: items.map((item) => {
      const doc = item.toObject();
      return {
        id: String(doc._id),
        trackingNumber: doc.trackingNumber,
        category: doc.category,
        title: doc.title,
        status: doc.status,
        isUrgent: doc.isUrgent,
        isPublic: doc.isPublic,
        isStale: isStale(doc),
        region: doc.location.region,
        area: doc.location.area,
        department: doc.department,
        createdAt: doc.createdAt,
      };
    }),
    page,
    limit,
    total,
    pages: Math.ceil(total / limit) || 1,
  });
});

function canAccessComplaint(user, complaint) {
  if (user.role === "super_admin") return true;
  return String(complaint.department) === String(user.department);
}

const adminDetail = asyncHandler(async (req, res) => {
  const complaint = await Complaint.findById(req.params.id)
    .populate("department", "name contactEmail contactPhone")
    .populate("reporter.user", "name email");
  if (!complaint) return res.status(404).json({ message: "Complaint not found.", errors: [] });
  if (!canAccessComplaint(req.user, complaint)) {
    return res.status(403).json({ message: "This complaint belongs to another department.", errors: [] });
  }
  const updates = await StatusUpdate.find({ complaint: complaint._id })
    .sort({ createdAt: 1 })
    .populate("author", "name role");
  const publicView = publicComplaint(complaint, updates.filter((item) => item.visibility === "public"));
  return res.json({
    complaint: {
      ...publicView,
      reporter: complaint.reporter,
      isPublic: complaint.isPublic,
      updates: updates.map((item) => ({
        id: String(item._id),
        type: item.type,
        fromStatus: item.fromStatus,
        toStatus: item.toStatus,
        message: item.message,
        visibility: item.visibility,
        createdAt: item.createdAt,
        author: item.author ? { name: item.author.name, role: item.author.role } : { name: "CivicTract" },
      })),
    },
  });
});

const FORWARD = {
  received: ["assigned"],
  assigned: ["in_progress"],
  in_progress: ["resolved"],
  resolved: [],
};

const updateStatus = asyncHandler(async (req, res) => {
  const complaint = await Complaint.findById(req.params.id);
  if (!complaint) return res.status(404).json({ message: "Complaint not found.", errors: [] });
  if (!canAccessComplaint(req.user, complaint)) {
    return res.status(403).json({ message: "This complaint belongs to another department.", errors: [] });
  }

  const nextStatus = req.body.status;
  const allowed = FORWARD[complaint.status] || [];
  const isForward = allowed.includes(nextStatus);
  const isBackward = ["received", "assigned", "in_progress", "resolved"].indexOf(nextStatus) <
    ["received", "assigned", "in_progress", "resolved"].indexOf(complaint.status);

  if (!isForward) {
    if (!(req.user.role === "super_admin" && isBackward && req.body.message)) {
      return res.status(400).json({
        message: "That status change is not allowed. Super admins can move backwards with a note.",
        errors: [],
      });
    }
  }

  if (nextStatus === "resolved" && !req.body.message) {
    return res.status(400).json({
      message: "Please add a public note explaining what was done before resolving.",
      errors: [{ field: "message", message: "A resolution note is required." }],
    });
  }

  const fromStatus = complaint.status;
  complaint.status = nextStatus;
  if (nextStatus === "resolved") complaint.resolvedAt = new Date();
  else complaint.resolvedAt = undefined;
  await complaint.save();

  await StatusUpdate.create({
    complaint: complaint._id,
    type: "status_change",
    fromStatus,
    toStatus: nextStatus,
    message: req.body.message,
    visibility: "public",
    author: req.user._id,
  });

  return res.json({ ok: true, status: complaint.status });
});

const updateUrgent = asyncHandler(async (req, res) => {
  const complaint = await Complaint.findById(req.params.id);
  if (!complaint) return res.status(404).json({ message: "Complaint not found.", errors: [] });
  if (!canAccessComplaint(req.user, complaint)) {
    return res.status(403).json({ message: "This complaint belongs to another department.", errors: [] });
  }
  const isUrgent = Boolean(req.body.isUrgent);
  complaint.isUrgent = isUrgent;
  await complaint.save();
  await StatusUpdate.create({
    complaint: complaint._id,
    type: "urgency_change",
    message: isUrgent ? "Marked urgent." : "Urgency removed.",
    visibility: "internal",
    author: req.user._id,
  });
  return res.json({ ok: true, isUrgent });
});

const reassign = asyncHandler(async (req, res) => {
  const complaint = await Complaint.findById(req.params.id);
  if (!complaint) return res.status(404).json({ message: "Complaint not found.", errors: [] });
  if (req.user.role !== "super_admin" && !canAccessComplaint(req.user, complaint)) {
    return res.status(403).json({ message: "You cannot reassign this complaint.", errors: [] });
  }
  const from = complaint.department;
  complaint.department = req.body.departmentId;
  if (complaint.status === "received") complaint.status = "assigned";
  await complaint.save();
  await complaint.populate("department", "name");
  await StatusUpdate.create({
    complaint: complaint._id,
    type: "reassignment",
    fromStatus: complaint.status,
    toStatus: complaint.status,
    message: `Reassigned to ${complaint.department?.name || "another department"}.`,
    visibility: "public",
    author: req.user._id,
  });
  return res.json({ ok: true, department: complaint.department, from });
});

const addNote = asyncHandler(async (req, res) => {
  const complaint = await Complaint.findById(req.params.id);
  if (!complaint) return res.status(404).json({ message: "Complaint not found.", errors: [] });
  if (!canAccessComplaint(req.user, complaint)) {
    return res.status(403).json({ message: "This complaint belongs to another department.", errors: [] });
  }
  const visibility = req.body.visibility === "internal" ? "internal" : "public";
  const update = await StatusUpdate.create({
    complaint: complaint._id,
    type: "note",
    message: req.body.message,
    visibility,
    author: req.user._id,
  });
  return res.status(201).json({
    update: {
      id: String(update._id),
      type: update.type,
      message: update.message,
      visibility: update.visibility,
      createdAt: update.createdAt,
    },
  });
});

const setVisibility = asyncHandler(async (req, res) => {
  const complaint = await Complaint.findById(req.params.id);
  if (!complaint) return res.status(404).json({ message: "Complaint not found.", errors: [] });
  if (!canAccessComplaint(req.user, complaint)) {
    return res.status(403).json({ message: "This complaint belongs to another department.", errors: [] });
  }
  complaint.isPublic = Boolean(req.body.isPublic);
  await complaint.save();
  await StatusUpdate.create({
    complaint: complaint._id,
    type: "note",
    message: complaint.isPublic ? "Complaint made public." : "Complaint hidden from the public board.",
    visibility: "internal",
    author: req.user._id,
  });
  return res.json({ ok: true, isPublic: complaint.isPublic });
});

module.exports = {
  createComplaint,
  trackComplaint,
  listPublic,
  publicDetail,
  myComplaints,
  listAdmin,
  adminDetail,
  updateStatus,
  updateUrgent,
  reassign,
  addNote,
  setVisibility,
};
