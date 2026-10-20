import { Link } from "react-router-dom";
import { ArrowRight, Building2, Camera, CheckCheck, MapPin, Search, Send } from "lucide-react";
import { departments, listComplaints, stats } from "../../data/mock.js";
import { ComplaintCard } from "../../components/ComplaintCard.jsx";
import { CategoryIcon, StatusBadge } from "../../components/StatusBadge.jsx";
import { StatusSteps } from "../../components/Timeline.jsx";
import { CATEGORY_META } from "../../utils/meta.js";

const STEPS = [
  {
    icon: Camera,
    title: "Report it in two minutes",
    body: "Choose the problem, say where it is and add a photo. No account, no paperwork.",
    tone: "bg-orange-50 text-orange-600",
  },
  {
    icon: Send,
    title: "It reaches the right office",
    body: "We route it straight to the department responsible and give you a tracking number.",
    tone: "bg-sky-50 text-sky-600",
  },
  {
    icon: CheckCheck,
    title: "Follow it until it is fixed",
    body: "Every action the department takes appears publicly against your tracking number.",
    tone: "bg-brand-50 text-brand-700",
  },
];

function HeroPreview({ complaint }) {
  return (
    <div className="relative mx-auto w-full max-w-md lg:mx-0">
      <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-brand-200/60 via-sky-100/60 to-amber-100/60 blur-2xl" aria-hidden="true" />
      <div className="card relative rotate-1 p-6 shadow-lift transition-transform duration-500 hover:rotate-0">
        <div className="flex items-center justify-between">
          <span className="rounded-md bg-slate-100 px-2 py-1 font-mono text-xs font-semibold text-slate-600">
            {complaint.trackingNumber}
          </span>
          <StatusBadge status={complaint.status} />
        </div>
        <div className="mt-5 flex items-start gap-3">
          <CategoryIcon category={complaint.category} />
          <div>
            <p className="font-bold text-slate-900">{complaint.title}</p>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
              <MapPin className="size-3.5" aria-hidden="true" />
              {complaint.location.area}
            </p>
          </div>
        </div>
        <div className="mt-6">
          <StatusSteps status={complaint.status} />
        </div>
        <div className="mt-6 rounded-xl bg-slate-50 p-4 ring-1 ring-slate-100">
          <p className="text-xs font-semibold text-slate-500">Latest update</p>
          <p className="mt-1 text-sm font-medium text-slate-800">{complaint.updates.at(-1).message}</p>
          <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
            <Building2 className="size-3.5" aria-hidden="true" />
            {complaint.department.name}
          </p>
        </div>
      </div>
    </div>
  );
}

export function Home() {
  const all = listComplaints();
  const recent = all.slice(0, 6);
  const s = stats();
  const featured = all.find((c) => c.status === "in_progress") || all[0];

  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden bg-white">
        <div className="dot-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_top_left,black,transparent_70%)]" aria-hidden="true" />
        <div className="absolute top-1/3 -right-40 size-[32rem] rounded-full bg-brand-100/60 blur-3xl" aria-hidden="true" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-4 pt-14 pb-20 sm:px-6 lg:grid-cols-2 lg:pt-20 lg:pb-24">
          <div className="animate-rise">
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-800">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-brand-500 opacity-60" />
                <span className="relative inline-flex size-2 rounded-full bg-brand-600" />
              </span>
              Public complaints for The Gambia
            </span>
            <h1 className="mt-6 text-4xl leading-[1.08] font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              See a problem?
              <br />
              <span className="bg-gradient-to-r from-brand-600 via-brand-500 to-sky-600 bg-clip-text text-transparent">
                Report it. Track it.
              </span>
              <br />
              See it fixed.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-600">
              Damaged roads, uncollected waste, water cuts or unsafe public spaces. Tell us once — we send it to the
              office responsible and you can follow every step in the open.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/report" className="btn btn-primary btn-lg">
                Report a problem <ArrowRight className="size-5" aria-hidden="true" />
              </Link>
              <Link to="/track" className="btn btn-secondary btn-lg">
                <Search className="size-5 text-slate-500" aria-hidden="true" /> Track a complaint
              </Link>
            </div>
            <p className="mt-5 text-sm text-slate-500">No account needed · Your contact details stay private</p>
          </div>
          <div className="animate-rise [animation-delay:150ms]">
            <HeroPreview complaint={featured} />
          </div>
        </div>
      </section>

      {/* Numbers */}
      <section className="border-y border-slate-200 bg-white">
        <dl className="mx-auto grid max-w-6xl grid-cols-2 divide-slate-200 px-4 sm:px-6 md:grid-cols-4 md:divide-x">
          {[
            ["Complaints reported", s.open + s.resolved, "text-slate-900"],
            ["Being worked on", s.open, "text-amber-600"],
            ["Resolved", s.resolved, "text-emerald-600"],
            ["Responsible offices", departments.length, "text-sky-600"],
          ].map(([label, value, tone]) => (
            <div key={label} className="px-2 py-7 text-center md:px-6">
              <dd className={`text-3xl font-extrabold tracking-tight tabular-nums ${tone}`}>{value}</dd>
              <dt className="mt-1 text-sm font-medium text-slate-500">{label}</dt>
            </div>
          ))}
        </dl>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <p className="eyebrow">What you can report</p>
        <h2 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">Pick the problem, we find the office</h2>
        <ul className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-5">
          {Object.entries(CATEGORY_META).map(([key, meta]) => (
            <li key={key}>
              <Link to={`/report?category=${key}`} className="card card-hover group flex h-full flex-col p-5">
                <CategoryIcon category={key} size="lg" />
                <p className="mt-4 font-bold text-slate-900">{meta.label}</p>
                <p className="mt-1 text-sm leading-snug text-slate-500">{meta.hint}</p>
                <span className="mt-auto flex items-center gap-1 pt-4 text-sm font-semibold text-slate-400 transition-colors group-hover:text-brand-700">
                  Report <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* How it works */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="eyebrow">How it works</p>
          <h2 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">Three steps, fully in the open</h2>
          <ol className="mt-10 grid gap-6 md:grid-cols-3">
            {STEPS.map((step, index) => {
              const Icon = step.icon;
              return (
                <li key={step.title} className="relative rounded-2xl border border-slate-200 p-6">
                  <span className="absolute top-5 right-6 text-5xl font-extrabold text-slate-100" aria-hidden="true">
                    0{index + 1}
                  </span>
                  <span className={`relative grid size-12 place-items-center rounded-2xl ${step.tone}`}>
                    <Icon className="size-6" aria-hidden="true" />
                  </span>
                  <h3 className="relative mt-5 text-lg font-bold">{step.title}</h3>
                  <p className="relative mt-2 leading-relaxed text-slate-600">{step.body}</p>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* Recent */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow">Live from communities</p>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">Recently reported</h2>
          </div>
          <Link to="/board" className="btn btn-secondary self-start sm:self-auto">
            See all complaints <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
        <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {recent.map((item, index) => (
            <ComplaintCard key={item.id} complaint={item} index={index} />
          ))}
        </ul>
      </section>

      {/* CTA */}
      <section className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-700 via-brand-600 to-brand-800 px-6 py-12 text-center sm:px-12">
          <div className="dot-grid absolute inset-0 opacity-30 invert" aria-hidden="true" />
          <div className="absolute -top-20 -right-10 size-64 rounded-full bg-sky-400/20 blur-3xl" aria-hidden="true" />
          <div className="absolute -bottom-24 -left-10 size-64 rounded-full bg-amber-300/20 blur-3xl" aria-hidden="true" />
          <h2 className="relative text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
            Your report puts the problem on the map.
          </h2>
          <p className="relative mx-auto mt-3 max-w-xl text-brand-100">
            It takes two minutes, and everyone can see what happens next.
          </p>
          <Link
            to="/report"
            className="relative mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 font-semibold text-brand-800 shadow-lg transition hover:bg-brand-50"
          >
            Report a problem <ArrowRight className="size-5" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </main>
  );
}
