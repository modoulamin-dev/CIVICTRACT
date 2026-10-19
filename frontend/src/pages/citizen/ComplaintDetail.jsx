import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPublicComplaint } from "../../api/complaints.js";
import { StatusBadge } from "../../components/StatusBadge.jsx";
import { Timeline } from "../../components/Timeline.jsx";
import { categoryLabel, formatDate, photoSrc } from "../../utils/strings.js";

export function ComplaintDetail() {
  const { id } = useParams();
  const [complaint, setComplaint] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getPublicComplaint(id)
      .then((data) => setComplaint(data.complaint))
      .catch((err) => setError(err.message));
  }, [id]);

  if (error) return <main className="page"><p className="error">{error}</p></main>;
  if (!complaint) return <main className="page"><p>Loading…</p></main>;

  return (
    <main className="page narrow">
      <article className="card">
        <div className="card-top">
          <StatusBadge status={complaint.status} />
          <span className="muted">{complaint.trackingNumber}</span>
        </div>
        <h1>{complaint.title}</h1>
        <p>{complaint.description}</p>
        <p className="muted">
          {categoryLabel(complaint.category)} · {complaint.location.area}, {complaint.location.region}
        </p>
        <p>
          Department: <strong>{complaint.department?.name || "Pending assignment"}</strong>
        </p>
        {complaint.photoUrl ? <img className="photo" src={photoSrc(complaint.photoUrl)} alt="" /> : null}
        <p className="meta">Reported {formatDate(complaint.createdAt)}</p>
        <Timeline status={complaint.status} updates={complaint.updates} />
      </article>
    </main>
  );
}
