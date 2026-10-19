import { Link } from "react-router-dom";
import { categoryLabel, formatDate } from "../utils/strings.js";
import { StatusBadge } from "./StatusBadge.jsx";

export function ComplaintCard({ complaint }) {
  return (
    <article className="card complaint-card">
      <div className="card-top">
        <StatusBadge status={complaint.status} urgent={complaint.isUrgent} />
        <span className="muted">{categoryLabel(complaint.category)}</span>
      </div>
      <h3>
        <Link to={`/complaints/${complaint.id}`}>{complaint.title || complaint.description}</Link>
      </h3>
      <p className="muted">
        {complaint.location?.area}, {complaint.location?.region}
      </p>
      <p className="clamp">{complaint.description}</p>
      <p className="meta">
        {complaint.trackingNumber} · {formatDate(complaint.createdAt)}
      </p>
    </article>
  );
}
