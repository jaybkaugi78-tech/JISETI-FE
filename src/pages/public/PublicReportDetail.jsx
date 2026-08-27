import { API_BASE_URL } from "../../services/api";
import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useParams,
} from "react-router-dom";

import ReportMap from "../../components/reports/ReportMap";

export default function PublicReportDetail() {
  const { id } =
    useParams();

  const [report, setReport] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const loadReport =
      async () => {
        try {
          setLoading(true);
          setError("");

          const response =
            await fetch(
              `${API_BASE_URL}/api/reports/public/${id}`
            );

          const data =
            await response.json();

          if (!response.ok) {
            throw new Error(
              data.error ||
                "Unable to load report."
            );
          }

          setReport(
            data.report
          );
        } catch (err) {
          console.error(
            err
          );

          setError(
            err.message ||
              "Unable to load report."
          );
        } finally {
          setLoading(
            false
          );
        }
      };

    loadReport();
  }, [id]);

  if (loading) {
    return (
      <div className="public-reports-page">
        <div className="empty">
          Loading report...
        </div>
      </div>
    );
  }

  if (
    error ||
    !report
  ) {
    return (
      <div className="public-reports-page">
        <div className="empty">
          <p>
            {error ||
              "Report not found."}
          </p>

          <Link
            to="/public/reports"
            className="btn btn-navy"
          >
            Back to Reports
          </Link>
        </div>
      </div>
    );
  }

  const location =
    report.location_name ||
    "Location not provided";

  const createdAt =
    report.created_at
      ? new Date(
          report.created_at
        ).toLocaleDateString()
      : "Unknown";

  const type =
    report.type ===
    "RED_FLAG"
      ? "Corruption Report"
      : "Intervention Request";

  const statusClass =
    report.status ===
    "RESOLVED"
      ? "resolved"
      : "investigation";

  const media =
    Array.isArray(
      report.media
    )
      ? report.media
      : [];

  const mediaUrl =
    (filename) =>
      `${API_BASE_URL}/api/reports/media/${filename}`;

  const isVideo =
    (filename) =>
      /\.(mp4|webm|mov)$/i.test(
        filename
      );

  return (
    <div className="public-reports-page">
      <Link
        to="/public/reports"
        className="public-back-link"
      >
         Back to Public Reports
      </Link>

      <div className="page-heading">
        <span className="eyebrow">
          COMMUNITY REPORT
        </span>

        <h1>
          {report.title}
        </h1>

        <span
          className={`report-status ${statusClass}`}
        >
          {report.status}
        </span>
      </div>

      <div className="detail-grid">
        <section className="form-card">
          <h3>
            Report Details
          </h3>

          <p className="detail-description">
            {
              report.description
            }
          </p>

          <h3>
            Incident Location
          </h3>

          <p>
           {location}
          </p>

          {report.latitude !=
            null &&
            report.longitude !=
              null && (
              <ReportMap
                report={
                  report
                }
              />
            )}

          <h3>
            Supporting Evidence
          </h3>

          {media.length ===
          0 ? (
            <p>
              No public evidence
              attached.
            </p>
          ) : (
            <div className="evidence-grid">
              {media.map(
                (
                  filename,
                  index
                ) => (
                  <div
                    key={`${filename}-${index}`}
                    className="evidence-item"
                  >
                    {isVideo(
                      filename
                    ) ? (
                      <video
                        src={mediaUrl(
                          filename
                        )}
                        controls
                        className="evidence-media"
                      />
                    ) : (
                      <img
                        src={mediaUrl(
                          filename
                        )}
                        alt={`Report evidence ${
                          index + 1
                        }`}
                        className="evidence-media"
                      />
                    )}
                  </div>
                )
              )}
            </div>
          )}
        </section>

        <section className="form-card">
          <h3>
            Report Information
          </h3>

          <div className="detail-row">
            <span>
              Report ID
            </span>

            <b>
              #{report.id}
            </b>
          </div>

          <div className="detail-row">
            <span>
              Type
            </span>

            <b>
              {type}
            </b>
          </div>

          <div className="detail-row">
            <span>
              Status
            </span>

            <span
              className={`report-status ${statusClass}`}
            >
              {
                report.status
              }
            </span>
          </div>

          <div className="detail-row">
            <span>
              Location
            </span>

            <b>
              {location}
            </b>
          </div>

          <div className="detail-row">
            <span>
              Reported
            </span>

            <b>
              {createdAt}
            </b>
          </div>

          <div className="detail-row">
            <span>
              Evidence
            </span>

            <b>
              {media.length}
            </b>
          </div>

          <div className="locked">
            Reporter identity is
            kept private for
            safety and
            confidentiality.
          </div>
        </section>
      </div>
    </div>
  );
}