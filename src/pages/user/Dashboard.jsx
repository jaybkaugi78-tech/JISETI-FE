import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import ReportCard from "../../components/reports/ReportCard";
import { apiFetch } from "../../services/api";

import {
  setReports,
  setReportsLoading,
  setReportsError,
} from "../../features/reports/reportsSlice";

export default function Dashboard() {
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);

  const {
    items: reports,
    loading,
    error,
  } = useSelector((state) => state.reports);

  useEffect(() => {
    const loadReports = async () => {
      dispatch(setReportsLoading(true));
      dispatch(setReportsError(null));

      try {
        const response = await apiFetch("/api/reports");

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to load reports");
        }

        dispatch(setReports(data.reports));
      } catch (error) {
        if (error.message !== "Session expired") {
          dispatch(setReportsError(error.message));
        }
      } finally {
        dispatch(setReportsLoading(false));
      }
    };

    loadReports();
  }, [dispatch]);

  const visible = reports.slice(0, 3);

  return (
    <div>
      <section className="welcome-banner">
        <div>
          <span className="eyebrow">CITIZEN DASHBOARD</span>

          <h2>
            Welcome back, {user?.username || "Citizen"}!
          </h2>

          <p>
            Your voice matters. Report corruption or request government
            intervention.
          </p>

          <div className="hero-actions">
            <Link to="/reports/new" className="btn btn-navy">
              ⚑ Report Corruption
            </Link>

            <Link to="/reports/new" className="btn btn-gold">
              ⌂ Request Intervention
            </Link>
          </div>
        </div>

        <div className="banner-art"></div>
      </section>

      <div className="section-head">
        <h2>My Reports</h2>

        <Link to="/reports">
          View all →
        </Link>
      </div>

      <div className="reports-list">
        {loading && (
          <p>Loading reports...</p>
        )}

        {error && (
          <p>{error}</p>
        )}

        {!loading && !error && reports.length === 0 && (
          <p>You have not created any reports yet.</p>
        )}

        {!loading &&
          !error &&
          visible.map((report) => (
            <ReportCard
              key={report.id}
              report={report}
            />
          ))}
      </div>

      <section className="how">
        <h2>How Jiseti Works</h2>

        <div className="steps">
          {["Report", "Review", "Action", "Resolution"].map(
            (step, index) => (
              <div className="step" key={step}>
                <b>{index + 1}</b>

                <h3>{step}</h3>

                <p>
                  {
                    [
                      "Submit your report.",
                      "Authorities review it.",
                      "Action is taken.",
                      "The issue is resolved.",
                    ][index]
                  }
                </p>
              </div>
            )
          )}
        </div>
      </section>
    </div>
  );
}