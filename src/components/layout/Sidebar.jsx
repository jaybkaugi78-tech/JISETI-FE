import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import { logout } from "../../features/auth/authSlice";
import { apiFetch } from "../../services/api";

export default function Sidebar({
  admin,
  open,
  onClose,
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [notificationCount, setNotificationCount] =
    useState(0);

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

  useEffect(() => {
    if (open) {
      document.body.classList.add(
        "sidebar-open"
      );
    } else {
      document.body.classList.remove(
        "sidebar-open"
      );
    }

    return () => {
      document.body.classList.remove(
        "sidebar-open"
      );
    };
  }, [open]);

  const signOut = () => {
    dispatch(logout());
    navigate("/login");

    if (onClose) {
      onClose();
    }
  };

  const handleNavigation = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <>
      <div
        className={
          open
            ? "sidebar-overlay visible"
            : "sidebar-overlay"
        }
        onClick={onClose}
      />

      <aside
        className={
          open
            ? "sidebar mobile-open"
            : "sidebar"
        }
      >
        <div className="sidebar-top">
          <div className="brand">
            <img
              src="/favicon.png"
              alt="Jiseti"
              className="sidebar-brand-logo"
            />

            <div>
              <strong>
                JISETI
              </strong>

              <small>
                Sauti yako, Mabadiliko yetu.
              </small>
            </div>
          </div>

          <button
            type="button"
            className="sidebar-close"
            onClick={onClose}
            aria-label="Close menu"
          >
            ×
          </button>
        </div>

        <nav className="side-nav">
          {links.map(
            ([to, icon, label]) => (
              <NavLink
                key={to}
                to={to}
                onClick={handleNavigation}
                className={({ isActive }) =>
                  isActive ? "active" : ""
                }
              >
                <span className="side-nav-icon">
                  {icon}
                </span>

                <span>
                  {label}
                </span>

                {to ===
                  "/notifications" &&
                  notificationCount > 0 && (
                    <span className="notification-badge">
                      {
                        notificationCount
                      }
                    </span>
                  )}
              </NavLink>
            )
          )}
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-message">
            <div className="shield">
              ✦
            </div>

            <p>
              Together, we can build a{" "}
              <b>
                corruption free
              </b>{" "}
              society.
            </p>
          </div>

          <button
            type="button"
            className="logout-btn"
            onClick={signOut}
          >
            ↪ Logout
          </button>
        </div>
      </aside>
    </>
  );
}