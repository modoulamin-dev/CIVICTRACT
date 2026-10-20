import { Link } from "react-router-dom";
import { ArrowRight, CircleCheck, Clock, Inbox, MapPin, Siren } from "lucide-react";
import { listComplaints, stats } from "../../data/mock.js";
import { CategoryIcon, OverdueBadge, StatusBadge, UrgentBadge } from "../../components/StatusBadge.jsx";
import { CATEGORY_META, timeAgo } from "../../utils/meta.js";

const TILES = [
  { key: "open", label: "Open complaints", icon: Inbox, tone: "bg-sky-50 text-sky-600", note: "Across all offices" },
  { key: "urgent", label: "Urgent", icon: Siren, tone: "bg-red-50 text-red-600", note: "Flagged by staff" },
  { key: "overdue", label: "Overdue", icon: Clock, tone: "bg-amber-50 text-amber-600", note: "Open more than 7 days" },
  { key: "resolved", label: "Resolved", icon: CircleCheck, tone: "bg-emerald-50 text-emerald-600", note: "Closed with a public note" },
];

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

// Horizontal bars, one series each; values are direct labels in text ink.
function BarList({ items, colorFor, labelFor = (item) => item.label, iconFor }) {
  const max = Math.max(...items.map((item) => item.value), 1);
  return (
    <ul className="space-y-4">
      {items.map((item) => (
        <li key={item.label} className="group" title={`${labelFor(item)}: ${item.value} open`}>
          <div className="flex items-center justify-between gap-3 text-sm">
            <span className="flex items-center gap-2 font-medium text-slate-700">
              {iconFor ? iconFor(item) : null}
              {labelFor(item)}
            </span>
            <span className="font-bold text-slate-900 tabular-nums">{item.value}</span>
          </div>
          <div className="mt-1.5 h-2 rounded-full bg-slate-100">
            <div
              className={`h-2 rounded-full transition-all duration-700 group-hover:opacity-80 ${colorFor(item)}`}
              style={{ width: `${(item.value / max) * 100}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}

function Panel({ title, subtitle, action, children }) {
  return (
    <section className="card">
      <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-5 py-4">
        <div>
          <h2 className="font-bold text-slate-900">{title}</h2>
          {subtitle ? <p className="text-sm text-slate-500">{subtitle}</p> : null}
        </div>
        {action}
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}

export function Dashboard() {
  const s = stats();
  const attention = listComplaints()
    .filter((c) => c.status !== "resolved" && (c.isUrgent || c.isStale))
    .sort((a, b) => Number(b.isUrgent) - Number(a.isUrgent));
  const topArea = s.byArea[0];

  return (
    <div className="animate-rise">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">{greeting()}, Admin</h1>
          <p className="mt-1 text-slate-500">Here is what is happening across every office today.</p>
        </div>
        <Link to="/admin/complaints" className="btn btn-primary self-start">
          Open queue <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 xl:grid-cols-4">
        {TILES.map((tile) => {
          const Icon = tile.icon;
          return (
            <div key={tile.key} className="card p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-600">{tile.label}</p>
                <span className={`grid size-9 place-items-center rounded-xl ${tile.tone}`}>
                  <Icon className="size-[18px]" aria-hidden="true" />
                </span>
              </div>
              <p className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 tabular-nums">{s[tile.key]}</p>
              <p className="mt-1 text-xs text-slate-500">{tile.note}</p>
            </div>
          );
        })}
      </div>

      {topArea ? (
        <div className="mt-6 flex items-center gap-4 rounded-2xl bg-gradient-to-r from-brand-700 to-brand-600 p-5 text-white shadow-sm">
          <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-white/15 ring-1 ring-white/20">
            <MapPin className="size-5" aria-hidden="true" />
          </span>
          <p className="text-sm sm:text-base">
            <span className="font-bold">{topArea.label}</span> has the most open complaints right now ({topArea.value}).{" "}
            <span className="text-brand-100">Consider sending a crew to look at the area as a whole.</span>
          </p>
        </div>
      ) : null}

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <Panel
            title="Needs attention"
            subtitle="Urgent and overdue complaints"
            action={
              <Link to="/admin/complaints" className="text-sm font-semibold text-brand-700 hover:text-brand-800">
                View all
              </Link>
            }
          >
            {attention.length === 0 ? (
              <p className="text-sm text-slate-500">Nothing urgent or overdue. Nice work.</p>
            ) : (
              <ul className="-mx-2 -my-2 divide-y divide-slate-100">
                {attention.map((item) => (
                  <li key={item.id}>
                    <Link
                      to={`/admin/complaints/${item.id}`}
                      className="group flex items-center gap-4 rounded-xl px-2 py-3 transition hover:bg-slate-50"
                    >
                      <CategoryIcon category={item.category} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-semibold text-slate-900 group-hover:text-brand-700">{item.title}</p>
                        <p className="truncate text-sm text-slate-500">
                          {item.location.area} · {item.department.name} · {timeAgo(item.createdAt)}
                        </p>
                      </div>
                      <div className="hidden shrink-0 flex-wrap justify-end gap-1.5 sm:flex">
                        {item.isUrgent ? <UrgentBadge /> : null}
                        {item.isStale ? <OverdueBadge /> : null}
                        <StatusBadge status={item.status} />
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </div>
        <div className="space-y-6">
          <Panel title="Open by area" subtitle="Where problems are piling up">
            <BarList items={s.byArea.slice(0, 6)} colorFor={() => "bg-gradient-to-r from-brand-500 to-brand-600"} />
          </Panel>
          <Panel title="Open by type">
            <BarList
              items={s.byCategory}
              colorFor={(item) => CATEGORY_META[item.label].solid}
              labelFor={(item) => CATEGORY_META[item.label].label}
              iconFor={(item) => {
                const Icon = CATEGORY_META[item.label].icon;
                return <Icon className="size-4 text-slate-400" aria-hidden="true" />;
              }}
            />
          </Panel>
        </div>
      </div>
    </div>
  );
}
