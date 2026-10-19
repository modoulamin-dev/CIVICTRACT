import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  addNote,
  getAdminComplaint,
  patchReassign,
  patchStatus,
  patchUrgent,
  patchVisibility,
} from "../../api/complaints.js";
import { publicDepartments } from "../../api/stats.js";
import { StatusBadge } from "../../components/StatusBadge.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { categoryLabel, formatDate, photoSrc, statusLabel } from "../../utils/strings.js";

export function ComplaintManage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [complaint, setComplaint] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [message, setMessage] = useState("");
  const [note, setNote] = useState("");
  const [noteVisibility, setNoteVisibility] = useState("public");
  const [departmentId, setDepartmentId] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  async function reload() {
    const data = await getAdminComplaint(id);
    setComplaint(data.complaint);
  }

  useEffect(() => {
    reload().catch((err) => setError(err.message));
    publicDepartments().then((data) => setDepartments(data.items)).catch(() => {});
  }, [id]);

  async function run(action, success) {
    setError("");
    setInfo("");
    try {
      await action();
      await reload();
      setInfo(success);
    } catch (err) {
      setError(err.message);
    }
  }

  if (!complaint) return <p>{error || "Loading…"}</p>;

  const next =
    complaint.status === "assigned"
      ? "in_progress"
      : complaint.status === "in_progress"
        ? "resolved"
        : null;

  return (
    <div>
      <h1>{complaint.trackingNumber}</h1>
      <StatusBadge status={complaint.status} urgent={complaint.isUrgent} />
      <p>{complaint.description}</p>
      <p className="muted">
        {categoryLabel(complaint.category)} · {complaint.location.area}, {complaint.location.region}
        {complaint.location.landmark ? ` · ${complaint.location.landmark}` : ""}
      </p>
      <p>
        Department: <strong>{complaint.department?.name}</strong>
      </p>
      {complaint.photoUrl ? <img className="photo" src={photoSrc(complaint.photoUrl)} alt="" /> : null}
      <section className="card">
        <h2>Reporter (private)</h2>
        <p>{complaint.reporter?.name || "Not given"}</p>
        <p>{complaint.reporter?.phone || "No phone"}</p>
        <p>{complaint.reporter?.email || "No email"}</p>
      </section>
      {error ? <p className="error">{error}</p> : null}
      {info ? <p className="ok">{info}</p> : null}
      <section className="card form">
        <h2>Actions</h2>
        {next ? (
          <>
            <label>
              Public note for status change
              <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={3} />
            </label>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() =>
                run(() => patchStatus(id, { status: next, message }), `Moved to ${statusLabel(next)}.`)
              }
            >
              Mark as {statusLabel(next)}
            </button>
          </>
        ) : (
          <p className="muted">This complaint is {statusLabel(complaint.status)}.</p>
        )}
        {user?.role === "super_admin" && complaint.status !== "received" ? (
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() =>
              run(
                () => patchStatus(id, { status: "assigned", message: message || "Returned for more work." }),
                "Moved backwards."
              )
            }
          >
            Super admin: move back to assigned
          </button>
        ) : null}
        <button
          type="button"
          className="btn btn-ghost"
          onClick={() => run(() => patchUrgent(id, !complaint.isUrgent), "Urgency updated.")}
        >
          {complaint.isUrgent ? "Remove urgent flag" : "Mark urgent"}
        </button>
        <button
          type="button"
          className="btn btn-ghost"
          onClick={() => run(() => patchVisibility(id, !complaint.isPublic), "Visibility updated.")}
        >
          {complaint.isPublic ? "Hide from public board" : "Make public"}
        </button>
        <label>
          Reassign department
          <select value={departmentId} onChange={(e) => setDepartmentId(e.target.value)}>
            <option value="">Choose…</option>
            {departments.map((item) => (
              <option key={item._id} value={item._id}>
                {item.name}
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          className="btn btn-ghost"
          disabled={!departmentId}
          onClick={() => run(() => patchReassign(id, departmentId), "Reassigned.")}
        >
          Reassign
        </button>
      </section>
      <section className="card form">
        <h2>Add a note</h2>
        <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3} />
        <label>
          Visibility
          <select value={noteVisibility} onChange={(e) => setNoteVisibility(e.target.value)}>
            <option value="public">Public (citizen can see)</option>
            <option value="internal">Internal (staff only)</option>
          </select>
        </label>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() =>
            run(async () => {
              await addNote(id, { message: note, visibility: noteVisibility });
              setNote("");
            }, "Note posted.")
          }
        >
          Post note
        </button>
      </section>
      <section>
        <h2>History</h2>
        <ol className="timeline">
          {complaint.updates.map((item) => (
            <li key={item.id}>
              <p>
                <strong>{item.type.replaceAll("_", " ")}</strong>
                {item.visibility === "internal" ? " · internal" : " · public"}
                <span className="muted">
                  {" "}
                  · {item.author?.name} · {formatDate(item.createdAt)}
                </span>
              </p>
              {item.message ? <p>{item.message}</p> : null}
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
