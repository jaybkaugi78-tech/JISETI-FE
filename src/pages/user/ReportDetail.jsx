import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";

import StatusBadge from "../../components/common/StatusBadge";
import ReportMap from "../../components/reports/ReportMap";

import { deleteReport } from "../../features/reports/reportsSlice";
import { apiFetch } from "../../services/api";

export default function ReportDetail() {
  const { id } = useParams();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadReport = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await apiFetch(
          `/api/reports/${id}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error || "Unable to load this report."
          );
        }

        setReport(data.report);
      } catch (err) {
        if (err.message !== "Session expired") {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    loadReport();
  }, [id]);

  const remove = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this draft?"
    );

    if (!confirmed) {
      return;
    }

    setDeleting(true);
    setError("");

    try {
      const response = await apiFetch(
        `/api/reports/${report.id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Unable to delete report."
        );
      }

      dispatch(deleteReport(report.id));

      navigate("/reports");
    } catch (err) {
      if (err.message !== "Session expired") {
        setError(err.message);
      }
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="empty">
        Loading report...
      </div>
    );
  }

  if (error && !report) {
    return (
      <div className="empty">
        <p>{error}</p>

        <Link to="/reports">
          ← Back to My Reports
        </Link>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="empty">
        Report not found.
      </div>
    );
  }

  const editable = report.status === "DRAFT";

  const createdDate = report.created_at
    ? new Date(report.created_at).toLocaleString()
    : "Unknown";

  return (
    <div>
      <div className="page-heading">
        <span className="eyebrow">
          {report.type === "RED_FLAG"
            ? "RED-FLAG"
            : "INTERVENTION"}
        </span>

        <h2>{report.title}</h2>

        <StatusBadge status={report.status} />
      </div>

      {error && (
        <p className="form-error">
          {error}
        </p>
      )}

      <div className="detail-grid">
        {/* LEFT SIDE */}

        <section className="form-card">
          <h3>Description</h3>

          <p className="detail-description">
            {report.description}
          </p>

          <h3>Location</h3>

          <p>
            📍{" "}
            {report.location_name ||
              "Location unavailable"}
          </p>

          <ReportMap report={report} />
        </section>

        {/* RIGHT SIDE */}

        <section className="form-card">
          <h3>Report Information</h3>

          <div className="detail-row">
            <span>Report ID</span>
            <b>#{report.id}</b>
          </div>

          <div className="detail-row">
            <span>Location</span>

            <b>
              {report.location_name ||
                "Not provided"}
            </b>
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
            <span>Status</span>

            <StatusBadge status={report.status} />
          </div>

          <div className="detail-row">
            <span>Created</span>

            <b>{createdDate}</b>
          </div>

          {/* STATUS HISTORY */}

          <div className="status-history">
            <h3>Status History</h3>

            {!report.status_history ||
            report.status_history.length === 0 ? (
              <>
                <div className="detail-row">
                  <span>DRAFT</span>
                  <small>Report created</small>
                </div>
              </>
            ) : (
              <>
                <div className="detail-row">
                  <span>DRAFT</span>
                  <small>Report created</small>
                </div>

                {report.status_history.map(
                  (history) => (
                    <div
                      className="detail-row"
                      key={history.id}
                    >
                      <div>
                        <b>
                          {history.old_status?.replaceAll(
                            "_",
                            " "
                          )}
                        </b>

                        {" → "}

                        <b>
                          {history.new_status?.replaceAll(
                            "_",
                            " "
                          )}
                        </b>
                      </div>

                      <small>
                        {history.changed_at
                          ? new Date(
                              history.changed_at
                            ).toLocaleString()
                          : ""}
                      </small>
                    </div>
                  )
                )}
              </>
            )}
          </div>

          {/* ACTIONS */}

          {editable ? (
            <div className="detail-actions">
              <button
                className="btn btn-navy"
                type="button"
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
                type="button"
                onClick={remove}
                disabled={deleting}
              >
                {deleting
                  ? "Deleting..."
                  : "Delete"}
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

      <div style={{ marginTop: "20px" }}>
        <Link to="/reports">
          ← Back to My Reports
        </Link>
      </div>
    </div>
  );
}