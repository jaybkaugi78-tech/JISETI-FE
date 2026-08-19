import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import ReportCard from "../../components/reports/ReportCard";

export default function Dashboard() {
  const { user } = useSelector((s) => s.auth);
  const reports = useSelector((s) => s.reports.items).filter(
    (r) => r.createdBy === user?.email,
  );
  const visible = reports.length
    ? reports
    : useSelector((s) => s.reports.items).slice(0, 3);

  return (
    <div>
      <section className="welcome-banner">
        <div>
          <span className="eyebrow">CITIZEN DASHBOARD</span>
          <h2>Welcome back, {user?.username || "Citizen"}! </h2>
          <p>
            Your voice matters. Report corruption or request government
            intervention.
          </p>
          <div className="hero-actions">
            <Link to="/reports/new" className="btn btn-navy">
              ⚑ Report Corruption
            </Link>
            <Link to="/reports/new" className="btn btn-gold">
              ⌂ Request Intervention
            </Link>
          </div>
        </div>
        <div className="banner-art"></div>
      </section>
      <div className="section-head">
        <h2>My Reports</h2>
        <Link to="/reports">View all →</Link>
      </div>
      <div className="reports-list">
        {visible.map((r) => (
          <ReportCard key={r.id} report={r} />
        ))}
      </div>
      <section className="how">
        <h2>How Jiseti Works</h2>
        <div className="steps">
          {["Report", "Review", "Action", "Resolution"].map((x, i) => (
            <div className="step" key={x}>
              <b>{i + 1}</b>
              <h3>{x}</h3>
              <p>
                {
                  [
                    "Submit your report.",
                    "Authorities review it.",
                    "Action is taken.",
                    "The issue is resolved.",
                  ][i]
                }
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
