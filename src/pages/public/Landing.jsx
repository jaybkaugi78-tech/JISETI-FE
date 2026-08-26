import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import NearbyIssuesMap from "../../components/reports/NearbyIssuesMap";

export default function Landing() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadPublicReports = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "http://127.0.0.1:5000/api/reports/public"
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error || "Could not load public reports."
          );
        }

        setReports(
          Array.isArray(data.reports)
            ? data.reports
            : []
        );
      } catch (err) {
        console.error(err);

        setError(
          err.message ||
            "Unable to load public reports."
        );
      } finally {
        setLoading(false);
      }
    };

    loadPublicReports();
  }, []);

  const previewReports = reports.slice(0, 3);

  const getStatusClass = (status) => {
    if (status === "RESOLVED") {
      return "resolved";
    }

    return "investigation";
  };

  return (
    <div className="landing">
      <header className="landing-nav">
        <div className="brand brand-dark">
          <div className="brand-mark">
            J
          </div>

          <div>
            <strong>
              JISETI
            </strong>

            <small>
              Sauti yako, Mabadiliko yetu.
            </small>
          </div>
        </div>

        <nav>
          <a href="#how">
            How It Works
          </a>

          <a href="#reports">
            Reports
          </a>

          <a href="#nearby">
            Issues Near You
          </a>

          <a href="#about">
            About Us
          </a>

          <Link
            to="/login"
            className="btn btn-outline"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="btn btn-gold"
          >
            Sign Up
          </Link>
        </nav>
      </header>

      <section className="hero">
        <div>
          <span className="eyebrow">
            CITIZEN REPORTING PLATFORM
          </span>

          <h1>
            Report corruption.
            <br />

            <span>
              Request intervention.
            </span>
          </h1>

          <p>
            Jiseti empowers citizens to report corruption
            and request government action for a better
            society.
          </p>

          <div className="hero-actions">
            <Link
              to="/login"
              className="btn btn-navy"
            >
              ⚑ Report Corruption
            </Link>

            <Link
              to="/login"
              className="btn btn-gold"
            >
              ⌂ Request Intervention
            </Link>
          </div>
        </div>

        <div className="hero-illustration">
          <div>
            YOUR
            <br />

            VOICE
            <br />

            <b>
              MATTERS
            </b>
          </div>
        </div>
      </section>

      <section
        className="landing-cards"
        id="how"
      >
        {[
          [
            "1",
            "Report",
            "Submit a report about corruption or an issue needing attention.",
          ],
          [
            "2",
            "Review",
            "Relevant authorities review your report.",
          ],
          [
            "3",
            "Action",
            "The issue is investigated and progress is tracked.",
          ],
          [
            "4",
            "Resolution",
            "Resolved issues create a better community.",
          ],
        ].map(
          ([number, title, description]) => (
            <div
              className="info-card"
              key={number}
            >
              <b>
                {number}
              </b>

              <h3>
                {title}
              </h3>

              <p>
                {description}
              </p>
            </div>
          )
        )}
      </section>

      <section
        className="landing-public-reports"
        id="reports"
      >
        <div className="landing-public-head">
          <div>
            <span className="eyebrow">
              COMMUNITY REPORTS
            </span>

            <h2>
              Public Reports
            </h2>

            <p>
              See recent issues being investigated or
              already resolved.
            </p>
          </div>

          <Link
            to="/public/reports"
            className="btn btn-outline"
          >
            View All Reports →
          </Link>
        </div>

        {loading && (
          <div className="empty">
            Loading reports...
          </div>
        )}

        {error && (
          <div className="form-error">
            {error}
          </div>
        )}

        {!loading &&
          !error &&
          previewReports.length === 0 && (
            <div className="empty">
              No public reports are available yet.
            </div>
          )}

        {!loading &&
          !error &&
          previewReports.length > 0 && (
            <div className="landing-report-grid">
              {previewReports.map(
                (report) => (
                  <article
                    key={report.id}
                    className="landing-report-card"
                  >
                    <div className="landing-report-top">
                      <div className="landing-report-icon">
                        {report.type === "RED_FLAG"
                          ? "⚑"
                          : "⌂"}
                      </div>

                      <span
                        className={`report-status ${getStatusClass(
                          report.status
                        )}`}
                      >
                        {report.status}
                      </span>
                    </div>

                    <h3>
                      {report.title}
                    </h3>

                    <p className="landing-report-location">
                      📍{" "}
                      {report.location_name ||
                        "Location not provided"}
                    </p>

                    <p className="landing-report-description">
                      {report.description}
                    </p>

                    <div className="landing-report-footer">
                      <span
                        className={
                          report.type === "RED_FLAG"
                            ? "public-report-type corruption"
                            : "public-report-type intervention"
                        }
                      >
                        {report.type === "RED_FLAG"
                          ? "Corruption Report"
                          : "Intervention Request"}
                      </span>

                      <Link
                        to={`/public/reports/${report.id}`}
                        className="view-link"
                      >
                        View Details →
                      </Link>
                    </div>
                  </article>
                )
              )}
            </div>
          )}

        <div className="landing-report-more">
          <Link
            to="/public/reports"
            className="btn btn-navy"
          >
            View All Public Reports →
          </Link>
        </div>
      </section>

      <section
        id="nearby"
        className="landing-nearby"
      >
        <NearbyIssuesMap />
      </section>

      <section
        id="about"
        className="landing-cards"
      >
        <div className="info-card">
          <span className="eyebrow">
            ABOUT JISETI
          </span>

          <h2>
            Your voice matters.
          </h2>

          <p>
            Jiseti gives citizens a platform to report
            corruption, request government intervention,
            and follow issues affecting their communities.
          </p>
        </div>
      </section>
    </div>
  );
}