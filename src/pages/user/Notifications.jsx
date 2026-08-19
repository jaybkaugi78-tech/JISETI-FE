export default function Notifications() {
  return (
    <div>
      <div className="page-heading">
        <span className="eyebrow">UPDATES</span>
        <h2>Notifications</h2>
        <p>Status changes and important updates about your reports.</p>
      </div>
      <div className="form-card">
        <div className="notification">
          <b>Status updated to UNDER INVESTIGATION</b>
          <p>Your report is now being reviewed by the relevant authorities.</p>
          <small>2 hours ago</small>
        </div>
        <div className="notification">
          <b>Welcome to Jiseti</b>
          <p>Your account was created successfully.</p>
          <small>Today</small>
        </div>
      </div>
    </div>
  );
}
