import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

export default function PublicReports() {
  const [reports, setReports] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [filter, setFilter] =
    useState("ALL");

  const [search, setSearch] =
    useState("");

  useEffect(() => {
    const loadReports =
      async () => {
        try {
          setLoading(true);
          setError("");

          const response =
            await fetch(
              "http://127.0.0.1:5000/api/reports/public"
            );

          const data =
            await response.json();

          if (!response.ok) {
            throw new Error(
              data.error ||
                "Unable to load public reports."
            );
          }

          setReports(
            Array.isArray(
              data.reports
            )
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

    loadReports();
  }, []);

  const filteredReports =
    useMemo(() => {
      return reports.filter(
        (report) => {
          const matchesFilter =
            filter === "ALL" ||
            report.status ===
              filter;

          const searchValue =
            search
              .trim()
              .toLowerCase();

          const matchesSearch =
            !searchValue ||
            report.title
              ?.toLowerCase()
              .includes(
                searchValue
              ) ||
            report.description
              ?.toLowerCase()
              .includes(
                searchValue
              ) ||
            report.location_name
              ?.toLowerCase()
              .includes(
                searchValue
              );

          return (
            matchesFilter &&
            matchesSearch
          );
        }
      );
    }, [
      reports,
      filter,
      search,
    ]);

  const getStatusClass =
    (status) => {
      if (
        status === "RESOLVED"
      ) {
        return "resolved";
      }

      return "investigation";
    };

  const getTypeLabel =
    (type) => {
      return (
        type === "RED_FLAG"
          ? "Corruption Report"
          : "Intervention Request"
      );
    };

  return (
    <div className="public-reports-page">
      <div className="public-reports-header">
        <span className="eyebrow">
          COMMUNITY REPORTS
        </span>

        <h1>
          Public Reports
        </h1>

        <p>
          View issues currently being
          investigated or already
          resolved.
        </p>
      </div>

      <div className="public-report-toolbar">
        <div className="public-report-filters">
          <button
            type="button"
            className={
              filter === "ALL"
                ? "public-filter active"
                : "public-filter"
            }
            onClick={() =>
              setFilter(
                "ALL"
              )
            }
          >
            All Reports
          </button>

          <button
            type="button"
            className={
              filter ===
              "UNDER INVESTIGATION"
                ? "public-filter active"
                : "public-filter"
            }
            onClick={() =>
              setFilter(
                "UNDER INVESTIGATION"
              )
            }
          >
            Under Investigation
          </button>

          <button
            type="button"
            className={
              filter === "RESOLVED"
                ? "public-filter active"
                : "public-filter"
            }
            onClick={() =>
              setFilter(
                "RESOLVED"
              )
            }
          >
            Resolved
          </button>
        </div>

        <div className="public-report-search">
          <span>
            ⌕
          </span>

          <input
            type="text"
            value={
              search
            }
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            placeholder="Search reports..."
          />
        </div>
      </div>

      {loading && (
        <div className="empty">
          Loading public reports...
        </div>
      )}

      {error && (
        <div className="form-error">
          {error}
        </div>
      )}

      {!loading &&
        !error && (
          <div className="public-reports-list">
            {filteredReports.length ===
            0 ? (
              <div className="empty">
                No public reports found.
              </div>
            ) : (
              filteredReports.map(
                (report) => (
                  <article
                    key={
                      report.id
                    }
                    className="public-report-card"
                  >
                    <div className="public-report-icon">
                      {report.type ===
                      "RED_FLAG"
                        ? "⚑"
                        : "⌂"}
                    </div>

                    <div className="public-report-main">
                      <h3>
                        {
                          report.title
                        }
                      </h3>

                      <div className="public-report-location">
                        📍{" "}
                        {report.location_name ||
                          "Location not provided"}
                      </div>

                      <p>
                        {
                          report.description
                        }
                      </p>

                      <span
                        className={
                          report.type ===
                          "RED_FLAG"
                            ? "public-report-type corruption"
                            : "public-report-type intervention"
                        }
                      >
                        {getTypeLabel(
                          report.type
                        )}
                      </span>
                    </div>

                    <div className="public-report-side">
                      <span
                        className={`report-status ${getStatusClass(
                          report.status
                        )}`}
                      >
                        {
                          report.status
                        }
                      </span>

                      <Link
                        to={`/public/reports/${report.id}`}
                        className="btn btn-outline"
                      >
                        View Details →
                      </Link>
                    </div>
                  </article>
                )
              )
            )}
          </div>
        )}
    </div>
  );
}