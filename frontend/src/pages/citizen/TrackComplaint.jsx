import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Phone, Search } from "lucide-react";
import { findByTrackingNumber, listComplaints } from "../../data/mock.js";
import { PageHeader } from "../../components/PageHeader.jsx";
import { StatusSteps, Timeline } from "../../components/Timeline.jsx";
import { CategoryIcon, StatusBadge } from "../../components/StatusBadge.jsx";
import { CATEGORY_META } from "../../utils/meta.js";
import { formatDate } from "../../utils/strings.js";

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
      <PageHeader
        eyebrow="Track"
        title="Track a complaint"
        description="Enter the tracking number you received to see the office responsible and every update."
      >
        <form
          className="mt-6 flex max-w-md gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            if (value.trim()) navigate(`/track/${value.trim().toUpperCase()}`);
          }}
        >
          <label htmlFor="tracking" className="sr-only">
            Tracking number
          </label>
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-neutral-400" aria-hidden="true" />
            <input
              id="tracking"
              className="input pl-9 font-mono uppercase"
              placeholder="CT-2026-XXXXXX"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              autoComplete="off"
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Find
          </button>
        </form>
        {!trackingNumber ? (
          <p className="mt-3 flex flex-wrap items-center gap-1.5 text-[13px] text-neutral-500">
            Try
            {samples.map((item) => (
              <Link key={item.id} to={`/track/${item.trackingNumber}`} className="kbd hover:border-neutral-300 hover:text-neutral-900">
                {item.trackingNumber}
              </Link>
            ))}
          </p>
        ) : null}
      </PageHeader>

      <div className="container-page py-10">
        {trackingNumber && !complaint ? (
          <div className="card mx-auto max-w-md p-8 text-center">
            <p className="font-medium">No complaint found</p>
            <p className="mt-1 text-neutral-500">
              Nothing matches <span className="font-mono text-neutral-900">{trackingNumber}</span>. Check the number and try again.
            </p>
          </div>
        ) : null}

        {complaint ? (
          <div key={complaint.id} className="grid animate-fade gap-6 lg:grid-cols-[1fr_300px]">
            <div className="space-y-6">
              <article className="card">
                <div className="flex items-center justify-between gap-3 border-b border-neutral-200 px-5 py-3">
                  <div className="flex items-center gap-2.5">
                    <CategoryIcon category={complaint.category} size="sm" />
                    <span className="text-[13px] text-neutral-500">{CATEGORY_META[complaint.category].label}</span>
                  </div>
                  <StatusBadge status={complaint.status} />
                </div>
                <div className="p-5">
                  <h2 className="text-lg font-semibold tracking-tight">{complaint.title}</h2>
                  <p className="mt-1.5 leading-6 text-neutral-600">{complaint.description}</p>
                  {complaint.photoUrl ? (
                    <img src={complaint.photoUrl} alt="Photo of the problem" className="mt-4 max-h-72 w-full rounded-md border border-neutral-200 object-cover" />
                  ) : null}
                  <div className="mt-6">
                    <StatusSteps status={complaint.status} />
                  </div>
                </div>
              </article>

              <section className="card">
                <p className="border-b border-neutral-200 px-5 py-3 font-medium">Activity</p>
                <div className="p-5">
                  <Timeline updates={complaint.updates} />
                </div>
              </section>
            </div>

            <aside className="lg:sticky lg:top-24 lg:self-start">
              <div className="card">
                <dl className="divide-y divide-neutral-100 px-4 text-[13px]">
                  {[
                    ["Tracking", <span className="font-mono">{complaint.trackingNumber}</span>],
                    ["Office", complaint.department?.name || "Not assigned"],
                    ["Location", [complaint.location.landmark, complaint.location.area, complaint.location.region].filter(Boolean).join(", ")],
                    ["Reported", formatDate(complaint.createdAt)],
                  ].map(([label, v]) => (
                    <div key={label} className="py-3">
                      <dt className="text-neutral-500">{label}</dt>
                      <dd className="mt-0.5 font-medium text-neutral-900">{v}</dd>
                    </div>
                  ))}
                </dl>
                {complaint.department?.contactPhone ? (
                  <div className="border-t border-neutral-200 p-3">
                    <a href={`tel:${complaint.department.contactPhone.replaceAll(" ", "")}`} className="btn btn-secondary btn-sm w-full">
                      <Phone className="size-3.5" aria-hidden="true" /> Call {complaint.department.contactPhone}
                    </a>
                  </div>
                ) : null}
              </div>
            </aside>
          </div>
        ) : null}
      </div>
    </main>
  );
}
