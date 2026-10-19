export const copy = {
  appName: "CivicTract",
  tagline: "Report it. Track it. See it through.",
  homeLead:
    "One place to report damaged roads, uncollected waste, water problems, and unsafe public spaces in The Gambia — and to see what happens next.",
};

export const categories = [
  { value: "roads", label: "Roads" },
  { value: "waste", label: "Waste" },
  { value: "water", label: "Water" },
  { value: "unsafe_spaces", label: "Unsafe spaces" },
  { value: "other", label: "Other" },
];

export const statuses = [
  { value: "received", label: "Received" },
  { value: "assigned", label: "Assigned" },
  { value: "in_progress", label: "In progress" },
  { value: "resolved", label: "Resolved" },
];

export const regions = [
  "Banjul",
  "Kanifing",
  "West Coast Region",
  "North Bank Region",
  "Lower River Region",
  "Central River Region",
  "Upper River Region",
];

export function categoryLabel(value) {
  return categories.find((item) => item.value === value)?.label || value;
}

export function statusLabel(value) {
  return statuses.find((item) => item.value === value)?.label || value;
}

export function formatDate(value) {
  if (!value) return "";
  return new Date(value).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function photoSrc(url) {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  const origin = import.meta.env.VITE_UPLOAD_ORIGIN || "http://localhost:5000";
  return `${origin}${url}`;
}
