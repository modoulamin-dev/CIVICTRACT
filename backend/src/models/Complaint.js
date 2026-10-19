const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema(
  {
    trackingNumber: { type: String, required: true, unique: true, index: true },
    category: {
      type: String,
      enum: ["roads", "waste", "water", "unsafe_spaces", "other"],
      required: true,
    },
    title: { type: String, trim: true },
    description: { type: String, required: true, minlength: 10, maxlength: 2000 },
    location: {
      region: { type: String, required: true, trim: true },
      area: { type: String, required: true, trim: true },
      landmark: { type: String, trim: true },
      coordinates: {
        type: { type: String, enum: ["Point"] },
        coordinates: { type: [Number] },
      },
    },
    photoUrl: { type: String },
    status: {
      type: String,
      enum: ["received", "assigned", "in_progress", "resolved"],
      default: "received",
      index: true,
    },
    isUrgent: { type: Boolean, default: false, index: true },
    department: { type: mongoose.Schema.Types.ObjectId, ref: "Department" },
    reporter: {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      name: String,
      phone: String,
      email: String,
    },
    isPublic: { type: Boolean, default: true },
    resolvedAt: { type: Date },
  },
  { timestamps: true }
);

complaintSchema.index({ status: 1, isUrgent: -1, createdAt: -1 });
complaintSchema.index({ department: 1, status: 1 });
complaintSchema.index({ "location.region": 1 });
complaintSchema.index({ "location.coordinates": "2dsphere" });

module.exports = mongoose.model("Complaint", complaintSchema);
