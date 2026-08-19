import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addReport } from "../../features/reports/reportsSlice";
import { useNavigate } from "react-router-dom";
import ReportMap from "../../components/reports/ReportMap";

export default function NewReport() {
  const user = useSelector((s) => s.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [type, setType] = useState("Red-Flag");
  const [form, setForm] = useState({
    title: "",
    description: "",
    latitude: -1.286389,
    longitude: 36.817223,
  });

  const submit = (e) => {
    e.preventDefault();
    const report = {
      id: `JR-${Date.now()}`,
      ...form,
      type,
      status: "DRAFT",
      location: "Nairobi, Kenya",
      createdBy: user.email,
      createdAt: "Just now",
    };
    dispatch(addReport(report));
    navigate(`/reports/${report.id}`);
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
                  <small>Report corruption, fraud, abuse of power.</small>
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
                  <small>Request government action on an issue.</small>
                </span>
              </button>
            </div>
          </section>
          <section className="form-card">
            <h3>2. Report Details</h3>
            <label>
              Title *
              <input
                maxLength="100"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
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
                  setForm({ ...form, description: e.target.value })
                }
                placeholder="Provide detailed information about the issue..."
                required
              />
            </label>
          </section>
          <section className="form-card">
            <h3>
              4. Supporting Media <small>(Optional)</small>
            </h3>
            <div className="upload-box">
              📎
              <br />
              <button type="button">Choose Files</button>
              <p>Images and videos can be added later.</p>
            </div>
          </section>
        </div>
        <section className="form-card">
          <h3>3. Location</h3>
          <p>Pin the location of the incident.</p>
          <ReportMap report={form} />
          <div className="coordinate-grid">
            <label>
              Latitude
              <input
                type="number"
                step="any"
                value={form.latitude}
                onChange={(e) => setForm({ ...form, latitude: e.target.value })}
              />
            </label>
            <label>
              Longitude
              <input
                type="number"
                step="any"
                value={form.longitude}
                onChange={(e) =>
                  setForm({ ...form, longitude: e.target.value })
                }
              />
            </label>
          </div>
          <button type="button" className="btn btn-outline">
            ⌖ Use My Current Location
          </button>
        </section>
      </div>
      <div className="form-actions">
        <button
          type="button"
          className="btn btn-outline"
          onClick={() => navigate("/dashboard")}
        >
          Cancel
        </button>
        <button className="btn btn-gold">Submit Report →</button>
      </div>
      <p className="draft-note">
        Your report will be saved as <b>DRAFT</b>.
      </p>
    </form>
  );
}
