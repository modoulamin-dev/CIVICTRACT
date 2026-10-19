import { useEffect, useState } from "react";
import { listPublicComplaints } from "../../api/complaints.js";
import { ComplaintCard } from "../../components/ComplaintCard.jsx";
import { categories, regions, statuses } from "../../utils/strings.js";

export function PublicBoard() {
  const [filters, setFilters] = useState({ region: "", category: "", status: "", area: "", page: 1 });
  const [data, setData] = useState({ items: [], pages: 1, total: 0 });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(true);

  useEffect(() => {
    setBusy(true);
    listPublicComplaints(filters)
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setBusy(false));
  }, [filters]);

  function setFilter(field, value) {
    setFilters((prev) => ({ ...prev, [field]: value, page: 1 }));
  }

  return (
    <main className="page">
      <h1>Public board</h1>
      <p className="muted">Open reports from across The Gambia. Private contact details are never shown.</p>
      <div className="filters">
        <select value={filters.region} onChange={(e) => setFilter("region", e.target.value)}>
          <option value="">All regions</option>
          {regions.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
        <input
          placeholder="Area or town"
          value={filters.area}
          onChange={(e) => setFilter("area", e.target.value)}
        />
        <select value={filters.category} onChange={(e) => setFilter("category", e.target.value)}>
          <option value="">All categories</option>
          {categories.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
        <select value={filters.status} onChange={(e) => setFilter("status", e.target.value)}>
          <option value="">All statuses</option>
          {statuses.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </div>
      {busy ? <p>Loading…</p> : null}
      {error ? <p className="error">{error}</p> : null}
      {!busy && data.items.length === 0 ? <p className="muted">No complaints match those filters.</p> : null}
      <div className="card-grid">
        {data.items.map((item) => (
          <ComplaintCard key={item.id} complaint={item} />
        ))}
      </div>
      {data.pages > 1 ? (
        <div className="actions">
          <button
            type="button"
            className="btn btn-ghost"
            disabled={filters.page <= 1}
            onClick={() => setFilters((prev) => ({ ...prev, page: prev.page - 1 }))}
          >
            Previous
          </button>
          <span>
            Page {filters.page} of {data.pages}
          </span>
          <button
            type="button"
            className="btn btn-ghost"
            disabled={filters.page >= data.pages}
            onClick={() => setFilters((prev) => ({ ...prev, page: prev.page + 1 }))}
          >
            Next
          </button>
        </div>
      ) : null}
    </main>
  );
}
