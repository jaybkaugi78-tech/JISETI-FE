import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ReportMap from "../../components/reports/ReportMap";
import { apiFetch } from "../../services/api";

export default function NewReport() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [type, setType] = useState("Red-Flag");

  const [form, setForm] = useState({
    title: "",
    description: "",
    latitude: -1.286389,
    longitude: 36.817223,
  });

  const [files, setFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleFiles = (e) => {
    const selectedFiles = Array.from(e.target.files || []);
    setFiles(selectedFiles);
  };

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    setError("");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setForm((current) => ({
          ...current,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }));
      },
      () => {
        setError("Unable to get your current location.");
      }
    );
  };

  const submit = async (e) => {
    e.preventDefault();

    setSubmitting(true);
    setError("");

    try {
      const formData = new FormData();

      // Backend expects RED_FLAG or INTERVENTION
      formData.append(
        "type",
        type === "Red-Flag" ? "RED_FLAG" : "INTERVENTION"
      );

      formData.append("title", form.title);
      formData.append("description", form.description);

      if (form.latitude !== "") {
        formData.append("latitude", form.latitude);
      }

      if (form.longitude !== "") {
        formData.append("longitude", form.longitude);
      }

      files.forEach((file) => {
        formData.append("media", file);
      });

      const response = await apiFetch("/api/reports", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to create report.");
      }

      const report = data.report;

      if (!report?.id) {
        throw new Error("Report was created but no report ID was returned.");
      }

      navigate(`/reports/${report.id}`);
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={submit}>
      <div className="page-heading">
        <span className="eyebrow">CITIZEN REPORTING</span>
        <h2>Create a New Report</h2>
        <p>Report corruption or request government intervention.</p>
      </div>

      <div className="new-report-grid">
        <div>
          {/* REPORT TYPE */}
          <section className="form-card">
            <h3>1. Select Report Type</h3>

            <div className="type-select">
              <button
                type="button"
                className={type === "Red-Flag" ? "selected" : ""}
                onClick={() => setType("Red-Flag")}
              >
                <b>⚑</b>

                <span>
                  <strong>Red-Flag</strong>
                  <small>
                    Report corruption, fraud, abuse of power.
                  </small>
                </span>
              </button>

              <button
                type="button"
                className={type === "Intervention" ? "selected" : ""}
                onClick={() => setType("Intervention")}
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
          </section>

          {/* REPORT DETAILS */}
          <section className="form-card">
            <h3>2. Report Details</h3>

            <label>
              Title *
              <input
                maxLength="100"
                value={form.title}
                onChange={(e) =>
                  setForm({
                    ...form,
                    title: e.target.value,
                  })
                }
                placeholder="Enter a short title for your report"
                required
              />
            </label>

            <label>
              Description *
              <textarea
                maxLength="2000"
                value={form.description}
                onChange={(e) =>
                  setForm({
                    ...form,
                    description: e.target.value,
                  })
                }
                placeholder="Provide detailed information about the issue..."
                required
              />
            </label>
          </section>

          {/* SUPPORTING MEDIA */}
          <section className="form-card">
            <h3>
              3. Supporting Media <small>(Optional)</small>
            </h3>

            <div className="upload-box">
              <b>◇</b>

              <br />

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                multiple
                onChange={handleFiles}
                style={{ display: "none" }}
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
              >
                Choose Files
              </button>

              <p>Images and videos can be added as evidence.</p>

              {files.length > 0 && (
                <div>
                  <strong>
                    {files.length} file
                    {files.length !== 1 ? "s" : ""} selected
                  </strong>

                  {files.map((file, index) => (
                    <p key={`${file.name}-${index}`}>
                      {file.name}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>

        {/* LOCATION */}
        <section className="form-card">
          <h3>4. Location</h3>

          <p>Pin the location of the incident.</p>

          <ReportMap report={form} />

          <div className="coordinate-grid">
            <label>
              Latitude
              <input
                type="number"
                step="any"
                value={form.latitude}
                onChange={(e) =>
                  setForm({
                    ...form,
                    latitude: e.target.value,
                  })
                }
              />
            </label>

            <label>
              Longitude
              <input
                type="number"
                step="any"
                value={form.longitude}
                onChange={(e) =>
                  setForm({
                    ...form,
                    longitude: e.target.value,
                  })
                }
              />
            </label>
          </div>

          <button
            type="button"
            className="btn btn-outline"
            onClick={useCurrentLocation}
          >
            ⌖ Use My Current Location
          </button>
        </section>
      </div>

      {error && (
        <p style={{ marginTop: "1rem" }}>
          {error}
        </p>
      )}

      <div className="form-actions">
        <button
          type="button"
          className="btn btn-outline"
          onClick={() => navigate("/dashboard")}
          disabled={submitting}
        >
          Cancel
        </button>

        <button
          className="btn btn-gold"
          type="submit"
          disabled={submitting}
        >
          {submitting ? "Submitting..." : "Submit Report →"}
        </button>
      </div>

      <p className="draft-note">
        Your report will be saved as a <b>DRAFT</b>.
      </p>
    </form>
  );
}