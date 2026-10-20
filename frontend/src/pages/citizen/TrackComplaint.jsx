import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Building2, CalendarDays, Hash, MapPin, Phone, Search, SearchX } from "lucide-react";
import { findByTrackingNumber, listComplaints } from "../../data/mock.js";
import { PageHeader } from "../../components/PageHeader.jsx";
import { StatusSteps, Timeline } from "../../components/Timeline.jsx";
import { CategoryIcon, StatusBadge } from "../../components/StatusBadge.jsx";
import { CATEGORY_META, timeAgo } from "../../utils/meta.js";
import { formatDate } from "../../utils/strings.js";

function Detail({ icon: Icon, label, children }) {
  return (
    <div className="flex gap-3">
      <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-slate-100 text-slate-500">
        <Icon className="size-4" aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <dt className="text-xs font-medium text-slate-500">{label}</dt>
        <dd className="mt-0.5 font-semibold text-slate-900">{children}</dd>
      </div>
    </div>
  );
}

export function TrackComplaint() {
  const { trackingNumber } = useParams();
  const navigate = useNavigate();
  const [value, setValue] = useState(trackingNumber || "");
  const complaint = trackingNumber ? findByTrackingNumber(trackingNumber) : null;
  const samples = listComplaints().slice(0, 3);

  useEffect(() => {
    setValue(trackingNumber || "");
  }, [trackingNumber]);

  return (
    <main className="flex-1">
      <PageHeader eyebrow="Track a complaint" title="Where is my complaint?">
        <p>Enter the tracking number you received. You will see the office responsible and every update they post.</p>
        <form
          className="mt-6 flex flex-col gap-3 sm:flex-row"
          onSubmit={(event) => {
            event.preventDefault();
            if (value.trim()) navigate(`/track/${value.trim().toUpperCase()}`);
          }}
        >
          <label htmlFor="tracking" className="sr-only">
            Tracking number
          </label>
          <div className="relative flex-1 sm:max-w-sm">
            <Hash className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            <input
              id="tracking"
              className="input py-3 pl-10 font-mono font-semibold tracking-wide uppercase"
              placeholder="CT-2026-XXXXXX"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              autoComplete="off"
            />
          </div>
          <button type="submit" className="btn btn-primary btn-lg">
            <Search className="size-5" aria-hidden="true" /> Find complaint
          </button>
        </form>
        {!trackingNumber ? (
          <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
            <span className="text-slate-500">Try one:</span>
            {samples.map((item) => (
              <Link
                key={item.id}
                to={`/track/${item.trackingNumber}`}
                className="rounded-md bg-white px-2 py-1 font-mono text-xs font-semibold text-slate-700 ring-1 ring-slate-200 transition hover:ring-brand-300"
              >
                {item.trackingNumber}
              </Link>
            ))}
          </div>
        ) : null}
      </PageHeader>

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        {trackingNumber && !complaint ? (
          <div className="card mx-auto max-w-lg p-10 text-center">
            <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-red-50 text-red-600">
              <SearchX className="size-7" aria-hidden="true" />
            </span>
            <h2 className="mt-5 text-xl font-bold">No complaint found</h2>
            <p className="mt-2 text-slate-600">
              We could not find <span className="font-mono font-semibold">{trackingNumber}</span>. Check the number — it
              starts with CT-.
            </p>
          </div>
        ) : null}

        {complaint ? (
          <div key={complaint.id} className="grid animate-rise gap-6 lg:grid-cols-[1fr_320px]">
            <div className="space-y-6">
              <article className="card relative overflow-hidden p-6 sm:p-8">
                <span
                  className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${CATEGORY_META[complaint.category].accent}`}
                  aria-hidden="true"
                />
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <CategoryIcon category={complaint.category} />
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{CATEGORY_META[complaint.category].label}</p>
                      <p className="text-xs text-slate-500">Reported {timeAgo(complaint.createdAt)}</p>
                    </div>
                  </div>
                  <StatusBadge status={complaint.status} />
                </div>
                <h2 className="mt-6 text-2xl font-extrabold tracking-tight">{complaint.title}</h2>
                <p className="mt-2 leading-relaxed text-slate-600">{complaint.description}</p>
                {complaint.photoUrl ? (
                  <img src={complaint.photoUrl} alt="Photo of the problem" className="mt-6 max-h-80 w-full rounded-xl object-cover" />
                ) : null}
                <div className="mt-8 rounded-2xl bg-slate-50 px-4 py-6 ring-1 ring-slate-100 sm:px-8">
                  <StatusSteps status={complaint.status} />
                </div>
              </article>

              <section className="card p-6 sm:p-8">
                <h3 className="text-lg font-bold">Updates</h3>
                <p className="text-sm text-slate-500">Posted by the responsible office, newest first.</p>
                <div className="mt-6">
                  <Timeline updates={complaint.updates} />
                </div>
              </section>
            </div>

            <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
              <div className="card p-6">
                <p className="text-sm font-bold text-slate-900">Details</p>
                <dl className="mt-5 space-y-5">
                  <Detail icon={Hash} label="Tracking number">
                    <span className="font-mono">{complaint.trackingNumber}</span>
                  </Detail>
                  <Detail icon={MapPin} label="Location">
                    {[complaint.location.landmark, complaint.location.area, complaint.location.region].filter(Boolean).join(", ")}
                  </Detail>
                  <Detail icon={CalendarDays} label="Reported on">
                    {formatDate(complaint.createdAt)}
                  </Detail>
                </dl>
              </div>
              <div className="card overflow-hidden">
                <div className="bg-gradient-to-br from-brand-600 to-brand-800 p-6 text-white">
                  <Building2 className="size-6 text-brand-200" aria-hidden="true" />
                  <p className="mt-3 text-xs font-semibold text-brand-200">Responsible office</p>
                  <p className="mt-0.5 text-lg font-bold">{complaint.department?.name || "Not assigned yet"}</p>
                </div>
                {complaint.department?.contactPhone ? (
                  <a
                    href={`tel:${complaint.department.contactPhone.replaceAll(" ", "")}`}
                    className="flex items-center gap-3 p-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    <Phone className="size-4 text-brand-600" aria-hidden="true" />
                    {complaint.department.contactPhone}
                  </a>
                ) : null}
              </div>
            </aside>
          </div>
        ) : null}

        {!trackingNumber ? (
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              ["1", "Find your number", "It was shown when you sent the complaint, e.g. CT-2026-W7K3PA."],
              ["2", "Enter it above", "Letters are not case sensitive. Include the dashes."],
              ["3", "Follow progress", "See the office handling it and every update they post."],
            ].map(([n, title, body]) => (
              <div key={n} className="card p-6">
                <span className="grid size-8 place-items-center rounded-full bg-brand-50 text-sm font-bold text-brand-700">{n}</span>
                <p className="mt-4 font-bold">{title}</p>
                <p className="mt-1 text-sm text-slate-600">{body}</p>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </main>
  );
}
