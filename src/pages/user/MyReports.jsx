import { useEffect, useState } from "react";
import ReportCard from "../../components/reports/ReportCard";

export default function MyReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadReports = async () => {
      const token = localStorage.getItem("jiseti_token");

      if (!token) {
        setError("You must be logged in to view your reports.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          "http://127.0.0.1:5000/api/reports",
          {
            method: "GET",

            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 401) {
          localStorage.removeItem("jiseti_token");
          localStorage.removeItem("jiseti_user");

          window.location.href = "/login";
          return;
        }

        if (!response.ok) {
          throw new Error("Failed to load reports.");
        }

        const data = await response.json();

        setReports(data.reports || []);
      } catch (err) {
        console.error(err);
        setError("Unable to load your reports.");
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
        <p>Loading your reports...</p>
      )}

      {error && (
        <p>{error}</p>
      )}

      {!loading &&
        !error &&
        reports.length === 0 && (
          <p>
            You haven't submitted any reports yet.
          </p>
        )}

      {!loading &&
        !error &&
        reports.length > 0 && (
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