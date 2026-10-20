import { useState } from "react";
import { Inbox, RotateCcw } from "lucide-react";
import { listComplaints } from "../../data/mock.js";
import { ComplaintCard } from "../../components/ComplaintCard.jsx";
import { PageHeader } from "../../components/PageHeader.jsx";
import { CategoryIcon } from "../../components/StatusBadge.jsx";
import { CATEGORY_META, STATUS_META, STATUS_ORDER } from "../../utils/meta.js";
import { regions } from "../../utils/strings.js";

const EMPTY = { category: "", region: "", status: "" };

function Chip({ active, onClick, children }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-sm font-semibold whitespace-nowrap ring-1 transition ${
        active ? "bg-slate-900 text-white ring-slate-900" : "bg-white text-slate-700 ring-slate-200 hover:ring-slate-300"
      }`}
    >
      {children}
    </button>
  );
}

export function PublicBoard() {
  const [filters, setFilters] = useState(EMPTY);
  const items = listComplaints(filters);
  const all = listComplaints();
  const filtered = filters.category || filters.region || filters.status;

  function set(field, value) {
    setFilters((prev) => ({ ...prev, [field]: prev[field] === value ? "" : value }));
  }

  return (
    <main className="flex-1">
      <PageHeader eyebrow="Public board" title="Every complaint, in the open">
        <p>See what has been reported across The Gambia and what each office is doing about it. Personal details are never shown.</p>
        <div className="mt-6 flex flex-wrap gap-2">
          {STATUS_ORDER.map((status) => (
            <span key={status} className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold ring-1 ring-inset ${STATUS_META[status].pill}`}>
              <span className={`size-1.5 rounded-full ${STATUS_META[status].dot}`} />
              {all.filter((c) => c.status === status).length} {STATUS_META[status].label.toLowerCase()}
            </span>
          ))}
        </div>
      </PageHeader>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="card z-30 space-y-4 p-4 lg:sticky lg:top-[80px]">
          <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
            <Chip active={!filters.category} onClick={() => setFilters((p) => ({ ...p, category: "" }))}>
              All types
            </Chip>
            {Object.entries(CATEGORY_META).map(([key, meta]) => (
              <Chip key={key} active={filters.category === key} onClick={() => set("category", key)}>
                <meta.icon className="size-4" aria-hidden="true" />
                {meta.label}
              </Chip>
            ))}
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <label htmlFor="f-region" className="sr-only">
              Region
            </label>
            <select
              id="f-region"
              className="input py-2 text-sm sm:w-56"
              value={filters.region}
              onChange={(e) => setFilters((p) => ({ ...p, region: e.target.value }))}
            >
              <option value="">All regions</option>
              {regions.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
            <label htmlFor="f-status" className="sr-only">
              Status
            </label>
            <select
              id="f-status"
              className="input py-2 text-sm sm:w-48"
              value={filters.status}
              onChange={(e) => setFilters((p) => ({ ...p, status: e.target.value }))}
            >
              <option value="">All statuses</option>
              {STATUS_ORDER.map((status) => (
                <option key={status} value={status}>
                  {STATUS_META[status].label}
                </option>
              ))}
            </select>
            <div className="flex items-center gap-3 sm:ml-auto">
              <span className="text-sm text-slate-500" aria-live="polite">
                <span className="font-bold text-slate-900">{items.length}</span> {items.length === 1 ? "complaint" : "complaints"}
              </span>
              {filtered ? (
                <button type="button" className="btn btn-ghost px-2 py-1.5" onClick={() => setFilters(EMPTY)}>
                  <RotateCcw className="size-4" aria-hidden="true" /> Reset
                </button>
              ) : null}
            </div>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="card mt-6 p-12 text-center">
            <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-slate-100 text-slate-500">
              {filters.category ? <CategoryIcon category={filters.category} /> : <Inbox className="size-7" />}
            </span>
            <h2 className="mt-5 text-lg font-bold">No complaints match these filters</h2>
            <button type="button" className="link mt-3 text-sm" onClick={() => setFilters(EMPTY)}>
              Clear filters
            </button>
          </div>
        ) : (
          <ul key={JSON.stringify(filters)} className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item, index) => (
              <ComplaintCard key={item.id} complaint={item} index={index} />
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
