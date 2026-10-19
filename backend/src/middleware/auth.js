const jwt = require("jsonwebtoken");
const { env } = require("../config/env");
const User = require("../models/User");

function optionalAuth(req, _res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return next();
  jwt.verify(token, env.jwtSecret, (error, payload) => {
    if (error) return next();
    req.auth = payload;
    next();
  });
}

async function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) {
    return res.status(401).json({ message: "Please sign in.", errors: [] });
  }

  try {
    const payload = jwt.verify(token, env.jwtSecret);
    const user = await User.findById(payload.sub);
    if (!user || !user.isActive) {
      return res.status(401).json({ message: "Account is not active.", errors: [] });
    }
    req.user = user;
    req.auth = payload;
    next();
  } catch {
    return res.status(401).json({ message: "Session expired. Please sign in again.", errors: [] });
  }
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "You do not have access to this action.", errors: [] });
    }
    next();
  };
}

module.exports = { optionalAuth, requireAuth, requireRole };
