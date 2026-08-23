import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import { logout } from "../../features/auth/authSlice";
import { apiFetch } from "../../services/api";

export default function Sidebar({ admin }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [notificationCount, setNotificationCount] = useState(0);

  const links = admin
  ? [
      ["/admin", "⌂", "Dashboard"],
    ]
  : [
      ["/dashboard", "⌂", "Dashboard"],
      ["/reports", "▤", "My Reports"],
      ["/reports/new", "+", "New Report"],
      ["/notifications", "○", "Notifications"],
      ["/profile", "○", "Profile"],
    ];

  const loadNotificationCount = async () => {
    if (admin) {
      return;
    }

    try {
      const response = await apiFetch(
        "/api/reports/notifications"
      );

      const data = await response.json();

      if (response.ok) {
        const unread = (
          data.notifications || []
        ).filter(
          (notification) =>
            !notification.is_read
        ).length;

        setNotificationCount(unread);
      }
    } catch (error) {
      console.error(
        "Failed to load notification count:",
        error
      );
    }
  };

  useEffect(() => {
    loadNotificationCount();
  }, [admin]);

  const signOut = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">
          J
        </div>

        <div>
          <strong>JISETI</strong>

          <small>
            Sauti yako, Mabadiliko yetu.
          </small>
        </div>
      </div>

      <nav className="side-nav">
        {links.map(([to, icon, label]) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              isActive ? "active" : ""
            }
          >
            <span>{icon}</span>

            <span>{label}</span>

            {to === "/notifications" &&
              notificationCount > 0 && (
                <span className="notification-badge">
                  {notificationCount}
                </span>
              )}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-message">
        <div className="shield">
          ✦
        </div>

        <p>
          Together, we can build a{" "}
          <b>corruption free</b> society.
        </p>
      </div>

      <button
        type="button"
        className="logout-btn"
        onClick={signOut}
      >
        ↪ Logout
      </button>
    </aside>
  );
}