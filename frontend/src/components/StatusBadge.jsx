import { Clock, Siren } from "lucide-react";
import { CATEGORY_META, STATUS_META, STATUS_ORDER } from "../utils/meta.js";

const PILL = "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset whitespace-nowrap";

export function StatusBadge({ status }) {
  const meta = STATUS_META[status];
  return (
    <span className={`${PILL} ${meta.pill}`}>
      <span className={`size-1.5 rounded-full ${meta.dot}`} aria-hidden="true" />
      {meta.label}
    </span>
  );
}

export function UrgentBadge() {
  return (
    <span className={`${PILL} bg-red-50 text-red-700 ring-red-200`}>
      <Siren className="size-3.5" aria-hidden="true" />
      Urgent
    </span>
  );
}

export function OverdueBadge() {
  return (
    <span className={`${PILL} bg-white text-slate-600 ring-slate-300`}>
      <Clock className="size-3.5" aria-hidden="true" />
      Over 7 days
    </span>
  );
}

const ICON_SIZES = {
  sm: "size-8 rounded-lg [&>svg]:size-4",
  md: "size-10 rounded-xl [&>svg]:size-5",
  lg: "size-12 rounded-2xl [&>svg]:size-6",
};

export function CategoryIcon({ category, size = "md" }) {
  const meta = CATEGORY_META[category] || CATEGORY_META.other;
  const Icon = meta.icon;
  return (
    <span className={`grid shrink-0 place-items-center ring-1 ring-inset ${meta.chip} ${ICON_SIZES[size]}`} aria-hidden="true">
      <Icon strokeWidth={2} />
    </span>
  );
}

// Four-segment progress bar: received → assigned → in progress → resolved.
export function MiniProgress({ status }) {
  const current = STATUS_ORDER.indexOf(status);
  const color = STATUS_META[status].bar;
  return (
    <div className="flex gap-1" role="img" aria-label={`Progress: ${STATUS_META[status].label}`}>
      {STATUS_ORDER.map((step, index) => (
        <span key={step} className={`h-1.5 flex-1 rounded-full ${index <= current ? color : "bg-slate-100"}`} />
      ))}
    </div>
  );
}
