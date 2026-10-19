import { NavLink, Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export function AdminLayout() {
  const { user, ready } = useAuth();
  if (!ready) return <p className="page">Loading…</p>;
  if (!user || !["staff", "super_admin"].includes(user.role)) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="admin-shell">
      <aside className="admin-side">
        <p className="brand">CivicTract Admin</p>
        <nav>
          <NavLink to="/admin" end>
            Overview
          </NavLink>
          <NavLink to="/admin/complaints">Complaints</NavLink>
          <NavLink to="/admin/stats">Statistics</NavLink>
          {user.role === "super_admin" ? <NavLink to="/admin/departments">Departments</NavLink> : null}
          {user.role === "super_admin" ? <NavLink to="/admin/users">Staff</NavLink> : null}
          <NavLink to="/">Citizen site</NavLink>
        </nav>
      </aside>
      <section className="admin-main">
        <Outlet />
      </section>
    </div>
  );
}
