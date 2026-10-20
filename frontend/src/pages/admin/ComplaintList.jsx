import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ChevronRight, Inbox, Search, Siren } from "lucide-react";
import { listComplaints } from "../../data/mock.js";
import { CategoryIcon, OverdueBadge, StatusBadge, UrgentBadge } from "../../components/StatusBadge.jsx";
import { CATEGORY_META, STATUS_META, STATUS_ORDER, timeAgo } from "../../utils/meta.js";

export function ComplaintList() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [status, setStatus] = useState("");
  const [category, setCategory] = useState("");
  const [urgentOnly, setUrgentOnly] = useState(params.get("urgent") === "1");
  const [query, setQuery] = useState("");

  const base = listComplaints({ category, urgentOnly });
  const q = query.trim().toLowerCase();
  const searched = q
    ? base.filter((c) => [c.title, c.trackingNumber, c.location.area].some((v) => v.toLowerCase().includes(q)))
    : base;
  const items = status ? searched.filter((c) => c.status === status) : searched;
  const tabs = [{ value: "", label: "All", count: searched.length }].concat(
    STATUS_ORDER.map((s) => ({ value: s, label: STATUS_META[s].label, count: searched.filter((c) => c.status === s).length }))
  );

  return (
    <div className="animate-rise">
      <h1 className="text-2xl font-extrabold tracking-tight">Complaints</h1>
      <p className="mt-1 text-slate-500">Every report across all offices. Click a row to respond.</p>

      <div className="card mt-6 overflow-hidden">
        <div className="flex gap-1 overflow-x-auto border-b border-slate-100 px-3 pt-3">
          {tabs.map((tab) => {
            const active = status === tab.value;
            return (
              <button
                key={tab.label}
                type="button"
                onClick={() => setStatus(tab.value)}
                className={`relative flex items-center gap-2 px-3 pb-3 text-sm font-semibold whitespace-nowrap transition-colors ${
                  active ? "text-slate-900" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {tab.label}
                <span
                  className={`rounded-full px-2 py-0.5 text-xs tabular-nums ${
                    active ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {tab.count}
                </span>
                {active ? <span className="absolute inset-x-1 -bottom-px h-0.5 rounded-full bg-brand-600" /> : null}
              </button>
            );
          })}
        </div>

        <div className="flex flex-col gap-3 border-b border-slate-100 bg-slate-50/60 p-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            <input
              type="search"
              aria-label="Search complaints"
              placeholder="Search by title, tracking number or area"
              className="input py-2 pl-9 text-sm"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <select aria-label="Type" className="input w-full py-2 text-sm sm:w-48" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">All types</option>
            {Object.entries(CATEGORY_META).map(([key, meta]) => (
              <option key={key} value={key}>
                {meta.label}
              </option>
            ))}
          </select>
          <button
            type="button"
            aria-pressed={urgentOnly}
            onClick={() => setUrgentOnly((v) => !v)}
            className={`btn shrink-0 py-2 ring-1 ${
              urgentOnly ? "bg-red-50 text-red-700 ring-red-200" : "bg-white text-slate-700 ring-slate-200 hover:bg-slate-50"
            }`}
          >
            <Siren className="size-4" aria-hidden="true" /> Urgent only
          </button>
        </div>

        {/* Table on wide screens, stacked rows on phones. */}
        <table className="hidden w-full text-left text-sm md:table">
          <thead className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
            <tr className="border-b border-slate-100">
              <th className="px-5 py-3">Complaint</th>
              <th className="px-5 py-3">Area</th>
              <th className="px-5 py-3">Office</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3 text-right">Reported</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.map((item) => (
              <tr
                key={item.id}
                className="group cursor-pointer transition-colors hover:bg-slate-50/80"
                onClick={() => navigate(`/admin/complaints/${item.id}`)}
              >
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <CategoryIcon category={item.category} size="sm" />
                    <div className="min-w-0">
                      <Link
                        to={`/admin/complaints/${item.id}`}
                        className="block max-w-xs truncate font-semibold text-slate-900 group-hover:text-brand-700"
                      >
                        {item.title}
                      </Link>
                      <p className="font-mono text-xs text-slate-500">{item.trackingNumber}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3.5 text-slate-700">{item.location.area}</td>
                <td className="px-5 py-3.5 text-slate-700">{item.department.name}</td>
                <td className="px-5 py-3.5">
                  <div className="flex flex-wrap gap-1.5">
                    {item.isUrgent ? <UrgentBadge /> : null}
                    <StatusBadge status={item.status} />
                    {item.isStale ? <OverdueBadge /> : null}
                  </div>
                </td>
                <td className="px-5 py-3.5 text-right whitespace-nowrap text-slate-500">
                  <span className="inline-flex items-center gap-2">
                    {timeAgo(item.createdAt)}
                    <ChevronRight className="size-4 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-slate-500" />
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <ul className="divide-y divide-slate-100 md:hidden">
          {items.map((item) => (
            <li key={item.id}>
              <Link to={`/admin/complaints/${item.id}`} className="flex gap-3 px-4 py-4 hover:bg-slate-50">
                <CategoryIcon category={item.category} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-slate-900">{item.title}</p>
                  <p className="text-sm text-slate-500">
                    {item.location.area} · {timeAgo(item.createdAt)}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {item.isUrgent ? <UrgentBadge /> : null}
                    <StatusBadge status={item.status} />
                    {item.isStale ? <OverdueBadge /> : null}
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>

        {items.length === 0 ? (
          <div className="px-4 py-14 text-center">
            <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-slate-100 text-slate-500">
              <Inbox className="size-6" aria-hidden="true" />
            </span>
            <p className="mt-4 font-semibold text-slate-900">No complaints match</p>
            <p className="text-sm text-slate-500">Try another status, type or search.</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
