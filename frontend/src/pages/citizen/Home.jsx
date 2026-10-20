import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { departments, listComplaints, stats } from "../../data/mock.js";
import { ComplaintCard } from "../../components/ComplaintCard.jsx";
import { CategoryIcon, StatusBadge } from "../../components/StatusBadge.jsx";
import { StatusSteps } from "../../components/Timeline.jsx";
import { CATEGORY_META, timeAgo } from "../../utils/meta.js";

const STEPS = [
  ["Report", "Choose the problem, say where it is and add a photo. No account needed."],
  ["Routed", "It goes straight to the office responsible. You get a tracking number."],
  ["Resolved", "Every update the office posts is public against your tracking number."],
];

function Preview({ complaint }) {
  const latest = complaint.updates.at(-1);
  return (
    <div className="card overflow-hidden shadow-[0_8px_30px_-12px_rgb(0_0_0/0.12)]">
      <div className="flex items-center justify-between border-b border-neutral-200 bg-neutral-50/70 px-4 py-2.5">
        <span className="font-mono text-xs text-neutral-500">{complaint.trackingNumber}</span>
        <StatusBadge status={complaint.status} />
      </div>
      <div className="p-4">
        <div className="flex items-start gap-3">
          <CategoryIcon category={complaint.category} />
          <div className="min-w-0">
            <p className="font-medium">{complaint.title}</p>
            <p className="text-[13px] text-neutral-500">
              {complaint.location.area} · {complaint.department.name}
            </p>
          </div>
        </div>
        <div className="mt-5">
          <StatusSteps status={complaint.status} />
        </div>
        <div className="mt-5 rounded-md border border-neutral-200 p-3">
          <div className="flex items-center justify-between text-xs text-neutral-400">
            <span>Latest update</span>
            <span>{timeAgo(latest.createdAt)}</span>
          </div>
          <p className="mt-1 text-[13px] text-neutral-700">{latest.message}</p>
        </div>
      </div>
    </div>
  );
}

export function Home() {
  const all = listComplaints();
  const s = stats();
  const featured = all.find((c) => c.status === "in_progress") || all[0];

  return (
    <main>
      <section className="border-b border-neutral-200">
        <div className="container-page grid items-center gap-12 py-16 lg:grid-cols-[1.1fr_1fr] lg:py-24">
          <div className="animate-fade">
            <p className="kicker">Public complaints · The Gambia</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tighter text-balance sm:text-5xl">
              Report a public problem. Follow it until it is fixed.
            </h1>
            <p className="mt-5 max-w-lg text-base leading-7 text-neutral-500">
              Damaged roads, uncollected waste, water cuts, unsafe spaces. Tell us once — we route it to the office
              responsible, and every step is visible to everyone.
            </p>
            <div className="mt-8 flex flex-wrap gap-2">
              <Link to="/report" className="btn btn-primary btn-lg">
                Report a problem <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
              <Link to="/track" className="btn btn-secondary btn-lg">
                Track a complaint
              </Link>
            </div>
          </div>
          <div className="animate-fade [animation-delay:100ms]">
            <Preview complaint={featured} />
          </div>
        </div>
      </section>

      <section className="border-b border-neutral-200">
        <dl className="container-page grid grid-cols-2 md:grid-cols-4">
          {[
            ["Reported", s.open + s.resolved],
            ["In progress", s.open],
            ["Resolved", s.resolved],
            ["Offices", departments.length],
          ].map(([label, value]) => (
            <div key={label} className="border-neutral-200 py-6 md:border-l md:pl-6 md:first:border-l-0 md:first:pl-0">
              <dt className="text-[13px] text-neutral-500">{label}</dt>
              <dd className="mt-1 text-2xl font-semibold tracking-tight tabular-nums">{value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="container-page py-16">
        <div className="grid gap-10 lg:grid-cols-[280px_1fr]">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">What you can report</h2>
            <p className="mt-2 text-neutral-500">Pick the problem and we find the office responsible.</p>
          </div>
          <ul className="grid gap-px overflow-hidden rounded-lg border border-neutral-200 bg-neutral-200 sm:grid-cols-2">
            {Object.entries(CATEGORY_META).map(([key, meta]) => (
              <li key={key} className="bg-white">
                <Link to={`/report?category=${key}`} className="group flex h-full items-start gap-3 p-4 transition-colors hover:bg-neutral-50">
                  <CategoryIcon category={key} />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{meta.label}</p>
                    <p className="mt-0.5 text-[13px] text-neutral-500">{meta.hint}</p>
                  </div>
                  <ArrowRight className="mt-1 size-4 text-neutral-300 transition group-hover:translate-x-0.5 group-hover:text-neutral-900" aria-hidden="true" />
                </Link>
              </li>
            ))}
            <li className="hidden bg-white sm:block" aria-hidden="true" />
          </ul>
        </div>
      </section>

      <section className="border-y border-neutral-200 bg-neutral-50/50">
        <div className="container-page grid gap-10 py-16 lg:grid-cols-[280px_1fr]">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">How it works</h2>
            <p className="mt-2 text-neutral-500">Three steps, in the open.</p>
          </div>
          <ol className="grid gap-8 sm:grid-cols-3">
            {STEPS.map(([title, body], index) => (
              <li key={title}>
                <span className="font-mono text-xs text-neutral-400">0{index + 1}</span>
                <p className="mt-2 font-medium">{title}</p>
                <p className="mt-1 text-neutral-500">{body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="container-page py-16">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">Recently reported</h2>
            <p className="mt-1 text-neutral-500">Live from communities across the country.</p>
          </div>
          <Link to="/board" className="btn btn-secondary btn-sm">
            View all <ArrowRight className="size-3.5" aria-hidden="true" />
          </Link>
        </div>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {all.slice(0, 6).map((item) => (
            <ComplaintCard key={item.id} complaint={item} />
          ))}
        </ul>
      </section>
    </main>
  );
}
