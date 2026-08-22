import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import StatusBadge from "../../components/common/StatusBadge";
import ReportMap from "../../components/reports/ReportMap";
import { apiFetch } from "../../services/api";

export default function AdminReportDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [changingStatus, setChangingStatus] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Load the real report from Flask
  useEffect(() => {
    const loadReport = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await apiFetch(
          `/api/admin/reports/${id}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error || "Unable to load report."
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

  // Change report status using Flask
  const change = async (status) => {
    setChangingStatus(true);
    setError("");
    setMessage("");

    try {
      const response = await apiFetch(
        `/api/admin/reports/${id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Unable to change report status."
        );
      }

      // Update page immediately
      if (data.report) {
        setReport(data.report);
      } else {
        setReport((current) => ({
          ...current,
          status,
        }));
      }

      setMessage(`Status changed to ${status}.`);
    } catch (err) {
      if (err.message !== "Session expired") {
        setError(err.message);
      }
    } finally {
      setChangingStatus(false);
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
        {error}
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

  return (
    <div>
      <div className="page-heading">
        <span className="eyebrow">
          ADMIN REVIEW
        </span>

        <h2>{report.title}</h2>

        <StatusBadge status={report.status} />
      </div>

      <div className="detail-grid">
        {/* REPORT DETAILS */}

        <section className="form-card">
          <h3>Report Details</h3>

          <p className="detail-description">
            {report.description}
          </p>

          <h3>Location</h3>

          <p>
            {report.location_name || "Location not provided"}
          </p>

          {report.latitude && report.longitude && (
            <ReportMap report={report} />
          )}
        </section>

        {/* REVIEW & STATUS */}

        <section className="form-card">
          <h3>Review & Status</h3>

          <div className="detail-row">
            <span>Submitted by</span>

            <b>
              {report.created_by ||
                report.createdBy ||
                "Unknown user"}
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
            <span>Current status</span>

            <StatusBadge status={report.status} />
          </div>

          <p>
            Choose the result of your review. Status changes
            lock the report for the citizen.
          </p>

          {error && (
            <p className="form-error">
              {error}
            </p>
          )}

          {message && (
            <p className="form-success">
              {message}
            </p>
          )}

          <div className="status-actions">
            <button
              type="button"
              onClick={() =>
                change("UNDER INVESTIGATION")
              }
              className="btn btn-gold"
              disabled={changingStatus}
            >
              Under Investigation
            </button>

            <button
              type="button"
              onClick={() => change("RESOLVED")}
              className="btn btn-success"
              disabled={changingStatus}
            >
              Resolve
            </button>

            <button
              type="button"
              onClick={() => change("REJECTED")}
              className="btn btn-danger"
              disabled={changingStatus}
            >
              Reject
            </button>
          </div>

          <button
            type="button"
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