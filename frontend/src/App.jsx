import { Route, Routes } from "react-router-dom";
import { AdminLayout } from "./components/AdminLayout.jsx";
import { CitizenShell } from "./components/CitizenShell.jsx";
import { Home } from "./pages/citizen/Home.jsx";
import { ReportComplaint } from "./pages/citizen/ReportComplaint.jsx";
import { TrackComplaint } from "./pages/citizen/TrackComplaint.jsx";
import { PublicBoard } from "./pages/citizen/PublicBoard.jsx";
import { ComplaintDetail } from "./pages/citizen/ComplaintDetail.jsx";
import { Login } from "./pages/citizen/Login.jsx";
import { Register } from "./pages/citizen/Register.jsx";
import { MyComplaints } from "./pages/citizen/MyComplaints.jsx";
import { AdminLogin } from "./pages/admin/Login.jsx";
import { Dashboard } from "./pages/admin/Dashboard.jsx";
import { ComplaintList } from "./pages/admin/ComplaintList.jsx";
import { ComplaintManage } from "./pages/admin/ComplaintManage.jsx";
import { Stats } from "./pages/admin/Stats.jsx";
import { Departments } from "./pages/admin/Departments.jsx";
import { Users } from "./pages/admin/Users.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="complaints" element={<ComplaintList />} />
        <Route path="complaints/:id" element={<ComplaintManage />} />
        <Route path="stats" element={<Stats />} />
        <Route path="departments" element={<Departments />} />
        <Route path="users" element={<Users />} />
      </Route>
      <Route element={<CitizenShell />}>
        <Route path="/" element={<Home />} />
        <Route path="/report" element={<ReportComplaint />} />
        <Route path="/track" element={<TrackComplaint />} />
        <Route path="/track/:trackingNumber" element={<TrackComplaint />} />
        <Route path="/board" element={<PublicBoard />} />
        <Route path="/complaints/:id" element={<ComplaintDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/me" element={<MyComplaints />} />
        <Route path="*" element={<p className="page">Page not found.</p>} />
      </Route>
    </Routes>
  );
}
