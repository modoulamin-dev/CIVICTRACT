const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../../.env") });

function required(name, fallback) {
  const value = process.env[name] ?? fallback;
  if (value === undefined) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

const env = {
  port: Number(required("PORT", "5000")),
  mongodbUri: required("MONGODB_URI", "mongodb://localhost:27017/civictract"),
  jwtSecret: required("JWT_SECRET", "change_me"),
  jwtExpiresIn: required("JWT_EXPIRES_IN", "1d"),
  clientUrl: required("CLIENT_URL", "http://localhost:5173"),
  uploadMaxMb: Number(required("UPLOAD_MAX_MB", "5")),
  nodeEnv: process.env.NODE_ENV || "development",
};

module.exports = { env };
