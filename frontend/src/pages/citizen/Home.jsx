import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listPublicComplaints } from "../../api/complaints.js";
import { ComplaintCard } from "../../components/ComplaintCard.jsx";
import { copy } from "../../utils/strings.js";

export function Home() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    listPublicComplaints({ limit: 6 })
      .then((data) => setItems(data.items))
      .catch((err) => setError(err.message));
  }, []);

  return (
    <main className="page">
      <section className="hero">
        <p className="eyebrow">The Gambia · public services</p>
        <h1>{copy.appName}</h1>
        <p className="lead">{copy.homeLead}</p>
        <div className="actions">
          <Link className="btn btn-primary" to="/report">
            Report a problem
          </Link>
          <Link className="btn btn-ghost" to="/track">
            Track a complaint
          </Link>
        </div>
      </section>
      <section>
        <div className="section-head">
          <h2>Recent public complaints</h2>
          <Link to="/board">See all</Link>
        </div>
        {error ? <p className="error">{error}</p> : null}
        {items.length === 0 && !error ? <p className="muted">No public complaints yet.</p> : null}
        <div className="card-grid">
          {items.map((item) => (
            <ComplaintCard key={item.id} complaint={item} />
          ))}
        </div>
      </section>
    </main>
  );
}
