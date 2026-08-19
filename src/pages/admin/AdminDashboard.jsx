import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import StatusBadge from "../../components/common/StatusBadge";

export default function AdminDashboard() {
  const reports = useSelector((s) => s.reports.items);
  const count = (s) => reports.filter((r) => r.status === s).length;
  return (
    <div>
      <div className="page-heading">
        <span className="eyebrow">ADMINISTRATION</span>
        <h2>Admin Dashboard</h2>
        <p>Review and manage citizen reports.</p>
      </div>
      <div className="stats-grid">
        <div className="stat-card">
          <b>{reports.length}</b>
          <span>Total Reports</span>
        </div>
        <div className="stat-card gold-stat">
          <b>{count("UNDER INVESTIGATION")}</b>
          <span>Under Investigation</span>
        </div>
        <div className="stat-card green-stat">
          <b>{count("RESOLVED")}</b>
          <span>Resolved</span>
        </div>
        <div className="stat-card red-stat">
          <b>{count("REJECTED")}</b>
          <span>Rejected</span>
        </div>
      </div>
      <section className="form-card">
        <div className="section-head">
          <h3>Recent Reports</h3>
          <span>Filter: All</span>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Type</th>
                <th>Location</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((r) => (
                <tr key={r.id}>
                  <td>{r.id}</td>
                  <td>{r.title}</td>
                  <td>{r.type}</td>
                  <td>{r.location}</td>
                  <td>
                    <StatusBadge status={r.status} />
                  </td>
                  <td>
                    <Link className="view-link" to={`/admin/reports/${r.id}`}>
                      View →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
