import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { apiFetch } from "../../services/api";

export default function Notifications() {
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
        {loading && (
          <div className="empty">
            Loading notifications...
          </div>
        )}

        {error && (
          <div className="empty">
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
          !error &&
          notifications.map((notification) => (
            <div
              className="notification"
              key={notification.id}
            >
              <b>
                Status updated to{" "}
                {formatStatus(
                  notification.new_status
                )}
              </b>

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
                <Link
                  to={`/reports/${notification.report_id}`}
                  className="view-link"
                >
                  View Report →
                </Link>
              </div>
            </div>
          ))}
      </section>
    </div>
  );
}