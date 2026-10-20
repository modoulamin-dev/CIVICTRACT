import { CATEGORY_META, STATUS_META, STATUS_ORDER } from "../utils/meta.js";

const BADGE = "inline-flex h-5 items-center gap-1.5 rounded-full border px-2 text-xs font-medium whitespace-nowrap";

export function StatusBadge({ status }) {
  const meta = STATUS_META[status];
  return (
    <span className={`${BADGE} border-neutral-200 bg-white text-neutral-700`}>
      <span className={`size-1.5 rounded-full ${meta.dot}`} aria-hidden="true" />
      {meta.label}
    </span>
  );
}

export function UrgentBadge() {
  return (
    <span className={`${BADGE} border-red-200 bg-red-50 text-red-700`}>
      <span className="size-1.5 rounded-full bg-red-500" aria-hidden="true" />
      Urgent
    </span>
  );
}

export function OverdueBadge() {
  return <span className={`${BADGE} border-neutral-200 bg-neutral-50 text-neutral-500`}>Over 7 days</span>;
}

const ICON_SIZES = {
  sm: "size-7 [&>svg]:size-3.5",
  md: "size-8 [&>svg]:size-4",
  lg: "size-10 [&>svg]:size-5",
};

export function CategoryIcon({ category, size = "md" }) {
  const Icon = (CATEGORY_META[category] || CATEGORY_META.other).icon;
  return (
    <span
      className={`grid shrink-0 place-items-center rounded-md border border-neutral-200 bg-neutral-50 text-neutral-600 ${ICON_SIZES[size]}`}
      aria-hidden="true"
    >
      <Icon strokeWidth={1.75} />
    </span>
  );
}

// Four-segment progress: received → assigned → in progress → resolved.
export function MiniProgress({ status }) {
  const current = STATUS_ORDER.indexOf(status);
  return (
    <div className="flex gap-0.5" role="img" aria-label={`Progress: ${STATUS_META[status].label}`}>
      {STATUS_ORDER.map((step, index) => (
        <span key={step} className={`h-1 flex-1 rounded-full ${index <= current ? "bg-neutral-900" : "bg-neutral-200"}`} />
      ))}
    </div>
  );
}
