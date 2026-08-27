import { API_BASE_URL } from "../../services/api";
import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import imageCompression from "browser-image-compression";

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
    latitude: "",
    longitude: "",
  });

  const [files, setFiles] = useState([]);
  const [existingMedia, setExistingMedia] = useState([]);

  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);

  const [searchingLocation, setSearchingLocation] =
    useState(false);

  const [gettingLocation, setGettingLocation] =
    useState(false);

  const [compressingFiles, setCompressingFiles] =
    useState(false);

  const [error, setError] = useState("");
  const [locationError, setLocationError] = useState("");

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
          latitude: report.latitude ?? "",
          longitude: report.longitude ?? "",
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

  const handleFiles = async (e) => {
    const selectedFiles = Array.from(
      e.target.files || []
    );

    if (selectedFiles.length === 0) {
      setFiles([]);
      return;
    }

    try {
      setCompressingFiles(true);
      setError("");

      const processedFiles = [];

      for (const file of selectedFiles) {
        if (file.type.startsWith("image/")) {
          try {
            const compressedFile =
              await imageCompression(
                file,
                {
                  maxSizeMB: 3,
                  maxWidthOrHeight: 1920,
                  useWebWorker: true,
                  initialQuality: 0.82,
                }
              );

            const finalFile = new File(
              [compressedFile],
              file.name,
              {
                type:
                  compressedFile.type ||
                  file.type,
                lastModified:
                  Date.now(),
              }
            );

            processedFiles.push(
              finalFile
            );

            console.log(
              `Compressed ${file.name}:`,
              {
                beforeMB:
                  (
                    file.size /
                    1024 /
                    1024
                  ).toFixed(2),

                afterMB:
                  (
                    finalFile.size /
                    1024 /
                    1024
                  ).toFixed(2),
              }
            );
          } catch (compressionError) {
            console.error(
              `Compression failed for ${file.name}:`,
              compressionError
            );

            processedFiles.push(
              file
            );
          }
        } else {
          processedFiles.push(
            file
          );
        }
      }

      setFiles(
        processedFiles
      );
    } catch (err) {
      console.error(err);

      setError(
        "Unable to process selected files."
      );
    } finally {
      setCompressingFiles(
        false
      );
    }
  };

  const findLocation = async () => {
    const location =
      form.location_name.trim();

    if (!location) {
      setLocationError(
        "Enter an area or location name first."
      );
      return;
    }

    try {
      setSearchingLocation(true);
      setLocationError("");

      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(
          location
        )}`
      );

      if (!response.ok) {
        throw new Error(
          "Unable to search for location."
        );
      }

      const data =
        await response.json();

      if (!data.length) {
        setLocationError(
          "Location not found. Try a more specific area name."
        );
        return;
      }

      const result = data[0];

      setForm(
        (current) => ({
          ...current,

          location_name:
            result.display_name ||
            location,

          latitude:
            Number(
              result.lat
            ),

          longitude:
            Number(
              result.lon
            ),
        })
      );
    } catch (err) {
      console.error(
        "Location search error:",
        err
      );

      setLocationError(
        err.message ||
          "Unable to find that location."
      );
    } finally {
      setSearchingLocation(
        false
      );
    }
  };

  const reverseGeocode = async (
    latitude,
    longitude
  ) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
      );

      if (!response.ok) {
        return "";
      }

      const data =
        await response.json();

      return (
        data.display_name ||
        ""
      );
    } catch (err) {
      console.error(
        "Reverse geocoding error:",
        err
      );

      return "";
    }
  };

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError(
        "Geolocation is not supported by your browser."
      );

      return;
    }

    setLocationError("");
    setGettingLocation(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const latitude =
          position.coords.latitude;

        const longitude =
          position.coords.longitude;

        const locationName =
          await reverseGeocode(
            latitude,
            longitude
          );

        setForm(
          (current) => ({
            ...current,

            latitude,

            longitude,

            location_name:
              locationName ||
              current.location_name ||
              "Current location",
          })
        );

        setGettingLocation(
          false
        );
      },

      (geoError) => {
        console.error(
          "Geolocation error:",
          geoError
        );

        if (
          geoError.code ===
          geoError.PERMISSION_DENIED
        ) {
          setLocationError(
            "Location permission was denied. Allow location access in your browser and try again."
          );
        } else if (
          geoError.code ===
          geoError.POSITION_UNAVAILABLE
        ) {
          setLocationError(
            "Your current location is unavailable."
          );
        } else if (
          geoError.code ===
          geoError.TIMEOUT
        ) {
          setLocationError(
            "Getting your current location took too long. Try again."
          );
        } else {
          setLocationError(
            "Unable to get your current location."
          );
        }

        setGettingLocation(
          false
        );
      },

      {
        enableHighAccuracy:
          true,

        timeout:
          15000,

        maximumAge:
          0,
      }
    );
  };

  const createReport = async () => {
    const formData =
      new FormData();

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

    formData.append(
      "latitude",
      form.latitude
    );

    formData.append(
      "longitude",
      form.longitude
    );

    files.forEach(
      (file) => {
        formData.append(
          "media",
          file
        );
      }
    );

    const response =
      await apiFetch(
        "/api/reports",
        {
          method:
            "POST",

          body:
            formData,
        }
      );

    const data =
      await response.json();

    if (!response.ok) {
      throw new Error(
        data.error ||
          "Unable to create report."
      );
    }

    return data.report;
  };

  const updateReport = async () => {
    const response =
      await apiFetch(
        `/api/reports/${id}`,
        {
          method:
            "PUT",

          body:
            JSON.stringify({
              title:
                form.title.trim(),

              description:
                form.description.trim(),

              location_name:
                form.location_name.trim(),

              latitude:
                Number(
                  form.latitude
                ),

              longitude:
                Number(
                  form.longitude
                ),
            }),
        }
      );

    const data =
      await response.json();

    if (!response.ok) {
      throw new Error(
        data.error ||
          "Unable to update report."
      );
    }

    return data.report;
  };

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

    if (
      !form.location_name.trim()
    ) {
      setError(
        "Enter a location for the report."
      );

      return;
    }

    if (
      form.latitude === "" ||
      form.longitude === ""
    ) {
      setError(
        "Please click Find Location or Use My Current Location first."
      );

      return;
    }

    if (compressingFiles) {
      setError(
        "Please wait for the selected images to finish compressing."
      );

      return;
    }

    try {
      setSubmitting(
        true
      );

      setError("");

      const report =
        isEditMode
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

      if (
        err.message !==
        "Session expired"
      ) {
        setError(
          err.message ||
            "Something went wrong."
        );
      }
    } finally {
      setSubmitting(
        false
      );
    }
  };

  const mediaUrl =
    (filename) =>
      `${API_BASE_URL}/api/reports/media/${filename}`

  const isVideo =
    (filename) =>
      /\.(mp4|webm|mov)$/i.test(
        filename
      );

  const formatMB = (bytes) =>
    (
      bytes /
      1024 /
      1024
    ).toFixed(2);

  if (loading) {
    return (
      <div className="empty">
        Loading report...
      </div>
    );
  }

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
            marginBottom:
              "16px",
          }}
        >
          {error}
        </div>
      )}

      <div className="new-report-grid">
        <div>
          <section className="form-card">
            <h3>
              1. Select Report Type
            </h3>

            <div className="type-select">
              <button
                type="button"
                className={
                  type ===
                  "Red-Flag"
                    ? "selected"
                    : ""
                }
                onClick={() =>
                  setType(
                    "Red-Flag"
                  )
                }
                disabled={
                  isEditMode
                }
              >
                <b>
                  ⚑
                </b>

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
                  type ===
                  "Intervention"
                    ? "selected"
                    : ""
                }
                onClick={() =>
                  setType(
                    "Intervention"
                  )
                }
                disabled={
                  isEditMode
                }
              >
                <b>
                  ⌂
                </b>

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

          <section className="form-card">
            <h3>
              2. Report Details
            </h3>

            <label>
              Title *

              <input
                maxLength="100"
                value={
                  form.title
                }
                onChange={(e) =>
                  setForm({
                    ...form,

                    title:
                      e.target
                        .value,
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
                      e.target
                        .value,
                  })
                }
                placeholder="Provide detailed information about the issue..."
                required
              />
            </label>
          </section>

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
                                index +
                                1
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
                <b>
                  ◇
                </b>

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
                    display:
                      "none",
                  }}
                />

                <button
                  type="button"
                  onClick={() =>
                    fileInputRef.current?.click()
                  }
                  disabled={
                    compressingFiles
                  }
                >
                  {compressingFiles
                    ? "Compressing Images..."
                    : "Choose Files"}
                </button>

                <p>
                  Images are compressed
                  before upload. Videos
                  are uploaded normally.
                </p>

                {compressingFiles && (
                  <p>
                    Optimizing selected
                    images...
                  </p>
                )}

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
                      ready
                    </strong>

                    {files.map(
                      (
                        file,
                        index
                      ) => (
                        <p
                          key={`${file.name}-${index}`}
                        >
                          {
                            file.name
                          }{" "}
                          (
                          {formatMB(
                            file.size
                          )}{" "}
                          MB)
                        </p>
                      )
                    )}
                  </div>
                )}
              </div>
            )}
          </section>
        </div>

        <section className="form-card">
          <h3>
            4. Location
          </h3>

          <p>
            Search for the location of
            the incident or use your
            current location.
          </p>

          <label>
            Area / Location Name *

            <input
              type="text"
              value={
                form.location_name
              }
              onChange={(e) => {
                setForm(
                  (current) => ({
                    ...current,

                    location_name:
                      e.target
                        .value,

                    latitude:
                      "",

                    longitude:
                      "",
                  })
                );

                setLocationError(
                  ""
                );
              }}
              placeholder="e.g. Ruiru, Kiambu"
              required
            />
          </label>

          <div
            style={{
              display:
                "flex",

              gap:
                "10px",

              flexWrap:
                "wrap",

              marginBottom:
                "15px",
            }}
          >
            <button
              type="button"
              className="btn btn-navy"
              onClick={
                findLocation
              }
              disabled={
                searchingLocation ||
                gettingLocation
              }
            >
              {searchingLocation
                ? "Finding Location..."
                : "🔍 Find Location"}
            </button>

            <button
              type="button"
              className="btn btn-outline"
              onClick={
                useCurrentLocation
              }
              disabled={
                searchingLocation ||
                gettingLocation
              }
            >
              {gettingLocation
                ? "Getting Location..."
                : "⌖ Use My Current Location"}
            </button>
          </div>

          {locationError && (
            <p className="form-error">
              {locationError}
            </p>
          )}

          <ReportMap
            report={form}
          />

          <div className="coordinate-grid">
            <label>
              Latitude

              <input
                type="text"
                value={
                  form.latitude
                }
                readOnly
                placeholder="Select a location"
              />
            </label>

            <label>
              Longitude

              <input
                type="text"
                value={
                  form.longitude
                }
                readOnly
                placeholder="Select a location"
              />
            </label>
          </div>

          <small>
            Coordinates are generated
            automatically when you
            confirm a location.
          </small>
        </section>
      </div>

      <div className="form-actions">
        <button
          type="button"
          className="btn btn-outline"
          disabled={
            submitting
          }
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
          disabled={
            submitting ||
            searchingLocation ||
            gettingLocation ||
            compressingFiles
          }
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
            <b>
              DRAFT
            </b>.
          </>
        ) : (
          <>
            Your report will be saved
            as a{" "}
            <b>
              DRAFT
            </b>.
          </>
        )}
      </p>
    </form>
  );
}