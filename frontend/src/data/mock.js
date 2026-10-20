// Static stand-in for the API while the UI is designed. Every function returns the
// same shape the backend sends (see backend/src/utils/publicShape.js), so swapping
// these calls for src/api/* later should not change the pages.
// Data lives in memory: a report submitted here shows up on Track and in the admin
// views until the page is reloaded.

const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;

function ago(days, hours = 0) {
  return new Date(Date.now() - days * DAY - hours * HOUR).toISOString();
}

export const departments = [
  { id: "d-roads", name: "Roads & Drainage Unit", categories: ["roads"], contactPhone: "+220 422 0001" },
  { id: "d-waste", name: "Waste Management Services", categories: ["waste"], contactPhone: "+220 422 0002" },
  { id: "d-water", name: "Water Services Desk", categories: ["water"], contactPhone: "+220 422 0003" },
  { id: "d-safety", name: "Community Safety Unit", categories: ["unsafe_spaces"], contactPhone: "+220 422 0004" },
  { id: "d-desk", name: "General Complaints Desk", categories: ["other"], contactPhone: "+220 422 0005" },
];

function dept(id) {
  return departments.find((item) => item.id === id);
}

function update(id, toStatus, message, daysAgo, hoursAgo = 0, author = "CivicTract") {
  return { id, type: "status_change", toStatus, message, createdAt: ago(daysAgo, hoursAgo), author: { name: author } };
}

let complaints = [
  {
    id: "c1",
    trackingNumber: "CT-2026-W7K3PA",
    category: "water",
    title: "Burst pipe flooding the road",
    description: "A main pipe has burst near the junction. Water has been running since morning and the road is flooding.",
    location: { region: "West Coast Region", area: "Brikama", landmark: "Opposite Brikama market gate" },
    status: "in_progress",
    isUrgent: true,
    department: dept("d-water"),
    reporter: { name: "Fatou Ceesay", phone: "+220 700 1122" },
    createdAt: ago(1, 5),
    updates: [
      update("u1", "received", "Complaint received.", 1, 5),
      update("u2", "assigned", "Routed to Water Services Desk.", 1, 5),
      update("u3", "in_progress", "Crew dispatched to isolate the pipe.", 0, 20, "Water Services Desk"),
    ],
  },
  {
    id: "c2",
    trackingNumber: "CT-2026-B4N8QR",
    category: "waste",
    title: "Rubbish not collected for two weeks",
    description: "Waste has piled up at the collection point and is spilling onto the street. The smell is very strong.",
    location: { region: "Kanifing", area: "Serrekunda", landmark: "Behind Serrekunda market" },
    status: "assigned",
    isUrgent: false,
    department: dept("d-waste"),
    reporter: { name: "Lamin Jallow" },
    createdAt: ago(9),
    updates: [
      update("u1", "received", "Complaint received.", 9),
      update("u2", "assigned", "Routed to Waste Management Services.", 9),
    ],
  },
  {
    id: "c3",
    trackingNumber: "CT-2026-H2M6TX",
    category: "waste",
    title: "Illegal dumping beside the school",
    description: "People are dumping waste on the empty plot next to the lower basic school. Children walk past it every day.",
    location: { region: "Kanifing", area: "Bundung", landmark: "Bundung Lower Basic School" },
    status: "received",
    isUrgent: true,
    department: dept("d-waste"),
    reporter: {},
    createdAt: ago(0, 6),
    updates: [update("u1", "received", "Complaint received.", 0, 6)],
  },
  {
    id: "c4",
    trackingNumber: "CT-2026-R9P5LC",
    category: "roads",
    title: "Large pothole on Kairaba Avenue",
    description: "Deep pothole in the middle lane. Cars are swerving into oncoming traffic to avoid it.",
    location: { region: "Kanifing", area: "Pipeline", landmark: "Near the traffic lights" },
    status: "resolved",
    isUrgent: false,
    department: dept("d-roads"),
    reporter: { name: "Awa Touray" },
    createdAt: ago(14),
    resolvedAt: ago(3),
    updates: [
      update("u1", "received", "Complaint received.", 14),
      update("u2", "assigned", "Routed to Roads & Drainage Unit.", 14),
      update("u3", "in_progress", "Repair scheduled for this week.", 8, 0, "Roads & Drainage Unit"),
      update("u4", "resolved", "Pothole filled and resurfaced.", 3, 0, "Roads & Drainage Unit"),
    ],
  },
  {
    id: "c5",
    trackingNumber: "CT-2026-S3D7FG",
    category: "unsafe_spaces",
    title: "Street lights out along the beach road",
    description: "The whole stretch has been dark for a week. People feel unsafe walking home at night.",
    location: { region: "Kanifing", area: "Bakau", landmark: "Cape Point road" },
    status: "in_progress",
    isUrgent: false,
    department: dept("d-safety"),
    reporter: { name: "Musa Bah" },
    createdAt: ago(6),
    updates: [
      update("u1", "received", "Complaint received.", 6),
      update("u2", "assigned", "Routed to Community Safety Unit.", 6),
      update("u3", "in_progress", "Electrical team has inspected the line. Parts ordered.", 2, 0, "Community Safety Unit"),
    ],
  },
  {
    id: "c6",
    trackingNumber: "CT-2026-K8V2JN",
    category: "roads",
    title: "Blocked drain causing flooding",
    description: "The drain is full of sand and plastic. Every rain the street floods into people's compounds.",
    location: { region: "Banjul", area: "Banjul", landmark: "Leman Street" },
    status: "assigned",
    isUrgent: false,
    department: dept("d-roads"),
    reporter: {},
    createdAt: ago(11),
    updates: [
      update("u1", "received", "Complaint received.", 11),
      update("u2", "assigned", "Routed to Roads & Drainage Unit.", 11),
    ],
  },
  {
    id: "c7",
    trackingNumber: "CT-2026-Q6T4WE",
    category: "water",
    title: "No running water for four days",
    description: "Taps in our area have been dry since Friday. Families are buying water from carts.",
    location: { region: "West Coast Region", area: "Lamin", landmark: "Lamin Daranka" },
    status: "assigned",
    isUrgent: true,
    department: dept("d-water"),
    reporter: { name: "Isatou Sanneh", phone: "+220 300 4455" },
    createdAt: ago(2),
    updates: [
      update("u1", "received", "Complaint received.", 2),
      update("u2", "assigned", "Routed to Water Services Desk.", 2),
    ],
  },
  {
    id: "c8",
    trackingNumber: "CT-2026-M5Y9HB",
    category: "waste",
    title: "Overflowing skip at the car park",
    description: "The skip has not been emptied and rubbish is blowing across the car park.",
    location: { region: "Kanifing", area: "Serrekunda", landmark: "Westfield car park" },
    status: "in_progress",
    isUrgent: false,
    department: dept("d-waste"),
    reporter: {},
    createdAt: ago(4),
    updates: [
      update("u1", "received", "Complaint received.", 4),
      update("u2", "assigned", "Routed to Waste Management Services.", 4),
      update("u3", "in_progress", "Collection truck booked for Thursday.", 1, 0, "Waste Management Services"),
    ],
  },
  {
    id: "c9",
    trackingNumber: "CT-2026-F7C3ZD",
    category: "roads",
    title: "Broken culvert on the main road",
    description: "The culvert has collapsed on one side and the road edge is breaking off.",
    location: { region: "Upper River Region", area: "Basse", landmark: "Near the bridge" },
    status: "received",
    isUrgent: false,
    department: dept("d-roads"),
    reporter: {},
    createdAt: ago(8),
    updates: [update("u1", "received", "Complaint received.", 8)],
  },
  {
    id: "c10",
    trackingNumber: "CT-2026-A2L8RU",
    category: "waste",
    title: "Burning rubbish near homes",
    description: "Waste is being burned every evening on the open ground. The smoke goes into houses.",
    location: { region: "West Coast Region", area: "Brusubi", landmark: "Phase 2 junction" },
    status: "resolved",
    isUrgent: false,
    department: dept("d-waste"),
    reporter: { name: "Ebrima Darboe" },
    createdAt: ago(20),
    resolvedAt: ago(10),
    updates: [
      update("u1", "received", "Complaint received.", 20),
      update("u2", "assigned", "Routed to Waste Management Services.", 20),
      update("u3", "resolved", "Site cleared and warning signs put up.", 10, 0, "Waste Management Services"),
    ],
  },
  {
    id: "c11",
    trackingNumber: "CT-2026-E4G6PK",
    category: "unsafe_spaces",
    title: "Open manhole near the clinic",
    description: "The cover is missing from a manhole on the footpath. Someone could fall in, especially at night.",
    location: { region: "West Coast Region", area: "Farato", landmark: "Farato health centre" },
    status: "assigned",
    isUrgent: true,
    department: dept("d-safety"),
    reporter: {},
    createdAt: ago(1, 6),
    updates: [
      update("u1", "received", "Complaint received.", 1, 6),
      update("u2", "assigned", "Routed to Community Safety Unit.", 1, 6),
    ],
  },
  {
    id: "c12",
    trackingNumber: "CT-2026-N3X5VS",
    category: "waste",
    title: "Market waste left in the gutter",
    description: "After market days the waste is swept into the gutter and never collected.",
    location: { region: "Kanifing", area: "Latrikunda", landmark: "Latrikunda Sabiji" },
    status: "received",
    isUrgent: false,
    department: dept("d-waste"),
    reporter: {},
    createdAt: ago(3),
    updates: [update("u1", "received", "Complaint received.", 3)],
  },
];

const STALE_DAYS = 7;

function withFlags(item) {
  const age = Date.now() - new Date(item.createdAt).getTime();
  return { ...item, isStale: item.status !== "resolved" && age > STALE_DAYS * DAY };
}

function byNewest(a, b) {
  return new Date(b.createdAt) - new Date(a.createdAt);
}

export function listComplaints({ category, region, status, urgentOnly } = {}) {
  return complaints
    .filter((item) => !category || item.category === category)
    .filter((item) => !region || item.location.region === region)
    .filter((item) => !status || item.status === status)
    .filter((item) => !urgentOnly || item.isUrgent)
    .sort(byNewest)
    .map(withFlags);
}

export function getComplaint(id) {
  const item = complaints.find((c) => c.id === id);
  return item ? withFlags(item) : null;
}

export function findByTrackingNumber(trackingNumber) {
  const item = complaints.find((c) => c.trackingNumber === trackingNumber.trim().toUpperCase());
  return item ? withFlags(item) : null;
}

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function trackingNumber() {
  let code = "";
  for (let i = 0; i < 6; i += 1) code += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  return `CT-${new Date().getFullYear()}-${code}`;
}

export function submitComplaint(form) {
  const department = departments.find((d) => d.categories.includes(form.category)) || dept("d-desk");
  const now = new Date().toISOString();
  const item = {
    id: `c${complaints.length + 1}-${Date.now()}`,
    trackingNumber: trackingNumber(),
    category: form.category,
    title: form.description.slice(0, 60),
    description: form.description,
    location: { region: form.region, area: form.area, landmark: form.landmark },
    photoUrl: form.photoUrl,
    status: "assigned",
    isUrgent: false,
    department,
    reporter: { name: form.reporterName, phone: form.phone },
    createdAt: now,
    updates: [
      { id: "u1", type: "status_change", toStatus: "received", message: "Complaint received.", createdAt: now, author: { name: "CivicTract" } },
      { id: "u2", type: "status_change", toStatus: "assigned", message: `Routed to ${department.name}.`, createdAt: now, author: { name: "CivicTract" } },
    ],
  };
  complaints = [item, ...complaints];
  return withFlags(item);
}

function patch(id, change) {
  complaints = complaints.map((item) => (item.id === id ? change(item) : item));
  return getComplaint(id);
}

function addUpdate(item, entry) {
  return [...item.updates, { id: `u${item.updates.length + 1}`, createdAt: new Date().toISOString(), ...entry }];
}

export function updateStatus(id, status, message) {
  return patch(id, (item) => ({
    ...item,
    status,
    resolvedAt: status === "resolved" ? new Date().toISOString() : item.resolvedAt,
    updates: addUpdate(item, { type: "status_change", toStatus: status, message, author: { name: item.department.name } }),
  }));
}

export function setUrgent(id, isUrgent) {
  return patch(id, (item) => ({ ...item, isUrgent }));
}

export function reassign(id, departmentId) {
  const department = dept(departmentId);
  return patch(id, (item) => ({
    ...item,
    department,
    updates: addUpdate(item, { type: "reassignment", message: `Moved to ${department.name}.`, author: { name: "CivicTract" } }),
  }));
}

export function stats() {
  const all = listComplaints();
  const open = all.filter((c) => c.status !== "resolved");
  const count = (items, key) =>
    Object.entries(
      items.reduce((acc, item) => ({ ...acc, [key(item)]: (acc[key(item)] || 0) + 1 }), {})
    )
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => b.value - a.value);

  return {
    open: open.length,
    urgent: open.filter((c) => c.isUrgent).length,
    overdue: open.filter((c) => c.isStale).length,
    resolved: all.length - open.length,
    byArea: count(open, (c) => c.location.area),
    byCategory: count(open, (c) => c.category),
  };
}
