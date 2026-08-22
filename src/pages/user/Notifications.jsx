import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { apiFetch } from "../../services/api";

export default function Notifications() {
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadNotifications = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await apiFetch(
          "/api/reports/notifications"
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error || "Unable to load notifications."
          );
        }

        setNotifications(data.notifications || []);
      } catch (err) {
        if (err.message !== "Session expired") {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    loadNotifications();
  }, []);

  const formatStatus = (status) => {
    return status?.replaceAll("_", " ") || "";
  };

  const formatDate = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleString();
  };

  const viewNotification = async (notification) => {
    try {
      if (!notification.is_read) {
        const response = await apiFetch(
          `/api/reports/notifications/${notification.id}/read`,
          {
            method: "PATCH",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error || "Unable to mark notification as read."
          );
        }

        setNotifications((current) =>
          current.map((item) =>
            item.id === notification.id
              ? {
                  ...item,
                  is_read: true,
                }
              : item
          )
        );
      }

      navigate(`/reports/${notification.report_id}`);
    } catch (err) {
      if (err.message !== "Session expired") {
        setError(err.message);
      }
    }
  };

  const markAllRead = async () => {
    try {
      setError("");

      const response = await apiFetch(
        "/api/reports/notifications/read-all",
        {
          method: "PATCH",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Unable to mark notifications as read."
        );
      }

      setNotifications((current) =>
        current.map((notification) => ({
          ...notification,
          is_read: true,
        }))
      );
    } catch (err) {
      if (err.message !== "Session expired") {
        setError(err.message);
      }
    }
  };

  const unreadCount = notifications.filter(
    (notification) => !notification.is_read
  ).length;

  return (
    <div>
      <div className="page-heading">
        <span className="eyebrow">
          UPDATES
        </span>

        <h2>Notifications</h2>

        <p>
          Status changes and important updates about your reports.
        </p>
      </div>

      <section className="form-card">
        {unreadCount > 0 && (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "16px",
            }}
          >
            <span>
              {unreadCount} unread notification
              {unreadCount !== 1 ? "s" : ""}
            </span>

            <button
              type="button"
              className="btn btn-outline"
              onClick={markAllRead}
            >
              Mark all as read
            </button>
          </div>
        )}

        {loading && (
          <div className="empty">
            Loading notifications...
          </div>
        )}

        {error && (
          <div className="form-error">
            {error}
          </div>
        )}

        {!loading &&
          !error &&
          notifications.length === 0 && (
            <div className="empty">
              You don't have any notifications yet.
            </div>
          )}

        {!loading &&
          notifications.map((notification) => (
            <div
              className={`notification ${
                notification.is_read
                  ? "notification-read"
                  : "notification-unread"
              }`}
              key={notification.id}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "15px",
                }}
              >
                <b>
                  Status updated to{" "}
                  {formatStatus(
                    notification.new_status
                  )}
                </b>

                {!notification.is_read && (
                  <span
                    className="notification-dot"
                    title="Unread"
                  >
                    ●
                  </span>
                )}
              </div>

              <p>
                Your report{" "}
                <strong>
                  "{notification.report_title}"
                </strong>{" "}
                changed from{" "}
                {formatStatus(
                  notification.old_status
                )}{" "}
                to{" "}
                {formatStatus(
                  notification.new_status
                )}.
              </p>

              <small>
                {formatDate(
                  notification.changed_at
                )}
              </small>

              <div style={{ marginTop: "10px" }}>
                <button
                  type="button"
                  className="view-link"
                  onClick={() =>
                    viewNotification(notification)
                  }
                >
                  View Report →
                </button>
              </div>
            </div>
          ))}
      </section>
    </div>
  );
}