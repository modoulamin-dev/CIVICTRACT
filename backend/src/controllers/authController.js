const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { env } = require("../config/env");
const { asyncHandler } = require("../utils/asyncHandler");

function tokenFor(user) {
  return jwt.sign(
    { sub: String(user._id), role: user.role, department: user.department },
    env.jwtSecret,
    { expiresIn: env.jwtExpiresIn }
  );
}

function safeUser(user) {
  return {
    id: String(user._id),
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    department: user.department,
    isActive: user.isActive,
  };
}

const register = asyncHandler(async (req, res) => {
  const { name, email, phone, password } = req.body;
  const exists = await User.findOne({ email: email.toLowerCase() });
  if (exists) {
    return res.status(409).json({ message: "An account with that email already exists.", errors: [] });
  }
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email: email.toLowerCase(),
    phone,
    passwordHash,
    role: "citizen",
  });
  return res.status(201).json({ token: tokenFor(user), user: safeUser(user) });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user || !user.isActive) {
    return res.status(401).json({ message: "Email or password is incorrect.", errors: [] });
  }
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    return res.status(401).json({ message: "Email or password is incorrect.", errors: [] });
  }
  return res.json({ token: tokenFor(user), user: safeUser(user) });
});

const me = asyncHandler(async (req, res) => {
  return res.json({ user: safeUser(req.user) });
});

module.exports = { register, login, me };
