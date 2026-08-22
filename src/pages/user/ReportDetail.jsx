import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import StatusBadge from "../../components/common/StatusBadge";
import ReportMap from "../../components/reports/ReportMap";
import { deleteReport } from "../../features/reports/reportsSlice";
import { apiFetch } from "../../services/api";

import { useEffect, useState } from "react";

export default function ReportDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((s) => s.auth.user);

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadReport() {
      try {
        setLoading(true);
        setError("");

        const data = await apiFetch(`/reports/${id}`);

        setReport(data.report);
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to load report.");
      } finally {
        setLoading(false);
      }
    }

    loadReport();
  }, [id]);

  const remove = async () => {
    if (!report) return;

    if (!window.confirm("Delete this draft?")) {
      return;
    }

    try {
      await apiFetch(`/reports/${report.id}`, {
        method: "DELETE",
      });

      dispatch(deleteReport(report.id));

      navigate("/reports");
    } catch (err) {
      console.error(err);
      alert(err.message || "Could not delete report.");
    }
  };

  if (loading) {
    return <div className="empty">Loading report...</div>;
  }

  if (error) {
    return (
      <div className="empty">
        <p>{error}</p>

        <Link to="/reports" className="btn btn-navy">
          Back to Reports
        </Link>
      </div>
    );
  }

  if (!report) {
    return <div className="empty">Report not found.</div>;
  }

  const owner =
    Number(report.user_id) === Number(user?.id);

  const editable =
    owner && report.status === "DRAFT";

  const media = Array.isArray(report.media)
    ? report.media
    : [];

  const locationName =
    report.location_name || "Location not specified";

  const createdAt = report.created_at
    ? new Date(report.created_at).toLocaleString()
    : "Unknown";

  const getMediaUrl = (filename) => {
    if (!filename) return "";

    if (
      filename.startsWith("http://") ||
      filename.startsWith("https://")
    ) {
      return filename;
    }

    return `http://127.0.0.1:5000/uploads/${filename}`;
  };

  const isVideo = (filename) => {
    return /\.(mp4|webm|ogg|mov)$/i.test(filename);
  };

  return (
    <div>
      <div className="page-heading">
        <span className="eyebrow">
          {report.type === "RED_FLAG"
            ? "RED FLAG"
            : report.type}
        </span>

        <h2>{report.title}</h2>

        <StatusBadge status={report.status} />
      </div>

      <div className="detail-grid">
        <section className="form-card">
          <h3>Description</h3>

          <p className="detail-description">
            {report.description}
          </p>

          <h3>Location</h3>

          <p>{locationName}</p>

          {report.latitude != null &&
            report.longitude != null && (
              <ReportMap report={report} />
            )}

          <h3>Supporting Evidence</h3>

          {media.length === 0 ? (
            <p className="empty">
              No images or videos attached.
            </p>
          ) : (
            <div className="evidence-grid">
              {media.map((filename, index) => {
                const mediaUrl =
                  getMediaUrl(filename);

                return (
                  <div
                    className="evidence-item"
                    key={`${filename}-${index}`}
                  >
                    {isVideo(filename) ? (
                      <video
                        src={mediaUrl}
                        controls
                        preload="metadata"
                        className="evidence-media"
                      >
                        Your browser does not support
                        video playback.
                      </video>
                    ) : (
                      <img
                        src={mediaUrl}
                        alt={`Evidence ${index + 1}`}
                        className="evidence-media"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <section className="form-card">
          <h3>Report Information</h3>

          <div className="detail-row">
            <span>Report ID</span>
            <b>{report.id}</b>
          </div>

          <div className="detail-row">
            <span>Type</span>
            <b>
              {report.type === "RED_FLAG"
                ? "Red-Flag"
                : "Intervention"}
            </b>
          </div>

          <div className="detail-row">
            <span>Location</span>
            <b>{locationName}</b>
          </div>

          <div className="detail-row">
            <span>Status</span>
            <StatusBadge status={report.status} />
          </div>

          <div className="detail-row">
            <span>Created</span>
            <b>{createdAt}</b>
          </div>

          <div className="detail-row">
            <span>Evidence</span>
            <b>{media.length}</b>
          </div>

          {editable ? (
            <div className="detail-actions">
              <button
                className="btn btn-navy"
                onClick={() =>
                  navigate(
                    `/reports/${report.id}/edit`
                  )
                }
              >
                Edit Report
              </button>

              <button
                className="btn btn-danger"
                onClick={remove}
              >
                Delete
              </button>
            </div>
          ) : (
            <div className="locked">
              This report is locked because its
              status is no longer DRAFT.
            </div>
          )}
        </section>
      </div>
    </div>
  );
}