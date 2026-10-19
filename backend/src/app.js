const path = require("path");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const { env } = require("./config/env");
const authRoutes = require("./routes/auth");
const complaintRoutes = require("./routes/complaints");
const adminRoutes = require("./routes/admin");
const { publicDepartments } = require("./controllers/adminController");
const { myComplaints } = require("./controllers/complaintController");
const { requireAuth } = require("./middleware/auth");
const { errorHandler } = require("./middleware/errorHandler");

const app = express();

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);
app.use(
  cors({
    origin: env.clientUrl,
    credentials: true,
  })
);
app.use(express.json({ limit: "1mb" }));

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: true,
  legacyHeaders: false,
});
const submitLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 12,
  message: { message: "Too many reports from this device. Please wait and try again.", errors: [] },
});

app.use("/api/v1", apiLimiter);
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.get("/api/v1/health", (_req, res) => res.json({ ok: true }));
app.get("/api/v1/departments", publicDepartments);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/complaints", (req, res, next) => {
  if (req.method === "POST" && req.path === "/") return submitLimiter(req, res, next);
  next();
});
app.use("/api/v1/complaints", complaintRoutes);
app.use("/api/v1/admin", adminRoutes);
app.get("/api/v1/me/complaints", requireAuth, myComplaints);

app.use((_req, res) => res.status(404).json({ message: "Not found.", errors: [] }));
app.use(errorHandler);

module.exports = { app };
