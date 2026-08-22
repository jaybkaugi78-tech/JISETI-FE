import { useEffect, useState } from "react";
import { apiFetch } from "../../services/api";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      setError("");

      try {
        const [userResponse, reportsResponse] = await Promise.all([
          apiFetch("/api/auth/me"),
          apiFetch("/api/reports"),
        ]);

        const userData = await userResponse.json();
        const reportsData = await reportsResponse.json();

        if (!userResponse.ok) {
          throw new Error(
            userData.error || "Unable to load profile."
          );
        }

        if (!reportsResponse.ok) {
          throw new Error(
            reportsData.error || "Unable to load reports."
          );
        }

        setUser(userData.user);
        setReports(reportsData.reports || []);
      } catch (err) {
        if (err.message !== "Session expired") {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  if (loading) {
    return (
      <div className="empty">
        Loading profile...
      </div>
    );
  }

  if (error && !user) {
    return (
      <div className="empty">
        {error}
      </div>
    );
  }

  if (!user) {
    return (
      <div className="empty">
        User not found.
      </div>
    );
  }

  const countStatus = (status) =>
    reports.filter(
      (report) => report.status === status
    ).length;

  const initial = (
    user.username ||
    user.email ||
    "J"
  )
    .charAt(0)
    .toUpperCase();

  return (
    <div>
      <div className="page-heading">
        <span className="eyebrow">
          ACCOUNT
        </span>

        <h2>Profile</h2>

        <p>
          Manage your account and view your activity.
        </p>
      </div>

      {error && (
        <div className="form-error">
          {error}
        </div>
      )}

      <div className="profile-hero form-card">
        <div className="big-avatar">
          {initial}
        </div>

        <div>
          <h2>{user.username}</h2>

          <p>{user.email}</p>

          <span className="status status-resolved">
            Active Citizen
          </span>
        </div>

        <button
          type="button"
          className="btn btn-navy"
        >
          Edit Profile
        </button>
      </div>

      <div className="profile-grid">
        <section className="form-card">
          <h3>Account Information</h3>

          <div className="detail-row">
            <span>Username</span>
            <b>{user.username}</b>
          </div>

          <div className="detail-row">
            <span>Email</span>
            <b>{user.email}</b>
          </div>

          <div className="detail-row">
            <span>Total Reports</span>
            <b>{reports.length}</b>
          </div>
        </section>

        <section className="form-card">
          <h3>Report Activity</h3>

          <div className="detail-row">
            <span>Draft</span>
            <b>{countStatus("DRAFT")}</b>
          </div>

          <div className="detail-row">
            <span>Under Investigation</span>
            <b>
              {countStatus(
                "UNDER INVESTIGATION"
              )}
            </b>
          </div>

          <div className="detail-row">
            <span>Resolved</span>
            <b>{countStatus("RESOLVED")}</b>
          </div>

          <div className="detail-row">
            <span>Rejected</span>
            <b>{countStatus("REJECTED")}</b>
          </div>
        </section>

        <section className="form-card">
          <h3>Security Settings</h3>

          <div className="setting">
            <b>Change Password</b>
            <span>→</span>
          </div>

          <div className="setting">
            <b>Email Notifications</b>
            <span>→</span>
          </div>

          <div className="setting">
            <b>SMS Notifications</b>
            <span>→</span>
          </div>
        </section>
      </div>
    </div>
  );
}