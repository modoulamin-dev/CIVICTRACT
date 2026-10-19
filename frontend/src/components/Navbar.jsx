import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export function Navbar() {
  const { user, logout } = useAuth();
  const isStaff = user?.role === "staff" || user?.role === "super_admin";

  return (
    <header className="nav">
      <div className="nav-inner">
        <Link to="/" className="brand">
          CivicTract
        </Link>
        <nav>
          <NavLink to="/report">Report</NavLink>
          <NavLink to="/track">Track</NavLink>
          <NavLink to="/board">Public board</NavLink>
          {user?.role === "citizen" ? <NavLink to="/me">My complaints</NavLink> : null}
          {isStaff ? <NavLink to="/admin">Dashboard</NavLink> : null}
          {user ? (
            <button type="button" className="linkish" onClick={logout}>
              Sign out
            </button>
          ) : (
            <NavLink to="/login">Sign in</NavLink>
          )}
        </nav>
      </div>
    </header>
  );
}
