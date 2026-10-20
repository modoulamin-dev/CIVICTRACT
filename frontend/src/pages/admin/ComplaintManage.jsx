import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, CalendarDays, Check, CircleCheck, ExternalLink, MapPin, Phone, Send, Siren, User } from "lucide-react";
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
    const timer = setTimeout(onDone, 3200);
    return () => clearTimeout(timer);
    // Restart the timer only when a new message arrives, not on every parent render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [message]);
  return (
    <div role="status" className="fixed right-4 bottom-4 z-50 flex animate-rise items-center gap-3 rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white shadow-lift">
      <span className="grid size-6 place-items-center rounded-full bg-brand-500">
        <Check className="size-3.5" strokeWidth={3} />
      </span>
      {message}
    </div>
  );
}

function Fact({ icon: Icon, label, children }) {
  return (
    <div className="flex gap-3">
      <Icon className="mt-0.5 size-4 shrink-0 text-slate-400" aria-hidden="true" />
      <div className="min-w-0">
        <dt className="text-xs font-medium text-slate-500">{label}</dt>
        <dd className="text-sm font-semibold text-slate-900">{children}</dd>
      </div>
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
        <p className="font-semibold">Complaint not found.</p>
        <Link to="/admin/complaints" className="link mt-2 inline-block text-sm">
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
    apply(updateStatus(id, status, message.trim() || undefined), "Update posted. The citizen can see it now.");
    setMessage("");
  }

  const reporter = complaint.reporter || {};
  const category = CATEGORY_META[complaint.category];
  const unchanged = status === complaint.status && !message.trim();

  return (
    <div className="animate-rise">
      <Link to="/admin/complaints" className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-900">
        <ArrowLeft className="size-4" aria-hidden="true" /> All complaints
      </Link>

      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <CategoryIcon category={complaint.category} size="lg" />
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-sm font-semibold text-slate-500">{complaint.trackingNumber}</span>
              {complaint.isUrgent ? <UrgentBadge /> : null}
              <StatusBadge status={complaint.status} />
              {complaint.isStale ? <OverdueBadge /> : null}
            </div>
            <h1 className="mt-1.5 text-2xl font-extrabold tracking-tight">{complaint.title}</h1>
            <p className="text-sm text-slate-500">{category.label}</p>
          </div>
        </div>
        <Link to={`/track/${complaint.trackingNumber}`} target="_blank" className="btn btn-secondary shrink-0 self-start">
          <ExternalLink className="size-4" aria-hidden="true" /> Public view
        </Link>
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <section className="card p-6">
            <h2 className="text-sm font-bold text-slate-900">Report</h2>
            <p className="mt-2 leading-relaxed text-slate-700">{complaint.description}</p>
            {complaint.photoUrl ? (
              <img src={complaint.photoUrl} alt="Reported problem" className="mt-5 max-h-80 w-full rounded-xl object-cover" />
            ) : null}
            <dl className="mt-6 grid gap-5 border-t border-slate-100 pt-6 sm:grid-cols-2">
              <Fact icon={MapPin} label="Location">
                {[complaint.location.landmark, complaint.location.area, complaint.location.region].filter(Boolean).join(", ")}
              </Fact>
              <Fact icon={CalendarDays} label="Reported">
                {formatDate(complaint.createdAt)}
              </Fact>
              <Fact icon={User} label="Reporter · private">
                {reporter.name || "Anonymous"}
              </Fact>
              <Fact icon={Phone} label="Contact · private">
                {reporter.phone ? (
                  <a href={`tel:${reporter.phone.replaceAll(" ", "")}`} className="text-brand-700 hover:underline">
                    {reporter.phone}
                  </a>
                ) : (
                  "Not given"
                )}
              </Fact>
            </dl>
          </section>

          <section className="card p-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-sm font-bold text-slate-900">Public timeline</h2>
              <span className="rounded-full bg-sky-50 px-2.5 py-1 text-xs font-semibold text-sky-700 ring-1 ring-sky-100">
                Visible to citizens
              </span>
            </div>
            <div className="mt-6">
              <Timeline updates={complaint.updates} />
            </div>
          </section>
        </div>

        <aside className="space-y-6 xl:sticky xl:top-24 xl:self-start">
          <form onSubmit={onSubmit} className="card overflow-hidden">
            <div className="border-b border-slate-100 bg-slate-50/60 px-6 py-4">
              <h2 className="font-bold text-slate-900">Post an update</h2>
              <p className="text-sm text-slate-500">The citizen sees this on their Track page.</p>
            </div>
            <div className="space-y-5 p-6">
              <fieldset>
                <legend className="field-label">Status</legend>
                <div className="grid grid-cols-2 gap-2">
                  {STATUS_ORDER.map((value) => {
                    const meta = STATUS_META[value];
                    const Icon = meta.icon;
                    const selected = status === value;
                    return (
                      <label
                        key={value}
                        className={`flex cursor-pointer items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold ring-1 transition ${
                          selected ? `${meta.pill} ring-2` : "bg-white text-slate-600 ring-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        <input
                          type="radio"
                          name="status"
                          value={value}
                          checked={selected}
                          onChange={() => setStatus(value)}
                          className="sr-only"
                        />
                        <Icon className="size-4" aria-hidden="true" />
                        {meta.label}
                      </label>
                    );
                  })}
                </div>
              </fieldset>
              <div>
                <label htmlFor="message" className="field-label">
                  Message to the public
                </label>
                <textarea
                  id="message"
                  rows={3}
                  className="input resize-none text-sm"
                  placeholder="What has your office done?"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {QUICK_MESSAGES.map((text) => (
                    <button
                      key={text}
                      type="button"
                      onClick={() => setMessage(text)}
                      className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 transition hover:bg-slate-200"
                    >
                      {text}
                    </button>
                  ))}
                </div>
              </div>
              <button type="submit" className="btn btn-primary w-full" disabled={unchanged}>
                <Send className="size-4" aria-hidden="true" /> Post update
              </button>
            </div>
          </form>

          <section className="card divide-y divide-slate-100">
            <div className="flex items-center justify-between gap-4 p-5">
              <div className="flex items-center gap-3">
                <span className={`grid size-9 place-items-center rounded-xl ${complaint.isUrgent ? "bg-red-50 text-red-600" : "bg-slate-100 text-slate-500"}`}>
                  <Siren className="size-[18px]" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-bold text-slate-900">Urgent</p>
                  <p className="text-xs text-slate-500">Moves it to the top of the queue</p>
                </div>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={complaint.isUrgent}
                aria-label="Mark as urgent"
                onClick={() => apply(setUrgent(id, !complaint.isUrgent), complaint.isUrgent ? "Urgent flag removed." : "Marked as urgent.")}
                className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${complaint.isUrgent ? "bg-red-500" : "bg-slate-300"}`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 size-5 rounded-full bg-white shadow transition-transform ${complaint.isUrgent ? "translate-x-5" : ""}`}
                />
              </button>
            </div>
            <div className="p-5">
              <label htmlFor="department" className="field-label">
                Responsible office
              </label>
              <select
                id="department"
                className="input text-sm"
                value={complaint.department.id}
                onChange={(e) => apply(reassign(id, e.target.value), "Moved to another office.")}
              >
                {departments.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
              <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
                <CircleCheck className="size-3.5 text-brand-600" aria-hidden="true" />
                Chosen automatically from the problem type
              </p>
            </div>
          </section>
        </aside>
      </div>

      {toast ? <Toast message={toast} onDone={() => setToast("")} /> : null}
    </div>
  );
}
