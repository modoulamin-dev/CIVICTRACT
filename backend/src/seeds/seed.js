const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../../.env") });
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const { env } = require("../config/env");
const User = require("../models/User");
const Department = require("../models/Department");
const Complaint = require("../models/Complaint");
const StatusUpdate = require("../models/StatusUpdate");
const { createUniqueTrackingNumber } = require("../services/trackingNumber");

const departments = [
  {
    name: "Roads and Public Works",
    categories: ["roads"],
    contactEmail: "roads@example.gm",
    contactPhone: "+220 000 1001",
  },
  {
    name: "Waste Management / Environment Agency",
    categories: ["waste"],
    contactEmail: "waste@example.gm",
    contactPhone: "+220 000 1002",
  },
  {
    name: "Water Utility",
    categories: ["water"],
    contactEmail: "water@example.gm",
    contactPhone: "+220 000 1003",
  },
  {
    name: "Public Safety / Municipal Council",
    categories: ["unsafe_spaces"],
    contactEmail: "safety@example.gm",
    contactPhone: "+220 000 1004",
  },
  {
    name: "General Complaints Desk",
    categories: ["other"],
    contactEmail: "desk@example.gm",
    contactPhone: "+220 000 1005",
  },
];

const staffAccounts = [
  { name: "Roads Officer", email: "roads@civictract.gm", departmentName: "Roads and Public Works" },
  { name: "Waste Officer", email: "waste@civictract.gm", departmentName: "Waste Management / Environment Agency" },
  { name: "Water Officer", email: "water@civictract.gm", departmentName: "Water Utility" },
  { name: "Safety Officer", email: "safety@civictract.gm", departmentName: "Public Safety / Municipal Council" },
  { name: "Desk Officer", email: "desk@civictract.gm", departmentName: "General Complaints Desk" },
];

const samples = [
  {
    category: "roads",
    region: "Kanifing",
    area: "Serrekunda",
    landmark: "Near Westfield junction",
    description:
      "Large potholes on the main road near Westfield make it dangerous for taxis and pedestrians, especially after rain.",
    status: "in_progress",
    isUrgent: true,
    daysAgo: 4,
  },
  {
    category: "waste",
    region: "Banjul",
    area: "Banjul Central",
    landmark: "Albert Market side street",
    description:
      "Household waste has not been collected for over a week and bags are spilling into the street.",
    status: "assigned",
    isUrgent: false,
    daysAgo: 2,
  },
  {
    category: "water",
    region: "West Coast Region",
    area: "Brikama",
    landmark: "Near the garage",
    description:
      "The public tap has been dry for three days. Nearby compounds are sharing a single well.",
    status: "assigned",
    isUrgent: true,
    daysAgo: 1,
  },
  {
    category: "unsafe_spaces",
    region: "Kanifing",
    area: "Bakau",
    landmark: "Cape Point walkway",
    description:
      "Broken street lights along the walkway leave the area dark at night and people avoid using it.",
    status: "received",
    isUrgent: false,
    daysAgo: 6,
  },
  {
    category: "other",
    region: "North Bank Region",
    area: "Barra",
    landmark: "Ferry terminal",
    description:
      "Queue information at the ferry is confusing and there is no clear public notice when services delay.",
    status: "resolved",
    isUrgent: false,
    daysAgo: 12,
    resolvedDaysAgo: 3,
  },
];

async function seed() {
  await mongoose.connect(env.mongodbUri);
  await Promise.all([
    User.deleteMany({}),
    Department.deleteMany({}),
    Complaint.deleteMany({}),
    StatusUpdate.deleteMany({}),
  ]);

  const createdDepartments = await Department.insertMany(departments);
  const byName = Object.fromEntries(createdDepartments.map((item) => [item.name, item]));
  const byCategory = {
    roads: byName["Roads and Public Works"],
    waste: byName["Waste Management / Environment Agency"],
    water: byName["Water Utility"],
    unsafe_spaces: byName["Public Safety / Municipal Council"],
    other: byName["General Complaints Desk"],
  };

  const adminHash = await bcrypt.hash(process.env.SEED_ADMIN_PASSWORD || "CivicTract2026!", 10);
  await User.create({
    name: "CivicTract Super Admin",
    email: process.env.SEED_ADMIN_EMAIL || "admin@civictract.gm",
    passwordHash: adminHash,
    role: "super_admin",
    isActive: true,
  });

  const staffHash = await bcrypt.hash("Staff123!", 10);
  await User.insertMany(
    staffAccounts.map((account) => ({
      name: account.name,
      email: account.email,
      passwordHash: staffHash,
      role: "staff",
      department: byName[account.departmentName]._id,
      isActive: true,
    }))
  );

  for (const sample of samples) {
    const createdAt = new Date(Date.now() - sample.daysAgo * 86400000);
    const trackingNumber = await createUniqueTrackingNumber();
    const department = byCategory[sample.category];
    const complaint = await Complaint.create({
      trackingNumber,
      category: sample.category,
      title: sample.description.slice(0, 70),
      description: sample.description,
      location: { region: sample.region, area: sample.area, landmark: sample.landmark },
      status: sample.status === "received" ? "assigned" : sample.status,
      isUrgent: sample.isUrgent,
      department: department._id,
      reporter: { name: "Anonymous citizen" },
      isPublic: true,
      resolvedAt: sample.resolvedDaysAgo ? new Date(Date.now() - sample.resolvedDaysAgo * 86400000) : undefined,
    });
    complaint.createdAt = createdAt;
    complaint.updatedAt = createdAt;
    await complaint.save();
    await StatusUpdate.create({
      complaint: complaint._id,
      type: "status_change",
      toStatus: "received",
      message: "Complaint received.",
      visibility: "public",
      createdAt,
    });
    await StatusUpdate.create({
      complaint: complaint._id,
      type: "status_change",
      fromStatus: "received",
      toStatus: "assigned",
      message: `Routed to ${department.name}.`,
      visibility: "public",
      createdAt,
    });
    if (sample.status === "in_progress" || sample.status === "resolved") {
      await StatusUpdate.create({
        complaint: complaint._id,
        type: "status_change",
        fromStatus: "assigned",
        toStatus: "in_progress",
        message: "A team has been assigned to inspect the site.",
        visibility: "public",
      });
    }
    if (sample.status === "resolved") {
      await StatusUpdate.create({
        complaint: complaint._id,
        type: "status_change",
        fromStatus: "in_progress",
        toStatus: "resolved",
        message: "Notices were posted and a staff member is now present during peak ferry hours.",
        visibility: "public",
      });
    }
  }

  console.log("Seed complete.");
  console.log("Super admin: admin@civictract.gm / CivicTract2026!");
  console.log("Staff: roads@civictract.gm (and waste, water, safety, desk) / Staff123!");
  await mongoose.disconnect();
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
