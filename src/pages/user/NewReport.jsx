import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import ReportMap from "../../components/reports/ReportMap";
import { apiFetch } from "../../services/api";

export default function NewReport() {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const isEditMode = Boolean(id);

  const [type, setType] = useState("Red-Flag");

  const [form, setForm] = useState({
    title: "",
    description: "",
    location_name: "",
    latitude: -1.286389,
    longitude: 36.817223,
  });

  const [files, setFiles] = useState([]);
  const [existingMedia, setExistingMedia] = useState([]);

  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // =====================================================
  // LOAD EXISTING REPORT WHEN EDITING
  // =====================================================

  useEffect(() => {
    if (!isEditMode) {
      return;
    }

    const loadReport = async () => {
      try {
        setLoading(true);
        setError("");

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

        if (report.status !== "DRAFT") {
          throw new Error(
            "Only DRAFT reports can be edited."
          );
        }

        setType(
          report.type === "INTERVENTION"
            ? "Intervention"
            : "Red-Flag"
        );

        setForm({
          title: report.title || "",
          description: report.description || "",
          location_name: report.location_name || "",
          latitude:
            report.latitude ?? -1.286389,
          longitude:
            report.longitude ?? 36.817223,
        });

        setExistingMedia(
          Array.isArray(report.media)
            ? report.media
            : []
        );
      } catch (err) {
        console.error(err);

        if (err.message !== "Session expired") {
          setError(
            err.message || "Unable to load report."
          );
        }
      } finally {
        setLoading(false);
      }
    };

    loadReport();
  }, [id, isEditMode]);

  // =====================================================
  // FILE SELECTION
  // =====================================================

  const handleFiles = (e) => {
    const selectedFiles = Array.from(
      e.target.files || []
    );

    setFiles(selectedFiles);
  };

  // =====================================================
  // CURRENT LOCATION
  // =====================================================

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError(
        "Geolocation is not supported by your browser."
      );
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
        setError(
          "Unable to get your current location."
        );
      }
    );
  };

  // =====================================================
  // CREATE REPORT
  // =====================================================

  const createReport = async () => {
    const formData = new FormData();

    formData.append(
      "type",
      type === "Red-Flag"
        ? "RED_FLAG"
        : "INTERVENTION"
    );

    formData.append(
      "title",
      form.title.trim()
    );

    formData.append(
      "description",
      form.description.trim()
    );

    formData.append(
      "location_name",
      form.location_name.trim()
    );

    if (form.latitude !== "") {
      formData.append(
        "latitude",
        form.latitude
      );
    }

    if (form.longitude !== "") {
      formData.append(
        "longitude",
        form.longitude
      );
    }

    files.forEach((file) => {
      formData.append(
        "media",
        file
      );
    });

    const response = await apiFetch(
      "/api/reports",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error ||
          "Unable to create report."
      );
    }

    return data.report;
  };

  // =====================================================
  // UPDATE REPORT
  // =====================================================

  const updateReport = async () => {
    const response = await apiFetch(
      `/api/reports/${id}`,
      {
        method: "PUT",

        body: JSON.stringify({
          title: form.title.trim(),

          description:
            form.description.trim(),

          location_name:
            form.location_name.trim(),

          latitude:
            form.latitude === ""
              ? null
              : Number(form.latitude),

          longitude:
            form.longitude === ""
              ? null
              : Number(form.longitude),
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error ||
          "Unable to update report."
      );
    }

    return data.report;
  };

  // =====================================================
  // SUBMIT
  // =====================================================

  const submit = async (e) => {
    e.preventDefault();

    if (
      !form.title.trim() ||
      !form.description.trim()
    ) {
      setError(
        "Title and description are required."
      );
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const report = isEditMode
        ? await updateReport()
        : await createReport();

      if (!report?.id) {
        throw new Error(
          "No report ID was returned."
        );
      }

      navigate(
        `/reports/${report.id}`
      );
    } catch (err) {
      console.error(err);

      if (err.message !== "Session expired") {
        setError(
          err.message ||
            "Something went wrong."
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  // =====================================================
  // MEDIA URL
  // =====================================================

  const mediaUrl = (filename) =>
    `http://127.0.0.1:5000/api/reports/media/${filename}`;

  const isVideo = (filename) =>
    /\.(mp4|webm|mov)$/i.test(filename);

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
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
        <div
          className="form-card"
          style={{
            marginBottom: "16px",
          }}
        >
          {error}
        </div>
      )}

      <div className="new-report-grid">
        <div>
          {/* ========================================= */}
          {/* REPORT TYPE */}
          {/* ========================================= */}

          <section className="form-card">
            <h3>
              1. Select Report Type
            </h3>

            <div className="type-select">
              <button
                type="button"
                className={
                  type === "Red-Flag"
                    ? "selected"
                    : ""
                }
                onClick={() =>
                  setType("Red-Flag")
                }
                disabled={isEditMode}
              >
                <b>⚑</b>

                <span>
                  <strong>
                    Red-Flag
                  </strong>

                  <small>
                    Report corruption,
                    fraud, abuse of power.
                  </small>
                </span>
              </button>

              <button
                type="button"
                className={
                  type === "Intervention"
                    ? "selected"
                    : ""
                }
                onClick={() =>
                  setType(
                    "Intervention"
                  )
                }
                disabled={isEditMode}
              >
                <b>⌂</b>

                <span>
                  <strong>
                    Intervention
                  </strong>

                  <small>
                    Request government
                    action on an issue.
                  </small>
                </span>
              </button>
            </div>

            {isEditMode && (
              <small>
                Report type cannot be
                changed after creation.
              </small>
            )}
          </section>

          {/* ========================================= */}
          {/* DETAILS */}
          {/* ========================================= */}

          <section className="form-card">
            <h3>
              2. Report Details
            </h3>

            <label>
              Title *

              <input
                maxLength="100"
                value={form.title}
                onChange={(e) =>
                  setForm({
                    ...form,
                    title:
                      e.target.value,
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
                value={
                  form.description
                }
                onChange={(e) =>
                  setForm({
                    ...form,
                    description:
                      e.target.value,
                  })
                }
                placeholder="Provide detailed information about the issue..."
                required
              />
            </label>
          </section>

          {/* ========================================= */}
          {/* MEDIA */}
          {/* ========================================= */}

          <section className="form-card">
            <h3>
              3. Supporting Media{" "}
              <small>
                (Optional)
              </small>
            </h3>

            {isEditMode ? (
              <>
                {existingMedia.length ===
                0 ? (
                  <p>
                    No evidence attached
                    to this report.
                  </p>
                ) : (
                  <div className="evidence-grid">
                    {existingMedia.map(
                      (
                        filename,
                        index
                      ) => (
                        <div
                          className="evidence-item"
                          key={`${filename}-${index}`}
                        >
                          {isVideo(
                            filename
                          ) ? (
                            <video
                              className="evidence-media"
                              src={mediaUrl(
                                filename
                              )}
                              controls
                            />
                          ) : (
                            <img
                              className="evidence-media"
                              src={mediaUrl(
                                filename
                              )}
                              alt={`Evidence ${
                                index + 1
                              }`}
                            />
                          )}
                        </div>
                      )
                    )}
                  </div>
                )}

                <p>
                  Existing evidence is
                  kept when editing the
                  report.
                </p>
              </>
            ) : (
              <div className="upload-box">
                <b>◇</b>

                <br />

                <input
                  ref={
                    fileInputRef
                  }
                  type="file"
                  accept="image/*,video/*"
                  multiple
                  onChange={
                    handleFiles
                  }
                  style={{
                    display: "none",
                  }}
                />

                <button
                  type="button"
                  onClick={() =>
                    fileInputRef.current?.click()
                  }
                >
                  Choose Files
                </button>

                <p>
                  Images and videos can
                  be added as evidence.
                </p>

                {files.length >
                  0 && (
                  <div>
                    <strong>
                      {files.length}{" "}
                      file
                      {files.length !==
                      1
                        ? "s"
                        : ""}{" "}
                      selected
                    </strong>

                    {files.map(
                      (
                        file,
                        index
                      ) => (
                        <p
                          key={`${file.name}-${index}`}
                        >
                          {file.name}
                        </p>
                      )
                    )}
                  </div>
                )}
              </div>
            )}
          </section>
        </div>

        {/* ========================================= */}
        {/* LOCATION */}
        {/* ========================================= */}

        <section className="form-card">
          <h3>4. Location</h3>

          <p>
            Pin the location of the
            incident.
          </p>

          <label>
            Area / Location Name

            <input
              type="text"
              value={
                form.location_name
              }
              onChange={(e) =>
                setForm({
                  ...form,
                  location_name:
                    e.target.value,
                })
              }
              placeholder="e.g. Westlands, Nairobi"
            />
          </label>

          <ReportMap
            report={form}
          />

          <div className="coordinate-grid">
            <label>
              Latitude

              <input
                type="number"
                step="any"
                value={
                  form.latitude
                }
                onChange={(e) =>
                  setForm({
                    ...form,
                    latitude:
                      e.target.value,
                  })
                }
              />
            </label>

            <label>
              Longitude

              <input
                type="number"
                step="any"
                value={
                  form.longitude
                }
                onChange={(e) =>
                  setForm({
                    ...form,
                    longitude:
                      e.target.value,
                  })
                }
              />
            </label>
          </div>

          <button
            type="button"
            className="btn btn-outline"
            onClick={
              useCurrentLocation
            }
          >
            ⌖ Use My Current
            Location
          </button>
        </section>
      </div>

      {/* ========================================= */}
      {/* ACTIONS */}
      {/* ========================================= */}

      <div className="form-actions">
        <button
          type="button"
          className="btn btn-outline"
          disabled={submitting}
          onClick={() =>
            isEditMode
              ? navigate(
                  `/reports/${id}`
                )
              : navigate(
                  "/dashboard"
                )
          }
        >
          Cancel
        </button>

        <button
          type="submit"
          className="btn btn-gold"
          disabled={submitting}
        >
          {submitting
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
            Changes are allowed while
            this report remains{" "}
            <b>DRAFT</b>.
          </>
        ) : (
          <>
            Your report will be saved
            as a <b>DRAFT</b>.
          </>
        )}
      </p>
    </form>
  );
}