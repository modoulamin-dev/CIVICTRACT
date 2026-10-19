import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { trackComplaint } from "../../api/complaints.js";
import { Timeline } from "../../components/Timeline.jsx";
import { StatusBadge } from "../../components/StatusBadge.jsx";
import { categoryLabel, formatDate, photoSrc } from "../../utils/strings.js";

export function TrackComplaint() {
  const { trackingNumber } = useParams();
  const navigate = useNavigate();
  const [value, setValue] = useState(trackingNumber || "");
  const [complaint, setComplaint] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function load(number) {
    setBusy(true);
    setError("");
    try {
      const data = await trackComplaint(number.trim().toUpperCase());
      setComplaint(data.complaint);
    } catch (err) {
      setComplaint(null);
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    if (trackingNumber) load(trackingNumber);
  }, [trackingNumber]);

  return (
    <main className="page narrow">
      <h1>Track a complaint</h1>
      <form
        className="card form"
        onSubmit={(event) => {
          event.preventDefault();
          navigate(`/track/${value.trim().toUpperCase()}`);
        }}
      >
        <label>
          Tracking number
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="CT-2026-A7K3P9"
            required
          />
        </label>
        <button className="btn btn-primary" type="submit" disabled={busy}>
          {busy ? "Looking up…" : "Look up"}
        </button>
      </form>
      {error ? <p className="error">{error}</p> : null}
      {complaint ? (
        <section className="card">
          <div className="card-top">
            <StatusBadge status={complaint.status} />
            <span className="muted">{complaint.trackingNumber}</span>
          </div>
          <h2>{complaint.title}</h2>
          <p>{complaint.description}</p>
          <p className="muted">
            {categoryLabel(complaint.category)} · {complaint.location.area}, {complaint.location.region}
            {complaint.location.landmark ? ` · ${complaint.location.landmark}` : ""}
          </p>
          <p>
            Responsible department: <strong>{complaint.department?.name || "Not assigned yet"}</strong>
          </p>
          {complaint.department?.contactPhone ? (
            <p className="muted">Public contact: {complaint.department.contactPhone}</p>
          ) : null}
          {complaint.photoUrl ? <img className="photo" src={photoSrc(complaint.photoUrl)} alt="" /> : null}
          <p className="meta">Reported {formatDate(complaint.createdAt)}</p>
          <Timeline status={complaint.status} updates={complaint.updates} />
        </section>
      ) : null}
    </main>
  );
}
