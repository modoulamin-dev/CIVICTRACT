const bcrypt = require("bcryptjs");
const Department = require("../models/Department");
const User = require("../models/User");
const { asyncHandler } = require("../utils/asyncHandler");

const listDepartments = asyncHandler(async (_req, res) => {
  const items = await Department.find().sort({ name: 1 });
  return res.json({ items });
});

const createDepartment = asyncHandler(async (req, res) => {
  const item = await Department.create({
    name: req.body.name,
    categories: req.body.categories || [],
    contactEmail: req.body.contactEmail,
    contactPhone: req.body.contactPhone,
    isActive: req.body.isActive !== false,
  });
  return res.status(201).json({ item });
});

const updateDepartment = asyncHandler(async (req, res) => {
  const item = await Department.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      categories: req.body.categories,
      contactEmail: req.body.contactEmail,
      contactPhone: req.body.contactPhone,
      isActive: req.body.isActive,
    },
    { new: true, runValidators: true }
  );
  if (!item) return res.status(404).json({ message: "Department not found.", errors: [] });
  return res.json({ item });
});

const publicDepartments = asyncHandler(async (_req, res) => {
  const items = await Department.find({ isActive: true }).select("name categories contactEmail contactPhone");
  return res.json({ items });
});

const listUsers = asyncHandler(async (_req, res) => {
  const items = await User.find({ role: { $in: ["staff", "super_admin"] } })
    .select("-passwordHash")
    .populate("department", "name")
    .sort({ createdAt: -1 });
  return res.json({ items });
});

const createStaff = asyncHandler(async (req, res) => {
  const exists = await User.findOne({ email: req.body.email.toLowerCase() });
  if (exists) return res.status(409).json({ message: "An account with that email already exists.", errors: [] });
  const passwordHash = await bcrypt.hash(req.body.password, 10);
  const user = await User.create({
    name: req.body.name,
    email: req.body.email.toLowerCase(),
    phone: req.body.phone,
    passwordHash,
    role: req.body.role === "super_admin" ? "super_admin" : "staff",
    department: req.body.department,
    isActive: true,
  });
  return res.status(201).json({
    item: await User.findById(user._id).select("-passwordHash").populate("department", "name"),
  });
});

const updateUser = asyncHandler(async (req, res) => {
  const update = {
    name: req.body.name,
    role: req.body.role,
    department: req.body.department,
    isActive: req.body.isActive,
    phone: req.body.phone,
  };
  Object.keys(update).forEach((key) => update[key] === undefined && delete update[key]);
  const item = await User.findByIdAndUpdate(req.params.id, update, { new: true }).select("-passwordHash").populate(
    "department",
    "name"
  );
  if (!item) return res.status(404).json({ message: "User not found.", errors: [] });
  return res.json({ item });
});

module.exports = {
  listDepartments,
  createDepartment,
  updateDepartment,
  publicDepartments,
  listUsers,
  createStaff,
  updateUser,
};
