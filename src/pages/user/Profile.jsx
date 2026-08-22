import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { apiFetch } from "../../services/api";

export default function Profile() {
  const reduxUser = useSelector((s) => s.auth.user);
  const reports = useSelector((s) => s.reports.items);

  const [user, setUser] = useState(reduxUser);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setError("");

        const response = await apiFetch("/api/auth/me");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error || "Unable to load profile."
          );
        }

        setUser(data.user || data);
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
    return <div className="empty">Loading profile...</div>;
  }

  if (!user) {
    return (
      <div className="empty">
        {error || "Unable to load profile."}
      </div>
    );
  }

  const myReports = reports.filter(
    (report) =>
      report.createdBy === user.email ||
      report.created_by === user.email
  );

  const countStatus = (status) =>
    myReports.filter(
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
        <span className="eyebrow">ACCOUNT</span>
        <h2>Profile</h2>
        <p>Manage your account and view your activity.</p>
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
            <b>{myReports.length}</b>
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
            <b>{countStatus("UNDER INVESTIGATION")}</b>
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