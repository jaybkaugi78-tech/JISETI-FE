import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { updateStatus } from "../../features/reports/reportsSlice";
import StatusBadge from "../../components/common/StatusBadge";
import ReportMap from "../../components/reports/ReportMap";

export default function AdminReportDetail() {
  const { id } = useParams();
  const report = useSelector((s) => s.reports.items.find((r) => r.id === id));
  const dispatch = useDispatch();
  const navigate = useNavigate();
  if (!report) return <div className="empty">Report not found.</div>;

  const change = (status) => {
    dispatch(updateStatus({ id, status }));
  };

  return (
    <div>
      <div className="page-heading">
        <span className="eyebrow">ADMIN REVIEW</span>
        <h2>{report.title}</h2>
        <StatusBadge status={report.status} />
      </div>
      <div className="detail-grid">
        <section className="form-card">
          <h3>Report Details</h3>
          <p className="detail-description">{report.description}</p>
          <h3>Location</h3>
          <ReportMap report={report} />
        </section>
        <section className="form-card">
          <h3>Review & Status</h3>
          <div className="detail-row">
            <span>Submitted by</span>
            <b>{report.createdBy}</b>
          </div>
          <div className="detail-row">
            <span>Type</span>
            <b>{report.type}</b>
          </div>
          <div className="detail-row">
            <span>Current status</span>
            <StatusBadge status={report.status} />
          </div>
          <p>
            Choose the result of your review. Status changes lock the report for
            the citizen.
          </p>
          <div className="status-actions">
            <button
              onClick={() => change("UNDER INVESTIGATION")}
              className="btn btn-gold"
            >
              Under Investigation
            </button>
            <button
              onClick={() => change("RESOLVED")}
              className="btn btn-success"
            >
              Resolve
            </button>
            <button
              onClick={() => change("REJECTED")}
              className="btn btn-danger"
            >
              Reject
            </button>
          </div>
          <button
            className="btn btn-outline"
            onClick={() => navigate("/admin")}
          >
            ← Back
          </button>
        </section>
      </div>
    </div>
  );
}
