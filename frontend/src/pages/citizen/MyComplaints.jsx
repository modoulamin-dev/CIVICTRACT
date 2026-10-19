import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { myComplaints } from "../../api/complaints.js";
import { ComplaintCard } from "../../components/ComplaintCard.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

export function MyComplaints() {
  const { user, ready } = useAuth();
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;
    myComplaints()
      .then((data) => setItems(data.items))
      .catch((err) => setError(err.message));
  }, [user]);

  if (!ready) return <main className="page"><p>Loading…</p></main>;
  if (!user) return <Navigate to="/login" replace />;

  return (
    <main className="page">
      <h1>My complaints</h1>
      <p className="muted">
        New reports are linked to your account when you are signed in. You can still use a tracking number anytime.
      </p>
      {error ? <p className="error">{error}</p> : null}
      {items.length === 0 ? (
        <p>
          None yet. <Link to="/report">Report a problem</Link>
        </p>
      ) : (
        <div className="card-grid">
          {items.map((item) => (
            <ComplaintCard key={item.id} complaint={item} />
          ))}
        </div>
      )}
    </main>
  );
}
