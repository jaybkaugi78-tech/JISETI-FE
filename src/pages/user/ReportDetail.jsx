import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import StatusBadge from "../../components/common/StatusBadge";
import ReportMap from "../../components/reports/ReportMap";
import { deleteReport } from "../../features/reports/reportsSlice";

export default function ReportDetail() {
  const { id } = useParams();
  const report = useSelector((s) => s.reports.items.find((r) => r.id === id));
  const user = useSelector((s) => s.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  if (!report) return <div className="empty">Report not found.</div>;

  const owner = report.createdBy === user?.email;
  const editable = owner && report.status === "DRAFT";

  const remove = () => {
    if (window.confirm("Delete this draft?")) {
      dispatch(deleteReport(report.id));
      navigate("/reports");
    }
  };

  return (
    <div>
      <div className="page-heading">
        <span className="eyebrow">{report.type}</span>
        <h2>{report.title}</h2>
        <StatusBadge status={report.status} />
      </div>
      <div className="detail-grid">
        <section className="form-card">
          <h3>Description</h3>
          <p className="detail-description">{report.description}</p>
          <h3>Location</h3>
          <ReportMap report={report} />
        </section>
        <section className="form-card">
          <h3>Report Information</h3>
          <div className="detail-row">
            <span>Report ID</span>
            <b>{report.id}</b>
          </div>
          <div className="detail-row">
            <span>Location</span>
            <b>{report.location}</b>
          </div>
          <div className="detail-row">
            <span>Status</span>
            <StatusBadge status={report.status} />
          </div>
          <div className="detail-row">
            <span>Created</span>
            <b>{report.createdAt}</b>
          </div>
          {editable ? (
            <div className="detail-actions">
              <button className="btn btn-navy">Edit Report</button>
              <button className="btn btn-danger" onClick={remove}>
                Delete
              </button>
            </div>
          ) : (
            <div className="locked">
              This report is locked because its status is no longer DRAFT.
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
