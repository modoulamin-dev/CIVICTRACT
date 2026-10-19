const Complaint = require("../models/Complaint");
const { asyncHandler } = require("../utils/asyncHandler");

function matchFor(user, query) {
  const match = {};
  if (user.role === "staff") match.department = user.department;
  if (query.from || query.to) {
    match.createdAt = {};
    if (query.from) match.createdAt.$gte = new Date(query.from);
    if (query.to) match.createdAt.$lte = new Date(query.to);
  }
  if (query.departmentId && user.role === "super_admin") match.department = query.departmentId;
  if (query.region) match["location.region"] = query.region;
  if (query.area) match["location.area"] = query.area;
  return match;
}

const summary = asyncHandler(async (req, res) => {
  const match = matchFor(req.user, req.query);
  const [byStatus, byCategory, urgency] = await Promise.all([
    Complaint.aggregate([{ $match: match }, { $group: { _id: "$status", count: { $sum: 1 } } }]),
    Complaint.aggregate([{ $match: match }, { $group: { _id: "$category", count: { $sum: 1 } } }]),
    Complaint.aggregate([{ $match: match }, { $group: { _id: "$isUrgent", count: { $sum: 1 } } }]),
  ]);
  const total = byStatus.reduce((sum, row) => sum + row.count, 0);
  return res.json({
    total,
    byStatus: Object.fromEntries(byStatus.map((row) => [row._id, row.count])),
    byCategory: Object.fromEntries(byCategory.map((row) => [row._id, row.count])),
    urgent: urgency.find((row) => row._id === true)?.count || 0,
  });
});

const byArea = asyncHandler(async (req, res) => {
  const match = matchFor(req.user, req.query);
  const rows = await Complaint.aggregate([
    { $match: match },
    {
      $group: {
        _id: { region: "$location.region", area: "$location.area" },
        count: { $sum: 1 },
        open: {
          $sum: { $cond: [{ $ne: ["$status", "resolved"] }, 1, 0] },
        },
      },
    },
    { $sort: { count: -1 } },
  ]);
  return res.json({
    items: rows.map((row) => ({
      region: row._id.region,
      area: row._id.area,
      count: row.count,
      open: row.open,
    })),
  });
});

const byCategory = asyncHandler(async (req, res) => {
  const match = matchFor(req.user, req.query);
  const rows = await Complaint.aggregate([
    { $match: match },
    {
      $group: {
        _id: "$category",
        count: { $sum: 1 },
        resolved: { $sum: { $cond: [{ $eq: ["$status", "resolved"] }, 1, 0] } },
        avgMs: {
          $avg: {
            $cond: [
              { $ifNull: ["$resolvedAt", false] },
              { $subtract: ["$resolvedAt", "$createdAt"] },
              null,
            ],
          },
        },
      },
    },
    { $sort: { count: -1 } },
  ]);
  return res.json({
    items: rows.map((row) => ({
      category: row._id,
      count: row.count,
      resolved: row.resolved,
      averageResolutionHours: row.avgMs ? Number((row.avgMs / 36e5).toFixed(1)) : null,
    })),
  });
});

const resolutionTime = asyncHandler(async (req, res) => {
  const match = { ...matchFor(req.user, req.query), resolvedAt: { $exists: true } };
  const [agg] = await Complaint.aggregate([
    { $match: match },
    {
      $group: {
        _id: null,
        count: { $sum: 1 },
        avgMs: { $avg: { $subtract: ["$resolvedAt", "$createdAt"] } },
      },
    },
  ]);
  return res.json({
    resolvedCount: agg?.count || 0,
    averageResolutionHours: agg?.avgMs ? Number((agg.avgMs / 36e5).toFixed(1)) : null,
  });
});

module.exports = { summary, byArea, byCategory, resolutionTime };
