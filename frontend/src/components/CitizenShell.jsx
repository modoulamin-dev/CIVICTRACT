import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar.jsx";

export function CitizenShell() {
  return (
    <div>
      <Navbar />
      <Outlet />
    </div>
  );
}
