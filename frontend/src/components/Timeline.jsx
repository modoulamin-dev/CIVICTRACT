import { formatDate, statusLabel } from "../utils/strings.js";

const STEPS = ["received", "assigned", "in_progress", "resolved"];

export function Timeline({ status, updates = [] }) {
  const currentIndex = STEPS.indexOf(status);
  return (
    <div>
      <ol className="status-steps" aria-label="Complaint status">
        {STEPS.map((step, index) => (
          <li key={step} className={index <= currentIndex ? "done" : ""}>
            {statusLabel(step)}
          </li>
        ))}
      </ol>
      <ol className="timeline">
        {updates.length === 0 ? <li className="muted">No public updates yet.</li> : null}
        {updates.map((item) => (
          <li key={item.id}>
            <p>
              <strong>{item.toStatus ? statusLabel(item.toStatus) : item.type.replace("_", " ")}</strong>
              <span className="muted"> · {item.author?.name || "CivicTract"} · {formatDate(item.createdAt)}</span>
            </p>
            {item.message ? <p>{item.message}</p> : null}
          </li>
        ))}
      </ol>
    </div>
  );
}
