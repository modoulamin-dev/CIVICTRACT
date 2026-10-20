import {
  CircleCheck,
  Construction,
  Droplets,
  Inbox,
  LoaderCircle,
  MessageSquareWarning,
  ShieldAlert,
  Trash2,
  UserCheck,
} from "lucide-react";

export const CATEGORY_META = {
  roads: { label: "Roads & drainage", hint: "Potholes, blocked drains, damaged bridges", icon: Construction },
  waste: { label: "Waste", hint: "Uncollected rubbish, dumping, burning", icon: Trash2 },
  water: { label: "Water supply", hint: "No supply, burst pipes, dirty water", icon: Droplets },
  unsafe_spaces: { label: "Unsafe spaces", hint: "Broken street lights, open manholes", icon: ShieldAlert },
  other: { label: "Other", hint: "Anything else in your community", icon: MessageSquareWarning },
};

// Status color lives only in the dot; class names are written out in full for Tailwind.
export const STATUS_META = {
  received: { label: "Received", icon: Inbox, dot: "bg-neutral-400" },
  assigned: { label: "Assigned", icon: UserCheck, dot: "bg-blue-500" },
  in_progress: { label: "In progress", icon: LoaderCircle, dot: "bg-amber-500" },
  resolved: { label: "Resolved", icon: CircleCheck, dot: "bg-emerald-500" },
};

export const STATUS_ORDER = ["received", "assigned", "in_progress", "resolved"];

export function timeAgo(value) {
  const diff = Date.now() - new Date(value).getTime();
  const minutes = Math.round(diff / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(value).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}
