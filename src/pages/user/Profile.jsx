import { useSelector } from "react-redux";

export default function Profile() {
  const user = useSelector((s) => s.auth.user);
  const reports = useSelector((s) => s.reports.items).filter(
    (r) => r.createdBy === user?.email,
  );
  return (
    <div>
      <div className="page-heading">
        <span className="eyebrow">ACCOUNT</span>
        <h2>Profile</h2>
        <p>Manage your account and preferences.</p>
      </div>
      <div className="profile-hero form-card">
        <div className="big-avatar">
          {(user?.username || "J").charAt(0).toUpperCase()}
        </div>
        <div>
          <h2>{user?.username}</h2>
          <p>{user?.email}</p>
          <span className="status status-resolved">Active Citizen</span>
        </div>
        <button className="btn btn-navy">Edit Profile</button>
      </div>
      <div className="profile-grid">
        <section className="form-card">
          <h3>Account Information</h3>
          <div className="detail-row">
            <span>Username</span>
            <b>{user?.username}</b>
          </div>
          <div className="detail-row">
            <span>Email</span>
            <b>{user?.email}</b>
          </div>
          <div className="detail-row">
            <span>Reports</span>
            <b>{reports.length}</b>
          </div>
        </section>
        <section className="form-card">
          <h3>Security Settings</h3>
          <div className="setting">
            <b>Change Password</b>
            <span>→</span>
          </div>
          <div className="setting">
            ♢ <b>Email Notifications</b>
            <span>→</span>
          </div>
          <div className="setting">
            ♧ <b>SMS Notifications</b>
            <span>→</span>
          </div>
        </section>
      </div>
    </div>
  );
}
