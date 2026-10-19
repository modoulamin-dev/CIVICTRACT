const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const multer = require("multer");
const { env } = require("../config/env");

const uploadDir = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const allowed = new Map([
  ["image/jpeg", ".jpg"],
  ["image/png", ".png"],
  ["image/webp", ".webp"],
]);

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const ext = allowed.get(file.mimetype) || path.extname(file.originalname);
    cb(null, `${Date.now()}-${crypto.randomBytes(8).toString("hex")}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: env.uploadMaxMb * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!allowed.has(file.mimetype)) {
      const error = new Error("Photo must be a JPEG, PNG, or WebP file.");
      error.status = 400;
      return cb(error);
    }
    cb(null, true);
  },
});

module.exports = { upload, uploadDir };
