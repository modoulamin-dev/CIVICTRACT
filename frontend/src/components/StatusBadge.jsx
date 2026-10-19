import { statusLabel } from "../utils/strings.js";

export function StatusBadge({ status, urgent }) {
  return (
    <span className={`badge badge-${status}${urgent ? " badge-urgent" : ""}`}>
      {urgent ? "Urgent · " : ""}
      {statusLabel(status)}
    </span>
  );
}
