const mongoose = require("mongoose");

const statusUpdateSchema = new mongoose.Schema(
  {
    complaint: { type: mongoose.Schema.Types.ObjectId, ref: "Complaint", required: true, index: true },
    type: {
      type: String,
      enum: ["status_change", "note", "reassignment", "urgency_change"],
      required: true,
    },
    fromStatus: String,
    toStatus: String,
    message: String,
    visibility: { type: String, enum: ["public", "internal"], default: "public" },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

module.exports = mongoose.model("StatusUpdate", statusUpdateSchema);
