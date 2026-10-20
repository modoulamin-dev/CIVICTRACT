import { Route, Routes } from "react-router-dom";
import { AdminLayout } from "./components/AdminLayout.jsx";
import { CitizenShell } from "./components/CitizenShell.jsx";
import { Home } from "./pages/citizen/Home.jsx";
import { ReportComplaint } from "./pages/citizen/ReportComplaint.jsx";
import { TrackComplaint } from "./pages/citizen/TrackComplaint.jsx";
import { PublicBoard } from "./pages/citizen/PublicBoard.jsx";
import { AdminLogin } from "./pages/admin/Login.jsx";
import { Dashboard } from "./pages/admin/Dashboard.jsx";
import { ComplaintList } from "./pages/admin/ComplaintList.jsx";
import { ComplaintManage } from "./pages/admin/ComplaintManage.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="complaints" element={<ComplaintList />} />
        <Route path="complaints/:id" element={<ComplaintManage />} />
      </Route>
      <Route element={<CitizenShell />}>
        <Route path="/" element={<Home />} />
        <Route path="/report" element={<ReportComplaint />} />
        <Route path="/track" element={<TrackComplaint />} />
        <Route path="/track/:trackingNumber" element={<TrackComplaint />} />
        <Route path="/board" element={<PublicBoard />} />
        <Route
          path="*"
          element={
            <main className="mx-auto max-w-3xl px-4 py-12">
              <h1 className="text-2xl font-bold">Page not found</h1>
            </main>
          }
        />
      </Route>
    </Routes>
  );
}
