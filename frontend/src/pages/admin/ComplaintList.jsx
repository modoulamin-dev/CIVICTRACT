import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { listComplaints } from "../../data/mock.js";
import { CategoryIcon, OverdueBadge, StatusBadge, UrgentBadge } from "../../components/StatusBadge.jsx";
import { CATEGORY_META, STATUS_META, STATUS_ORDER, timeAgo } from "../../utils/meta.js";

export function ComplaintList() {
  const navigate = useNavigate();
  const [status, setStatus] = useState("");
  const [category, setCategory] = useState("");
  const [urgentOnly, setUrgentOnly] = useState(false);
  const [query, setQuery] = useState("");

  const q = query.trim().toLowerCase();
  const searched = listComplaints({ category, urgentOnly }).filter(
    (c) => !q || [c.title, c.trackingNumber, c.location.area].some((v) => v.toLowerCase().includes(q))
  );
  const items = status ? searched.filter((c) => c.status === status) : searched;
  const tabs = [{ value: "", label: "All" }, ...STATUS_ORDER.map((s) => ({ value: s, label: STATUS_META[s].label }))];

  return (
    <div className="animate-fade">
      <h1 className="text-2xl font-semibold tracking-tight">Complaints</h1>
      <p className="mt-1 text-neutral-500">Every report across all offices.</p>

      <div className="mt-6 flex gap-4 overflow-x-auto border-b border-neutral-200">
        {tabs.map((tab) => {
          const active = status === tab.value;
          const count = tab.value ? searched.filter((c) => c.status === tab.value).length : searched.length;
          return (
            <button
              key={tab.label}
              type="button"
              onClick={() => setStatus(tab.value)}
              className={`-mb-px flex items-center gap-1.5 border-b-2 pb-2.5 text-sm whitespace-nowrap transition-colors ${
                active ? "border-neutral-900 text-neutral-900" : "border-transparent text-neutral-500 hover:text-neutral-900"
              }`}
            >
              {tab.label}
              <span className="font-mono text-xs text-neutral-400 tabular-nums">{count}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-neutral-400" aria-hidden="true" />
          <input
            type="search"
            aria-label="Search complaints"
            placeholder="Search…"
            className="input pl-9"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <select aria-label="Type" className="input sm:w-44" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All types</option>
          {Object.entries(CATEGORY_META).map(([key, meta]) => (
            <option key={key} value={key}>
              {meta.label}
            </option>
          ))}
        </select>
        <label className="flex h-9 items-center gap-2 rounded-md border border-neutral-200 bg-white px-3 text-sm shadow-xs">
          <input type="checkbox" className="size-3.5 accent-neutral-900" checked={urgentOnly} onChange={(e) => setUrgentOnly(e.target.checked)} />
          Urgent only
        </label>
      </div>

      <div className="card mt-4 overflow-hidden">
        <table className="hidden w-full text-left md:table">
          <thead className="border-b border-neutral-200 bg-neutral-50/70 text-xs text-neutral-500">
            <tr>
              <th className="px-4 py-2.5 font-medium">Complaint</th>
              <th className="px-4 py-2.5 font-medium">Area</th>
              <th className="px-4 py-2.5 font-medium">Office</th>
              <th className="px-4 py-2.5 font-medium">Status</th>
              <th className="px-4 py-2.5 text-right font-medium">Reported</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {items.map((item) => (
              <tr key={item.id} className="cursor-pointer transition-colors hover:bg-neutral-50" onClick={() => navigate(`/admin/complaints/${item.id}`)}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <CategoryIcon category={item.category} size="sm" />
                    <div className="min-w-0">
                      <Link to={`/admin/complaints/${item.id}`} className="block max-w-xs truncate font-medium">
                        {item.title}
                      </Link>
                      <p className="font-mono text-xs text-neutral-400">{item.trackingNumber}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-neutral-600">{item.location.area}</td>
                <td className="px-4 py-3 text-neutral-600">{item.department.name}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {item.isUrgent ? <UrgentBadge /> : null}
                    <StatusBadge status={item.status} />
                    {item.isStale ? <OverdueBadge /> : null}
                  </div>
                </td>
                <td className="px-4 py-3 text-right whitespace-nowrap text-neutral-500">{timeAgo(item.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <ul className="divide-y divide-neutral-100 md:hidden">
          {items.map((item) => (
            <li key={item.id}>
              <Link to={`/admin/complaints/${item.id}`} className="flex gap-3 p-4 hover:bg-neutral-50">
                <CategoryIcon category={item.category} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{item.title}</p>
                  <p className="text-[13px] text-neutral-500">
                    {item.location.area} · {timeAgo(item.createdAt)}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {item.isUrgent ? <UrgentBadge /> : null}
                    <StatusBadge status={item.status} />
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>

        {items.length === 0 ? <p className="p-10 text-center text-neutral-500">No complaints match.</p> : null}
      </div>
    </div>
  );
}
