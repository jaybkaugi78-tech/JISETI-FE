import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import StatusBadge from "../../components/common/StatusBadge";
import { apiFetch } from "../../services/api";

export default function AdminDashboard() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const count = (status) =>
    reports.filter((report) => report.status === status).length;

  useEffect(() => {
    const loadReports = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await apiFetch(
          "/api/admin/reports"
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error || "Unable to load admin reports."
          );
        }

        setReports(data.reports || []);
      } catch (err) {
        if (err.message !== "Session expired") {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    loadReports();
  }, []);

  return (
    <div>
      <div className="page-heading">
        <span className="eyebrow">
          ADMINISTRATION
        </span>

        <h2>Admin Dashboard</h2>

        <p>
          Review and manage citizen reports.
        </p>
      </div>

      {/* STATS */}

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

      {/* REPORT TABLE */}

      <section className="form-card">
        <div className="section-head">
          <div>
            <h3>Recent Reports</h3>
            <span>All citizen reports</span>
          </div>
        </div>

        {loading && (
          <p>Loading reports...</p>
        )}

        {error && (
          <p className="form-error">
            {error}
          </p>
        )}

        {!loading &&
          !error &&
          reports.length === 0 && (
            <p>No reports found.</p>
          )}

        {!loading &&
          !error &&
          reports.length > 0 && (
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
                  {reports.map((report) => (
                    <tr key={report.id}>
                      <td>#{report.id}</td>

                      <td>{report.title}</td>

                      <td>
                        {report.type === "RED_FLAG"
                          ? "Red-Flag"
                          : "Intervention"}
                      </td>

                      <td>
                        {report.location_name ||
                          "Not provided"}
                      </td>

                      <td>
                        <StatusBadge
                          status={report.status}
                        />
                      </td>

                      <td>
                        <Link
                          className="view-link"
                          to={`/admin/reports/${report.id}`}
                        >
                          View →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
      </section>
    </div>
  );
}