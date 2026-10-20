import { useState } from "react";
import { listComplaints } from "../../data/mock.js";
import { ComplaintCard } from "../../components/ComplaintCard.jsx";
import { PageHeader } from "../../components/PageHeader.jsx";
import { CATEGORY_META, STATUS_META, STATUS_ORDER } from "../../utils/meta.js";
import { regions } from "../../utils/strings.js";

const EMPTY = { category: "", region: "", status: "" };

export function PublicBoard() {
  const [filters, setFilters] = useState(EMPTY);
  const items = listComplaints(filters);
  const filtered = filters.category || filters.region || filters.status;

  function set(field, value) {
    setFilters((prev) => ({ ...prev, [field]: value }));
  }

  return (
    <main className="flex-1">
      <PageHeader
        eyebrow="Public board"
        title="Every complaint, in the open"
        description="What has been reported across The Gambia and what each office is doing about it. Personal details are never shown."
      />

      <div className="container-page py-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <select aria-label="Type" className="input sm:w-48" value={filters.category} onChange={(e) => set("category", e.target.value)}>
            <option value="">All types</option>
            {Object.entries(CATEGORY_META).map(([key, meta]) => (
              <option key={key} value={key}>
                {meta.label}
              </option>
            ))}
          </select>
          <select aria-label="Region" className="input sm:w-48" value={filters.region} onChange={(e) => set("region", e.target.value)}>
            <option value="">All regions</option>
            {regions.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
          <select aria-label="Status" className="input sm:w-40" value={filters.status} onChange={(e) => set("status", e.target.value)}>
            <option value="">All statuses</option>
            {STATUS_ORDER.map((status) => (
              <option key={status} value={status}>
                {STATUS_META[status].label}
              </option>
            ))}
          </select>
          {filtered ? (
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => setFilters(EMPTY)}>
              Clear
            </button>
          ) : null}
          <span className="text-[13px] text-neutral-500 sm:ml-auto" aria-live="polite">
            {items.length} {items.length === 1 ? "result" : "results"}
          </span>
        </div>

        {items.length === 0 ? (
          <div className="card mt-6 p-10 text-center">
            <p className="font-medium">No complaints match these filters</p>
            <button type="button" className="link mt-2 text-[13px]" onClick={() => setFilters(EMPTY)}>
              Clear filters
            </button>
          </div>
        ) : (
          <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <ComplaintCard key={item.id} complaint={item} />
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
