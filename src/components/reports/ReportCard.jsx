import { Link } from "react-router-dom";
import StatusBadge from "../common/StatusBadge";

export default function ReportCard({ report }) {
  return (
    <Link to={`/reports/${report.id}`} className="report-card">
      <div className={`type-icon ${report.type === "Red-Flag" ? "red" : "gold"}`}>
        {report.type === "Red-Flag" ? "⚑" : "⌂"}
      </div>
      <div className="report-main">
        <div className="report-title-row">
          <h3>{report.title}</h3>
          <StatusBadge status={report.status} />
        </div>
        <p className="location">⌖ {report.location}</p>
        <p>{report.description}</p>
        <small>{report.createdAt}</small>
      </div>
      <span className="arrow">›</span>
    </Link>
  );
}