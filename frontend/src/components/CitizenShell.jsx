import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { ArrowRight, Lock, MapPinCheck, Menu, Phone, X } from "lucide-react";
import { departments } from "../data/mock.js";

const NAV = [
  { to: "/", label: "Home", end: true },
  { to: "/track", label: "Track a complaint" },
  { to: "/board", label: "Public board" },
];

export function Logo({ inverted = false }) {
  return (
    <span className="flex items-center gap-2.5">
      <span
        className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-sm shadow-brand-900/30"
        aria-hidden="true"
      >
        <MapPinCheck className="size-5" strokeWidth={2.25} />
      </span>
      <span className={`text-lg font-extrabold tracking-tight ${inverted ? "text-white" : "text-slate-900"}`}>
        Civic<span className={inverted ? "text-brand-300" : "text-brand-600"}>Tract</span>
      </span>
    </span>
  );
}

function useScrolled(offset = 8) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > offset);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [offset]);
  return scrolled;
}

function navClass({ isActive }) {
  return `rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
    isActive ? "bg-brand-50 text-brand-700" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
  }`;
}

function Header() {
  const scrolled = useScrolled();
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled || open
          ? "border-b border-slate-200/80 bg-white/80 shadow-sm backdrop-blur-xl"
          : "border-b border-slate-100 bg-white"
      }`}
    >
      <div className="flag-stripe h-1" aria-hidden="true" />
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link to="/" aria-label="CivicTract home">
          <Logo />
        </Link>
        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} className={navClass}>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link to="/report" className="btn btn-primary hidden sm:inline-flex">
            Report a problem
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
          <button
            type="button"
            className="btn btn-ghost p-2 md:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </div>
      {open ? (
        <nav id="mobile-nav" aria-label="Mobile" className="animate-rise border-t border-slate-100 px-4 pt-2 pb-4 md:hidden">
          <div className="flex flex-col gap-1">
            {NAV.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.end} className={navClass}>
                {item.label}
              </NavLink>
            ))}
          </div>
          <Link to="/report" className="btn btn-primary mt-3 w-full">
            Report a problem
          </Link>
        </nav>
      ) : null}
    </header>
  );
}

function Footer() {
  return (
    <footer className="relative mt-auto overflow-hidden bg-brand-950 text-brand-100/80">
      <div className="flag-stripe h-1" aria-hidden="true" />
      <div className="absolute -bottom-32 -left-20 size-96 rounded-full bg-brand-600/20 blur-3xl" aria-hidden="true" />
      <div className="relative mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <Logo inverted />
            <p className="mt-4 max-w-sm text-sm leading-relaxed">
              One place for every Gambian to report public problems and see them through, from the first report to the
              final fix.
            </p>
            <Link
              to="/report"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-brand-900 transition hover:bg-brand-50"
            >
              Report a problem <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
          <div className="md:col-span-3">
            <h2 className="text-sm font-bold text-white">For citizens</h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              {[
                ["/report", "Report a problem"],
                ["/track", "Track a complaint"],
                ["/board", "Public board"],
              ].map(([to, label]) => (
                <li key={to}>
                  <Link to={to} className="transition-colors hover:text-white">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="md:col-span-4">
            <h2 className="text-sm font-bold text-white">Responsible offices</h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              {departments.slice(0, 4).map((item) => (
                <li key={item.id} className="flex items-center justify-between gap-3">
                  <span>{item.name}</span>
                  <span className="flex items-center gap-1.5 text-xs text-brand-200/70">
                    <Phone className="size-3" aria-hidden="true" />
                    {item.contactPhone}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} CivicTract · Built for The Gambia</p>
          <Link to="/admin/login" className="inline-flex items-center gap-1.5 font-semibold transition-colors hover:text-white">
            <Lock className="size-3.5" aria-hidden="true" />
            Staff login
          </Link>
        </div>
      </div>
    </footer>
  );
}

export function CitizenShell() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main"
        className="sr-only z-50 rounded-lg bg-white px-4 py-2 font-semibold focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Skip to main content
      </a>
      <Header />
      <div id="main" className="flex flex-1 flex-col">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}
