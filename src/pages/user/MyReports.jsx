import { useEffect, useState } from "react";
import ReportCard from "../../components/reports/ReportCard";
import { apiFetch } from "../../services/api";

export default function MyReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadReports = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await apiFetch("/api/reports");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error || "Unable to load your reports."
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
          YOUR ACTIVITY
        </span>

        <h2>My Reports</h2>

        <p>
          View and track your submitted reports.
        </p>
      </div>

      {loading && (
        <div className="empty">
          Loading your reports...
        </div>
      )}

      {error && (
        <div className="empty">
          {error}
        </div>
      )}

      {!loading && !error && reports.length === 0 && (
        <div className="empty">
          You haven't created any reports yet.
        </div>
      )}

      {!loading && !error && reports.length > 0 && (
        <div className="reports-list">
          {reports.map((report) => (
            <ReportCard
              key={report.id}
              report={report}
            />
          ))}
        </div>
      )}
    </div>
  );
}