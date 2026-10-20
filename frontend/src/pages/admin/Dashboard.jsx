import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { listComplaints, stats } from "../../data/mock.js";
import { CategoryIcon, OverdueBadge, StatusBadge, UrgentBadge } from "../../components/StatusBadge.jsx";
import { CATEGORY_META, timeAgo } from "../../utils/meta.js";

// Horizontal bars, one neutral series; values are direct labels.
function BarList({ items, labelFor = (item) => item.label }) {
  const max = Math.max(...items.map((item) => item.value), 1);
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item.label} title={`${labelFor(item)}: ${item.value} open`}>
          <div className="flex justify-between text-[13px]">
            <span className="text-neutral-600">{labelFor(item)}</span>
            <span className="font-medium tabular-nums">{item.value}</span>
          </div>
          <div className="mt-1.5 h-1.5 rounded-full bg-neutral-100">
            <div className="h-1.5 rounded-full bg-neutral-800" style={{ width: `${(item.value / max) * 100}%` }} />
          </div>
        </li>
      ))}
    </ul>
  );
}

function Panel({ title, action, children }) {
  return (
    <section className="card">
      <div className="flex h-11 items-center justify-between border-b border-neutral-200 px-4">
        <h2 className="text-sm font-medium">{title}</h2>
        {action}
      </div>
      <div className="p-4">{children}</div>
    </section>
  );
}

export function Dashboard() {
  const s = stats();
  const attention = listComplaints()
    .filter((c) => c.status !== "resolved" && (c.isUrgent || c.isStale))
    .sort((a, b) => Number(b.isUrgent) - Number(a.isUrgent));

  return (
    <div className="animate-fade">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Overview</h1>
          <p className="mt-1 text-neutral-500">All offices · live</p>
        </div>
        <Link to="/admin/complaints" className="btn btn-secondary btn-sm">
          Open queue <ArrowRight className="size-3.5" aria-hidden="true" />
        </Link>
      </div>

      <dl className="card mt-6 grid grid-cols-2 divide-neutral-200 lg:grid-cols-4 lg:divide-x">
        {[
          ["Open", s.open, null],
          ["Urgent", s.urgent, "bg-red-500"],
          ["Overdue", s.overdue, "bg-amber-500"],
          ["Resolved", s.resolved, "bg-emerald-500"],
        ].map(([label, value, dot]) => (
          <div key={label} className="p-4">
            <dt className="flex items-center gap-1.5 text-[13px] text-neutral-500">
              {dot ? <span className={`size-1.5 rounded-full ${dot}`} aria-hidden="true" /> : null}
              {label}
            </dt>
            <dd className="mt-1 text-2xl font-semibold tracking-tight tabular-nums">{value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
        <Panel
          title="Needs attention"
          action={
            <Link to="/admin/complaints" className="text-[13px] text-neutral-500 hover:text-neutral-900">
              View all
            </Link>
          }
        >
          {attention.length === 0 ? (
            <p className="text-neutral-500">Nothing urgent or overdue.</p>
          ) : (
            <ul className="-m-4 divide-y divide-neutral-100">
              {attention.map((item) => (
                <li key={item.id}>
                  <Link to={`/admin/complaints/${item.id}`} className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-neutral-50">
                    <CategoryIcon category={item.category} size="sm" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{item.title}</p>
                      <p className="truncate text-[13px] text-neutral-500">
                        {item.location.area} · {item.department.name}
                      </p>
                    </div>
                    <div className="hidden shrink-0 items-center gap-1.5 sm:flex">
                      {item.isUrgent ? <UrgentBadge /> : null}
                      {item.isStale ? <OverdueBadge /> : null}
                      <StatusBadge status={item.status} />
                    </div>
                    <span className="hidden w-14 shrink-0 text-right text-xs text-neutral-400 md:block">{timeAgo(item.createdAt)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Panel>
        <div className="space-y-6">
          <Panel title="Open by area">
            <BarList items={s.byArea.slice(0, 6)} />
          </Panel>
          <Panel title="Open by type">
            <BarList items={s.byCategory} labelFor={(item) => CATEGORY_META[item.label].label} />
          </Panel>
        </div>
      </div>
    </div>
  );
}
