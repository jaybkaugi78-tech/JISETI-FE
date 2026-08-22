import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import {
  addReport,
  updateReport,
} from "../../features/reports/reportsSlice";

import { apiFetch } from "../../services/api";
import ReportMap from "../../components/reports/ReportMap";

export default function NewReport() {
  const { id } = useParams();

  const isEditMode = Boolean(id);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [type, setType] = useState("RED_FLAG");

  const [form, setForm] = useState({
    title: "",
    description: "",
    location_name: "",
    latitude: -1.286389,
    longitude: 36.817223,
  });

  const [loading, setLoading] = useState(false);
  const [loadingReport, setLoadingReport] = useState(isEditMode);

  const [searchingLocation, setSearchingLocation] =
    useState(false);

  const [locationLoading, setLocationLoading] =
    useState(false);

  const [error, setError] = useState("");

  // =====================================================
  // LOAD EXISTING REPORT WHEN EDITING
  // =====================================================

  useEffect(() => {
    if (!isEditMode) {
      return;
    }

    const loadReport = async () => {
      setLoadingReport(true);
      setError("");

      try {
        const response = await apiFetch(
          `/api/reports/${id}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error || "Unable to load report."
          );
        }

        const report = data.report;

        // Only drafts can be edited
        if (report.status !== "DRAFT") {
          setError(
            "This report can no longer be edited because it is not a DRAFT."
          );

          return;
        }

        setType(report.type);

        setForm({
          title: report.title || "",
          description: report.description || "",
          location_name: report.location_name || "",
          latitude:
            report.latitude !== null
              ? report.latitude
              : -1.286389,
          longitude:
            report.longitude !== null
              ? report.longitude
              : 36.817223,
        });
      } catch (err) {
        if (err.message !== "Session expired") {
          setError(err.message);
        }
      } finally {
        setLoadingReport(false);
      }
    };

    loadReport();
  }, [id, isEditMode]);

  // =====================================================
  // NORMAL FORM CHANGE
  // =====================================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  // =====================================================
  // SEARCH LOCATION BY NAME
  // =====================================================

  const searchLocation = async () => {
    if (!form.location_name.trim()) {
      setError("Enter a location first.");
      return;
    }

    setError("");
    setSearchingLocation(true);

    try {
      const query = encodeURIComponent(
        form.location_name
      );

      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=1`
      );

      if (!response.ok) {
        throw new Error("Location search failed.");
      }

      const data = await response.json();

      if (!data.length) {
        throw new Error(
          "Location not found. Try a more specific location."
        );
      }

      const place = data[0];

      setForm((current) => ({
        ...current,
        location_name: place.display_name,
        latitude: Number(place.lat),
        longitude: Number(place.lon),
      }));
    } catch (err) {
      console.error(err);

      setError(
        err.message ||
          "Unable to search for that location."
      );
    } finally {
      setSearchingLocation(false);
    }
  };

  // =====================================================
  // USE DEVICE CURRENT LOCATION
  // =====================================================

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError(
        "Your browser does not support location services."
      );

      return;
    }

    setError("");
    setLocationLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const latitude =
          position.coords.latitude;

        const longitude =
          position.coords.longitude;

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );

          const data = await response.json();

          setForm((current) => ({
            ...current,
            latitude,
            longitude,
            location_name:
              data.display_name ||
              "Current location",
          }));
        } catch (err) {
          console.error(err);

          setForm((current) => ({
            ...current,
            latitude,
            longitude,
            location_name:
              current.location_name ||
              "Current location",
          }));
        } finally {
          setLocationLoading(false);
        }
      },

      () => {
        setError(
          "Unable to access your current location."
        );

        setLocationLoading(false);
      },

      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  };

  // =====================================================
  // CREATE OR UPDATE REPORT
  // =====================================================

  const submit = async (event) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const payload = {
        title: form.title,
        description: form.description,
        location_name: form.location_name,
        latitude: Number(form.latitude),
        longitude: Number(form.longitude),
      };

      // Type is required when creating a report.
      if (!isEditMode) {
        payload.type = type;
      }

      const response = await apiFetch(
        isEditMode
          ? `/api/reports/${id}`
          : "/api/reports",
        {
          method: isEditMode ? "PUT" : "POST",
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            `Unable to ${
              isEditMode ? "update" : "create"
            } report.`
        );
      }

      if (isEditMode) {
        dispatch(updateReport(data.report));
      } else {
        dispatch(addReport(data.report));
      }

      navigate(`/reports/${data.report.id}`);
    } catch (err) {
      if (err.message !== "Session expired") {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // LOADING EDIT REPORT
  // =====================================================

  if (loadingReport) {
    return (
      <div className="empty">
        Loading report...
      </div>
    );
  }

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <form onSubmit={submit}>
      <div className="page-heading">
        <span className="eyebrow">
          CITIZEN REPORTING
        </span>

        <h2>
          {isEditMode
            ? "Edit Report"
            : "Create a New Report"}
        </h2>

        <p>
          {isEditMode
            ? "Update your draft report."
            : "Report corruption or request government intervention."}
        </p>
      </div>

      {error && (
        <p className="form-error">
          {error}
        </p>
      )}

      <div className="new-report-grid">
        <div>
          {/* ================= REPORT TYPE ================= */}

          <section className="form-card">
            <h3>1. Select Report Type</h3>

            <div className="type-select">
              <button
                type="button"
                className={
                  type === "RED_FLAG"
                    ? "selected"
                    : ""
                }
                onClick={() =>
                  !isEditMode &&
                  setType("RED_FLAG")
                }
                disabled={isEditMode}
              >
                <b>⚑</b>

                <span>
                  <strong>Red-Flag</strong>

                  <small>
                    Report corruption, fraud, abuse of
                    power.
                  </small>
                </span>
              </button>

              <button
                type="button"
                className={
                  type === "INTERVENTION"
                    ? "selected"
                    : ""
                }
                onClick={() =>
                  !isEditMode &&
                  setType("INTERVENTION")
                }
                disabled={isEditMode}
              >
                <b>⌂</b>

                <span>
                  <strong>Intervention</strong>

                  <small>
                    Request government action on an issue.
                  </small>
                </span>
              </button>
            </div>

            {isEditMode && (
              <small>
                Report type cannot be changed after the
                report is created.
              </small>
            )}
          </section>

          {/* ================= DETAILS ================= */}

          <section className="form-card">
            <h3>2. Report Details</h3>

            <label>
              Title *

              <input
                type="text"
                name="title"
                maxLength="100"
                value={form.title}
                onChange={handleChange}
                placeholder="Enter a short title for your report"
                required
              />
            </label>

            <label>
              Description *

              <textarea
                name="description"
                maxLength="2000"
                value={form.description}
                onChange={handleChange}
                placeholder="Provide detailed information about the issue..."
                required
              />
            </label>
          </section>

          {/* ================= MEDIA ================= */}

          <section className="form-card">
            <h3>
              4. Supporting Media{" "}
              <small>(Optional)</small>
            </h3>

            <div className="upload-box">
              📎
              <br />

              <button type="button">
                Choose Files
              </button>

              <p>
                Images and videos can be added later.
              </p>
            </div>
          </section>
        </div>

        {/* ================= LOCATION ================= */}

        <section className="form-card">
          <h3>3. Location</h3>

          <p>
            Search for the area where the incident
            happened or use your current location.
          </p>

          <label>
            Location name *

            <input
              type="text"
              name="location_name"
              value={form.location_name}
              onChange={handleChange}
              placeholder="e.g. Westlands, Nairobi"
              required
            />
          </label>

          <div className="hero-actions">
            <button
              type="button"
              className="btn btn-navy"
              onClick={searchLocation}
              disabled={searchingLocation}
            >
              {searchingLocation
                ? "Searching..."
                : "🔎 Search Location"}
            </button>

            <button
              type="button"
              className="btn btn-outline"
              onClick={useCurrentLocation}
              disabled={locationLoading}
            >
              {locationLoading
                ? "Getting location..."
                : "📍 Use My Current Location"}
            </button>
          </div>

          <ReportMap report={form} />

          <div className="coordinate-grid">
            <label>
              Latitude

              <input
                type="number"
                step="any"
                value={form.latitude}
                readOnly
              />
            </label>

            <label>
              Longitude

              <input
                type="number"
                step="any"
                value={form.longitude}
                readOnly
              />
            </label>
          </div>

          <small>
            Coordinates are generated automatically for
            map and nearby-report features.
          </small>
        </section>
      </div>

      {/* ================= ACTIONS ================= */}

      <div className="form-actions">
        <button
          type="button"
          className="btn btn-outline"
          onClick={() =>
            isEditMode
              ? navigate(`/reports/${id}`)
              : navigate("/dashboard")
          }
          disabled={loading}
        >
          Cancel
        </button>

        <button
          type="submit"
          className="btn btn-gold"
          disabled={loading || Boolean(error)}
        >
          {loading
            ? isEditMode
              ? "Saving..."
              : "Submitting..."
            : isEditMode
            ? "Save Changes →"
            : "Submit Report →"}
        </button>
      </div>

      <p className="draft-note">
        {isEditMode ? (
          <>
            You can edit this report while it remains{" "}
            <b>DRAFT</b>.
          </>
        ) : (
          <>
            Your report will be saved as{" "}
            <b>DRAFT</b>.
          </>
        )}
      </p>
    </form>
  );
}