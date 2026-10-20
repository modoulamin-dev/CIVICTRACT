import { Check } from "lucide-react";
import { STATUS_META, STATUS_ORDER } from "../utils/meta.js";
import { formatDate } from "../utils/strings.js";

export function StatusSteps({ status }) {
  const current = STATUS_ORDER.indexOf(status);
  return (
    <ol className="grid grid-cols-4 gap-2" aria-label="Progress">
      {STATUS_ORDER.map((step, index) => {
        const reached = index <= current;
        const active = index === current;
        return (
          <li key={step} aria-current={active ? "step" : undefined}>
            <div className={`h-1 rounded-full ${reached ? "bg-neutral-900" : "bg-neutral-200"}`} />
            <p className={`mt-2 flex items-center gap-1 text-xs ${reached ? "font-medium text-neutral-900" : "text-neutral-400"}`}>
              {reached && !active ? <Check className="size-3" strokeWidth={2.5} aria-hidden="true" /> : null}
              {STATUS_META[step].label}
            </p>
          </li>
        );
      })}
    </ol>
  );
}

export function Timeline({ updates = [] }) {
  const items = [...updates].reverse();
  if (items.length === 0) return <p className="text-neutral-500">No updates yet.</p>;
  return (
    <ol>
      {items.map((item, index) => {
        const meta = item.toStatus ? STATUS_META[item.toStatus] : null;
        return (
          <li key={item.id} className="relative pb-5 pl-5 last:pb-0">
            {index < items.length - 1 ? (
              <span className="absolute top-3 bottom-0 left-[3px] w-px bg-neutral-200" aria-hidden="true" />
            ) : null}
            <span
              className={`absolute top-[7px] left-0 size-[7px] rounded-full ${meta ? meta.dot : "bg-neutral-400"} ${
                index === 0 ? "ring-4 ring-neutral-100" : ""
              }`}
              aria-hidden="true"
            />
            <div className="flex flex-wrap items-baseline justify-between gap-x-3">
              <p className="font-medium text-neutral-900">{meta ? meta.label : "Office changed"}</p>
              <time className="text-xs text-neutral-400">{formatDate(item.createdAt)}</time>
            </div>
            {item.message ? <p className="mt-0.5 text-neutral-600">{item.message}</p> : null}
            <p className="mt-0.5 text-xs text-neutral-400">{item.author?.name}</p>
          </li>
        );
      })}
    </ol>
  );
}
