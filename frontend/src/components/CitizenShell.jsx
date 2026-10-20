import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { MapPinCheck, Menu, X } from "lucide-react";
import { departments } from "../data/mock.js";

const NAV = [
  { to: "/track", label: "Track" },
  { to: "/board", label: "Public board" },
];

export function Logo() {
  return (
    <span className="flex items-center gap-2">
      <span className="grid size-6 place-items-center rounded-md bg-brand-600 text-white" aria-hidden="true">
        <MapPinCheck className="size-3.5" strokeWidth={2.25} />
      </span>
      <span className="text-[15px] font-semibold tracking-tight text-neutral-900">CivicTract</span>
    </span>
  );
}

function navClass({ isActive }) {
  return `rounded-md px-2.5 py-1.5 text-sm transition-colors ${
    isActive ? "text-neutral-900" : "text-neutral-500 hover:text-neutral-900"
  }`;
}

function Header() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white/80 backdrop-blur-md">
      <div className="container-page flex h-14 items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <Link to="/" aria-label="CivicTract home">
            <Logo />
          </Link>
          <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
            {NAV.map((item) => (
              <NavLink key={item.to} to={item.to} className={navClass}>
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/admin/login" className="btn btn-ghost btn-sm hidden md:inline-flex">
            Staff login
          </Link>
          <Link to="/report" className="btn btn-primary btn-sm">
            Report a problem
          </Link>
          <button
            type="button"
            className="btn btn-ghost btn-sm px-2 md:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </div>
      {open ? (
        <nav id="mobile-nav" aria-label="Mobile" className="border-t border-neutral-200 bg-white md:hidden">
          <div className="container-page flex flex-col py-2">
            {[...NAV, { to: "/admin/login", label: "Staff login" }].map((item) => (
              <NavLink key={item.to} to={item.to} className="py-2.5 text-sm text-neutral-700">
                {item.label}
              </NavLink>
            ))}
          </div>
        </nav>
      ) : null}
    </header>
  );
}

function Footer() {
  return (
    <footer className="mt-auto border-t border-neutral-200 bg-neutral-50/50">
      <div className="container-page grid gap-8 py-10 text-[13px] sm:grid-cols-2 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo />
          <p className="mt-3 max-w-xs text-neutral-500">
            Report public problems in The Gambia and follow them until they are fixed.
          </p>
        </div>
        <div>
          <p className="font-medium text-neutral-900">Citizens</p>
          <ul className="mt-3 space-y-2 text-neutral-500">
            <li>
              <Link to="/report" className="hover:text-neutral-900">
                Report a problem
              </Link>
            </li>
            <li>
              <Link to="/track" className="hover:text-neutral-900">
                Track a complaint
              </Link>
            </li>
            <li>
              <Link to="/board" className="hover:text-neutral-900">
                Public board
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="font-medium text-neutral-900">Offices</p>
          <ul className="mt-3 space-y-2 text-neutral-500">
            {departments.map((item) => (
              <li key={item.id}>{item.name}</li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-neutral-200">
        <div className="container-page flex h-12 items-center justify-between text-xs text-neutral-400">
          <span>© {new Date().getFullYear()} CivicTract</span>
          <Link to="/admin/login" className="hover:text-neutral-900">
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
        className="sr-only z-50 rounded-md bg-white px-3 py-2 text-sm font-medium focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
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
