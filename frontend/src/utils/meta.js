import {
  CircleCheck,
  CircleDot,
  Construction,
  Droplets,
  Inbox,
  LoaderCircle,
  MessageSquareWarning,
  ShieldAlert,
  Trash2,
  UserCheck,
} from "lucide-react";

// Visual identity for each category and status. Class names are written out in full
// so Tailwind can find them at build time.
export const CATEGORY_META = {
  roads: {
    label: "Roads & drainage",
    hint: "Potholes, blocked drains, damaged bridges",
    icon: Construction,
    chip: "bg-orange-50 text-orange-600 ring-orange-100",
    solid: "bg-orange-500",
    accent: "from-orange-400 to-amber-400",
  },
  waste: {
    label: "Waste",
    hint: "Uncollected rubbish, dumping, burning",
    icon: Trash2,
    chip: "bg-violet-50 text-violet-600 ring-violet-100",
    solid: "bg-violet-500",
    accent: "from-violet-500 to-fuchsia-400",
  },
  water: {
    label: "Water supply",
    hint: "No supply, burst pipes, dirty water",
    icon: Droplets,
    chip: "bg-sky-50 text-sky-600 ring-sky-100",
    solid: "bg-sky-500",
    accent: "from-sky-500 to-cyan-400",
  },
  unsafe_spaces: {
    label: "Unsafe spaces",
    hint: "Broken street lights, open manholes",
    icon: ShieldAlert,
    chip: "bg-rose-50 text-rose-600 ring-rose-100",
    solid: "bg-rose-500",
    accent: "from-rose-500 to-pink-400",
  },
  other: {
    label: "Other",
    hint: "Anything else in your community",
    icon: MessageSquareWarning,
    chip: "bg-slate-100 text-slate-600 ring-slate-200",
    solid: "bg-slate-500",
    accent: "from-slate-500 to-slate-400",
  },
};

export const STATUS_META = {
  received: {
    label: "Received",
    icon: Inbox,
    pill: "bg-slate-100 text-slate-700 ring-slate-200",
    dot: "bg-slate-400",
    bar: "bg-slate-400",
  },
  assigned: {
    label: "Assigned",
    icon: UserCheck,
    pill: "bg-blue-50 text-blue-700 ring-blue-200",
    dot: "bg-blue-500",
    bar: "bg-blue-500",
  },
  in_progress: {
    label: "In progress",
    icon: LoaderCircle,
    pill: "bg-amber-50 text-amber-800 ring-amber-200",
    dot: "bg-amber-500",
    bar: "bg-amber-500",
  },
  resolved: {
    label: "Resolved",
    icon: CircleCheck,
    pill: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    dot: "bg-emerald-500",
    bar: "bg-emerald-500",
  },
};

export const STATUS_ORDER = ["received", "assigned", "in_progress", "resolved"];

export const FallbackStatusIcon = CircleDot;

export function timeAgo(value) {
  const diff = Date.now() - new Date(value).getTime();
  const minutes = Math.round(diff / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} h ago`;
  const days = Math.round(hours / 24);
  if (days < 30) return `${days} ${days === 1 ? "day" : "days"} ago`;
  return new Date(value).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}
