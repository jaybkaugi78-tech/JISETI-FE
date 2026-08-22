import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import NearbyIssuesMap from "../../components/reports/NearbyIssuesMap";

export default function Landing() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load reports that are visible to the public
  useEffect(() => {
    const loadPublicReports = async () => {
      try {
        const response = await fetch(
          "http://127.0.0.1:5000/api/public/reports"
        );

        if (!response.ok) {
          throw new Error("Could not load reports");
        }

        const data = await response.json();

        setReports(data.reports || []);
      } catch (err) {
        console.error(err);
        setError("Unable to load public reports.");
      } finally {
        setLoading(false);
      }
    };

    loadPublicReports();
  }, []);

  return (
    <div className="landing">

      {/* ================= NAVBAR ================= */}

      <header className="landing-nav">
        <div className="brand brand-dark">
          <div className="brand-mark">J</div>

          <div>
            <strong>JISETI</strong>
            <small>Sauti yako, Mabadiliko yetu.</small>
          </div>
        </div>

        <nav>
          <a href="#how">How It Works</a>

          <a href="#reports">Reports</a>

          <a href="#nearby">Issues Near You</a>

          <a href="#about">About Us</a>

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

      {/* ================= HERO ================= */}

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

            <b>MATTERS</b>
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}

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
        ].map(([number, title, description]) => (

          <div
            className="info-card"
            key={number}
          >
            <b>{number}</b>

            <h3>{title}</h3>

            <p>{description}</p>
          </div>

        ))}
      </section>

      {/* ================= PUBLIC REPORTS ================= */}

      <section
        className="public-reports"
        id="reports"
      >

        <div className="section-head">

          <div>
            <span className="eyebrow">
              COMMUNITY REPORTS
            </span>

            <h2>
              Public Reports
            </h2>

            <p>
              View issues currently being investigated
              or already resolved.
            </p>
          </div>

        </div>

        {/* Loading */}

        {loading && (
          <p>
            Loading reports...
          </p>
        )}

        {/* Error */}

        {error && (
          <p>
            {error}
          </p>
        )}

        {/* No reports */}

        {!loading &&
          !error &&
          reports.length === 0 && (

            <p>
              No public reports are available yet.
            </p>

          )}

        {/* Reports */}

        <div className="reports-list">

          {reports.map((report) => (

            <div
              className="report-card"
              key={report.id}
            >

              <div className="report-main">

                <div className="report-title-row">

                  <h3>
                    {report.title}
                  </h3>

                  <span className="status-badge">
                    {report.status?.replaceAll(
                      "_",
                      " "
                    )}
                  </span>

                </div>

                <p className="location">
                  📍{" "}
                  {report.location_name ||
                    "Location unavailable"}
                </p>

                <p>
                  {report.description}
                </p>

                <small>
                  {report.type === "RED_FLAG"
                    ? "Corruption Report"
                    : "Intervention Request"}
                </small>

              </div>

            </div>

          ))}

        </div>

      </section>

      {/* ================= ISSUES NEAR YOU ================= */}

      <section id="nearby">

        <NearbyIssuesMap />

      </section>

      {/* ================= ABOUT ================= */}

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