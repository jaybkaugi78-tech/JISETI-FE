import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function MainLayout({ admin = false }) {
  return (
    <div className="app-shell">
      <Sidebar admin={admin} />
      <div className="main-area">
        <Topbar admin={admin} />
        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}