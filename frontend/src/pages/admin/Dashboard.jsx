import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listAdminComplaints } from "../../api/complaints.js";
import { statsSummary } from "../../api/stats.js";
import { StatusBadge } from "../../components/StatusBadge.jsx";
import { formatDate } from "../../utils/strings.js";

export function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [urgent, setUrgent] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([statsSummary(), listAdminComplaints({ urgency: "true", limit: 8 })])
      .then(([stats, list]) => {
        setSummary(stats);
        setUrgent(list.items);
      })
      .catch((err) => setError(err.message));
  }, []);

  const byStatus = summary?.byStatus || {};
  const newCount = (byStatus.received || 0) + (byStatus.assigned || 0);

  return (
    <div>
      <h1>Overview</h1>
      {error ? <p className="error">{error}</p> : null}
      <div className="stat-grid">
        <article className="card stat"><p>New / assigned</p><strong>{newCount}</strong></article>
        <article className="card stat"><p>Urgent</p><strong>{summary?.urgent || 0}</strong></article>
        <article className="card stat"><p>In progress</p><strong>{byStatus.in_progress || 0}</strong></article>
        <article className="card stat"><p>Resolved</p><strong>{byStatus.resolved || 0}</strong></article>
      </div>
      <h2>Latest urgent items</h2>
      {urgent.length === 0 ? <p className="muted">No urgent complaints right now.</p> : null}
      <ul className="plain-list">
        {urgent.map((item) => (
          <li key={item.id} className="card">
            <Link to={`/admin/complaints/${item.id}`}>{item.trackingNumber}</Link>
            <StatusBadge status={item.status} urgent={item.isUrgent} />
            <span className="muted">
              {item.area} · {formatDate(item.createdAt)}
              {item.isStale ? " · stale" : ""}
            </span>
            <p>{item.title}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
