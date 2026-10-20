import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { Bell, ExternalLink, Inbox, LayoutDashboard, LogOut, Menu, X } from "lucide-react";
import { listComplaints } from "../data/mock.js";
import { Logo } from "./CitizenShell.jsx";

function navClass({ isActive }) {
  return `group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
    isActive ? "bg-brand-50 text-brand-700" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
  }`;
}

function Sidebar() {
  const openCount = listComplaints().filter((c) => c.status !== "resolved").length;
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center px-5">
        <Link to="/admin">
          <Logo />
        </Link>
      </div>
      <nav aria-label="Admin" className="flex-1 space-y-1 px-3 py-4">
        <p className="px-3 pb-2 text-[11px] font-bold tracking-widest text-slate-400 uppercase">Workspace</p>
        <NavLink to="/admin" end className={navClass}>
          <LayoutDashboard className="size-[18px]" aria-hidden="true" />
          Dashboard
        </NavLink>
        <NavLink to="/admin/complaints" className={navClass}>
          <Inbox className="size-[18px]" aria-hidden="true" />
          Complaints
          <span className="ml-auto rounded-full bg-slate-900 px-2 py-0.5 text-[11px] font-bold text-white tabular-nums">{openCount}</span>
        </NavLink>
      </nav>
      <div className="space-y-1 border-t border-slate-200 p-3">
        <Link to="/" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100">
          <ExternalLink className="size-[18px]" aria-hidden="true" />
          Public site
        </Link>
        <div className="flex items-center gap-3 rounded-lg px-3 py-2.5">
          <span className="grid size-9 place-items-center rounded-full bg-gradient-to-br from-sky-500 to-indigo-600 text-sm font-bold text-white">
            AD
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-slate-900">Admin</p>
            <p className="truncate text-xs text-slate-500">admin@civictract.gm</p>
          </div>
          <Link to="/admin/login" className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700" aria-label="Sign out">
            <LogOut className="size-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

// Static prototype: no auth guard yet. The real version checks the staff session here.
export function AdminLayout() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const urgent = listComplaints({ urgentOnly: true }).filter((c) => c.status !== "resolved").length;

  useEffect(() => {
    setOpen(false);
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-slate-50">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-slate-200 bg-white lg:block">
        <Sidebar />
      </aside>

      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button type="button" className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" aria-label="Close menu" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-72 animate-rise bg-white shadow-xl">
            <Sidebar />
          </aside>
        </div>
      ) : null}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-slate-200 bg-white/80 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
          <button type="button" className="btn btn-ghost -ml-2 p-2 lg:hidden" aria-label="Open menu" onClick={() => setOpen(true)}>
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
          <p className="text-sm font-semibold text-slate-500">
            Staff workspace <span className="text-slate-300">/</span>{" "}
            <span className="text-slate-900">{pathname.startsWith("/admin/complaints") ? "Complaints" : "Dashboard"}</span>
          </p>
          <Link
            to="/admin/complaints?urgent=1"
            className="relative ml-auto rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
            aria-label={`${urgent} urgent complaints`}
          >
            <Bell className="size-5" />
            {urgent ? (
              <span className="absolute top-1 right-1 grid size-4 place-items-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white">
                {urgent}
              </span>
            ) : null}
          </Link>
        </header>
        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
