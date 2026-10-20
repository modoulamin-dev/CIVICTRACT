import { ArrowLeftRight, Check } from "lucide-react";
import { STATUS_META, STATUS_ORDER } from "../utils/meta.js";
import { formatDate } from "../utils/strings.js";

// Large stepper for the Track page. Reached steps use the brand green.
export function StatusSteps({ status }) {
  const current = STATUS_ORDER.indexOf(status);
  return (
    <ol className="relative grid grid-cols-4" aria-label="Progress">
      {STATUS_ORDER.map((step, index) => {
        const meta = STATUS_META[step];
        const Icon = meta.icon;
        const done = index < current || status === "resolved";
        const active = index === current && status !== "resolved";
        return (
          <li key={step} className="relative flex flex-col items-center text-center" aria-current={active ? "step" : undefined}>
            {index > 0 ? (
              <span
                className={`absolute top-5 right-1/2 h-0.5 w-full -translate-y-1/2 ${index <= current ? "bg-brand-500" : "bg-slate-200"}`}
                aria-hidden="true"
              />
            ) : null}
            <span
              className={`relative z-10 grid size-10 place-items-center rounded-full ring-4 ring-white transition ${
                done
                  ? "bg-brand-600 text-white"
                  : active
                    ? "bg-white text-brand-700 shadow-[0_0_0_2px_var(--color-brand-500)]"
                    : "bg-slate-100 text-slate-400"
              }`}
            >
              {done ? <Check className="size-5" strokeWidth={3} /> : <Icon className="size-5" />}
            </span>
            <span
              className={`mt-2.5 text-xs font-semibold sm:text-sm ${done || active ? "text-slate-900" : "text-slate-400"}`}
            >
              {meta.label}
            </span>
            {active ? <span className="mt-0.5 hidden text-xs text-brand-700 sm:block">Current stage</span> : null}
          </li>
        );
      })}
    </ol>
  );
}

export function Timeline({ updates = [] }) {
  const items = [...updates].reverse();
  if (items.length === 0) return <p className="text-slate-500">No updates yet.</p>;
  return (
    <ol>
      {items.map((item, index) => {
        const meta = item.toStatus ? STATUS_META[item.toStatus] : null;
        const Icon = meta ? meta.icon : ArrowLeftRight;
        const latest = index === 0;
        return (
          <li key={item.id} className="relative flex gap-4 pb-7 last:pb-0">
            {index < items.length - 1 ? (
              <span className="absolute top-10 bottom-1 left-[17px] w-px bg-slate-200" aria-hidden="true" />
            ) : null}
            <span
              className={`grid size-9 shrink-0 place-items-center rounded-full ring-1 ring-inset ${
                meta ? meta.pill : "bg-slate-100 text-slate-600 ring-slate-200"
              } ${latest ? "ring-2" : ""}`}
              aria-hidden="true"
            >
              <Icon className="size-4" />
            </span>
            <div className={`min-w-0 flex-1 ${latest ? "rounded-xl border border-slate-200 bg-slate-50/70 p-4" : "pt-1.5"}`}>
              <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                <p className="font-semibold text-slate-900">{meta ? meta.label : "Department changed"}</p>
                <time className="text-xs text-slate-500">{formatDate(item.createdAt)}</time>
              </div>
              {item.message ? <p className="mt-1 text-slate-700">{item.message}</p> : null}
              <p className="mt-1 text-sm text-slate-500">by {item.author?.name}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
