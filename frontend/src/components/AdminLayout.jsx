import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { ArrowUpRight, Inbox, LayoutDashboard, LogOut, Menu } from "lucide-react";
import { listComplaints } from "../data/mock.js";
import { Logo } from "./CitizenShell.jsx";

function navClass({ isActive }) {
  return `flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm transition-colors ${
    isActive ? "bg-neutral-200/60 font-medium text-neutral-900" : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
  }`;
}

function Sidebar() {
  const openCount = listComplaints().filter((c) => c.status !== "resolved").length;
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-14 items-center px-4">
        <Link to="/admin">
          <Logo />
        </Link>
      </div>
      <nav aria-label="Admin" className="flex-1 space-y-0.5 px-2 py-2">
        <NavLink to="/admin" end className={navClass}>
          <LayoutDashboard className="size-4" strokeWidth={1.75} aria-hidden="true" />
          Overview
        </NavLink>
        <NavLink to="/admin/complaints" className={navClass}>
          <Inbox className="size-4" strokeWidth={1.75} aria-hidden="true" />
          Complaints
          <span className="ml-auto font-mono text-xs text-neutral-400 tabular-nums">{openCount}</span>
        </NavLink>
      </nav>
      <div className="space-y-0.5 border-t border-neutral-200 p-2">
        <Link to="/" className="flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900">
          <ArrowUpRight className="size-4" strokeWidth={1.75} aria-hidden="true" />
          Public site
        </Link>
        <div className="flex items-center gap-2.5 px-2.5 py-2">
          <span className="grid size-6 place-items-center rounded-full bg-neutral-900 text-[10px] font-medium text-white">AD</span>
          <span className="min-w-0 flex-1 truncate text-[13px] text-neutral-600">admin@civictract.gm</span>
          <Link to="/admin/login" className="text-neutral-400 hover:text-neutral-900" aria-label="Sign out">
            <LogOut className="size-3.5" />
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

  useEffect(() => {
    setOpen(false);
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-neutral-50/60">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-56 border-r border-neutral-200 bg-neutral-50 lg:block">
        <Sidebar />
      </aside>

      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button type="button" className="absolute inset-0 bg-black/20" aria-label="Close menu" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-64 border-r border-neutral-200 bg-neutral-50">
            <Sidebar />
          </aside>
        </div>
      ) : null}

      <div className="lg:pl-56">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b border-neutral-200 bg-white/80 px-4 backdrop-blur-md sm:px-6">
          <button type="button" className="btn btn-ghost btn-sm -ml-2 px-2 lg:hidden" aria-label="Open menu" onClick={() => setOpen(true)}>
            <Menu className="size-4" />
          </button>
          <p className="text-sm text-neutral-500">
            Staff <span className="mx-1 text-neutral-300">/</span>
            <span className="text-neutral-900">{pathname.startsWith("/admin/complaints") ? "Complaints" : "Overview"}</span>
          </p>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
