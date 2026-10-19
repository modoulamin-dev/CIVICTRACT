const Complaint = require("../models/Complaint");

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function randomCode(length = 6) {
  let code = "";
  for (let i = 0; i < length; i += 1) {
    code += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  }
  return code;
}

function formatTrackingNumber(year = new Date().getUTCFullYear()) {
  return `CT-${year}-${randomCode()}`;
}

async function createUniqueTrackingNumber() {
  for (let attempt = 0; attempt < 12; attempt += 1) {
    const trackingNumber = formatTrackingNumber();
    const exists = await Complaint.exists({ trackingNumber });
    if (!exists) return trackingNumber;
  }
  throw new Error("Could not generate a unique tracking number");
}

module.exports = { createUniqueTrackingNumber, formatTrackingNumber };
