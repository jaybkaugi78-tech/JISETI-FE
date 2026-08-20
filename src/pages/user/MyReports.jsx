import { useSelector } from "react-redux";
import ReportCard from "../../components/reports/ReportCard";

export default function MyReports() {
  const user = useSelector((s) => s.auth.user);
  const reports = useSelector((s) => s.reports.items).filter(
    (r) => r.createdBy === user?.email,
  );
  const list = reports.length ? reports : useSelector((s) => s.reports.items);

  return (
    <div>
      <div className="page-heading">
        <span className="eyebrow">YOUR ACTIVITY</span>
        <h2>My Reports</h2>
        <p>View and track your submitted reports.</p>
      </div>
      <div className="reports-list">
        {list.map((r) => (
          <ReportCard key={r.id} report={r} />
        ))}
      </div>
    </div>
  );
}
