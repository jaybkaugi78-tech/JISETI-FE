import { useState } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function MainLayout({ admin = false }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-shell">
      <Sidebar
        admin={admin}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="main-area">
        <Topbar
          admin={admin}
          onMenuClick={() =>
            setSidebarOpen(true)
          }
        />

        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}