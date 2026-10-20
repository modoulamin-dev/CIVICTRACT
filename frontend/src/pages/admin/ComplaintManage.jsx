import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowUpRight, Check } from "lucide-react";
import { departments, getComplaint, reassign, setUrgent, updateStatus } from "../../data/mock.js";
import { CategoryIcon, OverdueBadge, StatusBadge, UrgentBadge } from "../../components/StatusBadge.jsx";
import { Timeline } from "../../components/Timeline.jsx";
import { CATEGORY_META, STATUS_META, STATUS_ORDER } from "../../utils/meta.js";
import { formatDate } from "../../utils/strings.js";

const QUICK_MESSAGES = ["Crew dispatched to the site.", "Repair scheduled for this week.", "Fixed. Thank you for reporting."];

// Keyed by id so switching complaints resets the form state.
export function ComplaintManage() {
  const { id } = useParams();
  return <ManageView key={id} id={id} />;
}

function Toast({ message, onDone }) {
  useEffect(() => {
    const timer = setTimeout(onDone, 3000);
    return () => clearTimeout(timer);
    // Restart the timer only when a new message arrives, not on every parent render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [message]);
  return (
    <div role="status" className="fixed right-4 bottom-4 z-50 flex animate-fade items-center gap-2 rounded-md bg-neutral-900 px-3.5 py-2.5 text-[13px] text-white shadow-lg">
      <Check className="size-3.5" aria-hidden="true" />
      {message}
    </div>
  );
}

function ManageView({ id }) {
  const [complaint, setComplaint] = useState(() => getComplaint(id));
  const [status, setStatus] = useState(complaint?.status || "");
  const [message, setMessage] = useState("");
  const [toast, setToast] = useState("");

  if (!complaint) {
    return (
      <div className="card p-10 text-center">
        <p className="font-medium">Complaint not found.</p>
        <Link to="/admin/complaints" className="link mt-2 inline-block text-[13px]">
          Back to complaints
        </Link>
      </div>
    );
  }

  function apply(next, note) {
    setComplaint(next);
    setToast(note);
  }

  function onSubmit(event) {
    event.preventDefault();
    if (status === complaint.status && !message.trim()) return;
    apply(updateStatus(id, status, message.trim() || undefined), "Update posted");
    setMessage("");
  }

  const reporter = complaint.reporter || {};
  const unchanged = status === complaint.status && !message.trim();
  const facts = [
    ["Location", [complaint.location.landmark, complaint.location.area, complaint.location.region].filter(Boolean).join(", ")],
    ["Type", CATEGORY_META[complaint.category].label],
    ["Reported", formatDate(complaint.createdAt)],
    ["Reporter", [reporter.name, reporter.phone].filter(Boolean).join(" · ") || "Anonymous"],
  ];

  return (
    <div className="animate-fade">
      <Link to="/admin/complaints" className="inline-flex items-center gap-1 text-[13px] text-neutral-500 hover:text-neutral-900">
        <ArrowLeft className="size-3.5" aria-hidden="true" /> Complaints
      </Link>

      <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <CategoryIcon category={complaint.category} size="lg" />
          <div>
            <h1 className="text-xl font-semibold tracking-tight">{complaint.title}</h1>
            <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
              <span className="mr-1 font-mono text-xs text-neutral-500">{complaint.trackingNumber}</span>
              {complaint.isUrgent ? <UrgentBadge /> : null}
              <StatusBadge status={complaint.status} />
              {complaint.isStale ? <OverdueBadge /> : null}
            </div>
          </div>
        </div>
        <Link to={`/track/${complaint.trackingNumber}`} target="_blank" className="btn btn-secondary btn-sm self-start">
          Public view <ArrowUpRight className="size-3.5" aria-hidden="true" />
        </Link>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          <section className="card">
            <div className="p-4">
              <p className="leading-6 text-neutral-700">{complaint.description}</p>
              {complaint.photoUrl ? (
                <img src={complaint.photoUrl} alt="Reported problem" className="mt-4 max-h-72 w-full rounded-md border border-neutral-200 object-cover" />
              ) : null}
            </div>
            <dl className="grid border-t border-neutral-200 sm:grid-cols-2">
              {facts.map(([label, value], index) => (
                <div
                  key={label}
                  className={`border-neutral-100 px-4 py-3 ${index > 0 ? "border-t" : ""} ${index === 1 ? "sm:border-t-0" : ""} ${index % 2 ? "sm:border-l" : ""}`}
                >
                  <dt className="text-xs text-neutral-500">{label}</dt>
                  <dd className="mt-0.5 text-[13px] font-medium">{value}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="card">
            <div className="flex h-11 items-center justify-between border-b border-neutral-200 px-4">
              <h2 className="text-sm font-medium">Activity</h2>
              <span className="text-xs text-neutral-500">Visible to the public</span>
            </div>
            <div className="p-4">
              <Timeline updates={complaint.updates} />
            </div>
          </section>
        </div>

        <aside className="space-y-6 lg:sticky lg:top-20 lg:self-start">
          <form onSubmit={onSubmit} className="card">
            <div className="flex h-11 items-center border-b border-neutral-200 px-4">
              <h2 className="text-sm font-medium">Post an update</h2>
            </div>
            <div className="space-y-4 p-4">
              <div>
                <label htmlFor="status" className="label">
                  Status
                </label>
                <div className="grid grid-cols-2 gap-1 rounded-md bg-neutral-100 p-1" role="radiogroup" id="status">
                  {STATUS_ORDER.map((value) => {
                    const selected = status === value;
                    return (
                      <button
                        key={value}
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        onClick={() => setStatus(value)}
                        className={`flex h-7 items-center justify-center gap-1.5 rounded text-[13px] transition ${
                          selected ? "bg-white font-medium text-neutral-900 shadow-xs" : "text-neutral-500 hover:text-neutral-900"
                        }`}
                      >
                        <span className={`size-1.5 rounded-full ${STATUS_META[value].dot}`} aria-hidden="true" />
                        {STATUS_META[value].label}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div>
                <label htmlFor="message" className="label">
                  Public message
                </label>
                <textarea
                  id="message"
                  rows={3}
                  className="input resize-none"
                  placeholder="What has your office done?"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <div className="mt-2 flex flex-wrap gap-1">
                  {QUICK_MESSAGES.map((text) => (
                    <button key={text} type="button" onClick={() => setMessage(text)} className="kbd font-sans hover:border-neutral-300 hover:text-neutral-900">
                      {text}
                    </button>
                  ))}
                </div>
              </div>
              <button type="submit" className="btn btn-primary w-full" disabled={unchanged}>
                Post update
              </button>
            </div>
          </form>

          <section className="card divide-y divide-neutral-200">
            <div className="flex items-center justify-between gap-4 p-4">
              <div>
                <p className="text-sm font-medium">Urgent</p>
                <p className="text-[13px] text-neutral-500">Move to the top of the queue</p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={complaint.isUrgent}
                aria-label="Mark as urgent"
                onClick={() => apply(setUrgent(id, !complaint.isUrgent), complaint.isUrgent ? "Urgent flag removed" : "Marked as urgent")}
                className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${complaint.isUrgent ? "bg-neutral-900" : "bg-neutral-200"}`}
              >
                <span className={`absolute top-0.5 left-0.5 size-4 rounded-full bg-white shadow-sm transition-transform ${complaint.isUrgent ? "translate-x-4" : ""}`} />
              </button>
            </div>
            <div className="p-4">
              <label htmlFor="department" className="label">
                Responsible office
              </label>
              <select id="department" className="input" value={complaint.department.id} onChange={(e) => apply(reassign(id, e.target.value), "Office changed")}>
                {departments.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
              <p className="mt-1.5 text-xs text-neutral-500">Set automatically from the problem type.</p>
            </div>
          </section>
        </aside>
      </div>

      {toast ? <Toast message={toast} onDone={() => setToast("")} /> : null}
    </div>
  );
}
