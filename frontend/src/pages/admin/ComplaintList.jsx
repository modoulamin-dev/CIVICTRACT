import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listAdminComplaints } from "../../api/complaints.js";
import { StatusBadge } from "../../components/StatusBadge.jsx";
import { categories, formatDate, regions, statuses } from "../../utils/strings.js";

export function ComplaintList() {
  const [filters, setFilters] = useState({
    q: "",
    status: "",
    category: "",
    region: "",
    urgency: "",
    page: 1,
  });
  const [data, setData] = useState({ items: [], pages: 1 });
  const [error, setError] = useState("");

  useEffect(() => {
    listAdminComplaints(filters)
      .then(setData)
      .catch((err) => setError(err.message));
  }, [filters]);

  function setFilter(field, value) {
    setFilters((prev) => ({ ...prev, [field]: value, page: 1 }));
  }

  return (
    <div>
      <h1>Complaints</h1>
      <div className="filters">
        <input placeholder="Search tracking number or text" value={filters.q} onChange={(e) => setFilter("q", e.target.value)} />
        <select value={filters.status} onChange={(e) => setFilter("status", e.target.value)}>
          <option value="">Status</option>
          {statuses.map((item) => (
            <option key={item.value} value={item.value}>{item.label}</option>
          ))}
        </select>
        <select value={filters.category} onChange={(e) => setFilter("category", e.target.value)}>
          <option value="">Category</option>
          {categories.map((item) => (
            <option key={item.value} value={item.value}>{item.label}</option>
          ))}
        </select>
        <select value={filters.region} onChange={(e) => setFilter("region", e.target.value)}>
          <option value="">Region</option>
          {regions.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
        <select value={filters.urgency} onChange={(e) => setFilter("urgency", e.target.value)}>
          <option value="">Urgency</option>
          <option value="true">Urgent only</option>
          <option value="false">Not urgent</option>
        </select>
      </div>
      {error ? <p className="error">{error}</p> : null}
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Tracking</th>
              <th>Status</th>
              <th>Area</th>
              <th>Category</th>
              <th>Opened</th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((item) => (
              <tr key={item.id} className={item.isUrgent ? "urgent-row" : ""}>
                <td>
                  <Link to={`/admin/complaints/${item.id}`}>{item.trackingNumber}</Link>
                  {item.isStale ? <span className="muted"> stale</span> : null}
                </td>
                <td><StatusBadge status={item.status} urgent={item.isUrgent} /></td>
                <td>{item.area}, {item.region}</td>
                <td>{item.category}</td>
                <td>{formatDate(item.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {data.items.length === 0 ? <p className="muted">No complaints match.</p> : null}
    </div>
  );
}
