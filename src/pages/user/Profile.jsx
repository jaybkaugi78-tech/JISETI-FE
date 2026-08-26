import { useEffect, useState } from "react";
import { apiFetch } from "../../services/api";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [reports, setReports] = useState([]);

  const [editing, setEditing] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const [userResponse, reportsResponse] = await Promise.all([
          apiFetch("/api/auth/me"),
          apiFetch("/api/reports"),
        ]);

        const userData = await userResponse.json();
        const reportsData = await reportsResponse.json();

        if (!userResponse.ok) {
          throw new Error(
            userData.error || "Could not load profile."
          );
        }

        if (!reportsResponse.ok) {
          throw new Error(
            reportsData.error || "Could not load reports."
          );
        }

        const currentUser = userData.user;

        setUser(currentUser);
        setUsername(currentUser.username || "");
        setEmail(currentUser.email || "");

        setReports(reportsData.reports || []);
      } catch (err) {
        if (err.message !== "Session expired") {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const startEditing = () => {
    setUsername(user.username || "");
    setEmail(user.email || "");
    setError("");
    setMessage("");
    setChangingPassword(false);
    setEditing(true);
  };

  const cancelEditing = () => {
    setUsername(user.username || "");
    setEmail(user.email || "");
    setError("");
    setEditing(false);
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();

    if (!username.trim() || !email.trim()) {
      setError("Username and email are required.");
      return;
    }

    try {
      setSavingProfile(true);
      setError("");
      setMessage("");

      const response = await apiFetch("/api/auth/me", {
        method: "PATCH",
        body: JSON.stringify({
          username: username.trim(),
          email: email.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Could not update profile."
        );
      }

      setUser(data.user);
      setUsername(data.user.username || "");
      setEmail(data.user.email || "");

      setEditing(false);
      setMessage("Profile updated successfully.");
    } catch (err) {
      if (err.message !== "Session expired") {
        setError(err.message);
      }
    } finally {
      setSavingProfile(false);
    }
  };

  const openPasswordForm = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setError("");
    setMessage("");
    setEditing(false);
    setChangingPassword(true);
  };

  const cancelPasswordChange = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setError("");
    setChangingPassword(false);
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (
      !currentPassword ||
      !newPassword ||
      !confirmPassword
    ) {
      setError("Please fill in all password fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    if (newPassword.length < 8) {
      setError(
        "New password must be at least 8 characters."
      );
      return;
    }

    try {
      setSavingPassword(true);
      setError("");
      setMessage("");

      const response = await apiFetch(
        "/api/auth/change-password",
        {
          method: "PATCH",
          body: JSON.stringify({
            current_password: currentPassword,
            new_password: newPassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Could not change password."
        );
      }

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setChangingPassword(false);

      setMessage("Password changed successfully.");
    } catch (err) {
      if (err.message !== "Session expired") {
        setError(err.message);
      }
    } finally {
      setSavingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="empty">
        Loading profile...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="empty">
        {error || "Could not load profile."}
      </div>
    );
  }

  const countStatus = (status) =>
    reports.filter(
      (report) => report.status === status
    ).length;

  const initial = (
    user.username ||
    user.email ||
    "J"
  )
    .charAt(0)
    .toUpperCase();

  return (
    <div>
      <div className="page-heading">
        <span className="eyebrow">
          ACCOUNT
        </span>

        <h2>Profile</h2>

        <p>
          Manage your account and preferences.
        </p>
      </div>

      {message && (
        <div
          className="form-card"
          style={{ marginBottom: "16px" }}
        >
          <strong>{message}</strong>
        </div>
      )}

      {error && (
        <div
          className="form-card"
          style={{ marginBottom: "16px" }}
        >
          <strong>{error}</strong>
        </div>
      )}

      <div className="profile-hero form-card">
        <div className="big-avatar">
          {initial}
        </div>

        <div>
          <h2>{user.username}</h2>

          <p>{user.email}</p>

          <span className="status status-resolved">
            Active Citizen
          </span>
        </div>

        {!editing && !changingPassword && (
          <button
            type="button"
            className="btn btn-navy"
            onClick={startEditing}
          >
            Edit Profile
          </button>
        )}
      </div>

      {editing && (
        <form
          className="form-card"
          onSubmit={handleProfileSave}
          style={{ marginBottom: "20px" }}
        >
          <h3>Edit Profile</h3>

          <label>
            Username
            <input
              type="text"
              value={username}
              onChange={(e) =>
                setUsername(e.target.value)
              }
              required
            />
          </label>

          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              required
            />
          </label>

          <div
            style={{
              display: "flex",
              gap: "10px",
              marginTop: "15px",
            }}
          >
            <button
              type="submit"
              className="btn btn-navy"
              disabled={savingProfile}
            >
              {savingProfile
                ? "Saving..."
                : "Save Changes"}
            </button>

            <button
              type="button"
              className="btn btn-outline"
              onClick={cancelEditing}
              disabled={savingProfile}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {changingPassword && (
        <form
          className="form-card"
          onSubmit={handlePasswordChange}
          style={{ marginBottom: "20px" }}
        >
          <h3>Change Password</h3>

          <label>
            Current Password
            <input
              type="password"
              value={currentPassword}
              onChange={(e) =>
                setCurrentPassword(e.target.value)
              }
              required
            />
          </label>

          <label>
            New Password
            <input
              type="password"
              value={newPassword}
              onChange={(e) =>
                setNewPassword(e.target.value)
              }
              required
            />
          </label>

          <label>
            Confirm New Password
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(e.target.value)
              }
              required
            />
          </label>

          <div
            style={{
              display: "flex",
              gap: "10px",
              marginTop: "15px",
            }}
          >
            <button
              type="submit"
              className="btn btn-navy"
              disabled={savingPassword}
            >
              {savingPassword
                ? "Changing..."
                : "Change Password"}
            </button>

            <button
              type="button"
              className="btn btn-outline"
              onClick={cancelPasswordChange}
              disabled={savingPassword}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="profile-grid">
        <section className="form-card">
          <h3>Account Information</h3>

          <div className="detail-row">
            <span>Username</span>
            <b>{user.username}</b>
          </div>

          <div className="detail-row">
            <span>Email</span>
            <b>{user.email}</b>
          </div>

          <div className="detail-row">
            <span>Total Reports</span>
            <b>{reports.length}</b>
          </div>
        </section>

        <section className="form-card">
          <h3>Report Activity</h3>

          <div className="detail-row">
            <span>Draft</span>
            <b>{countStatus("DRAFT")}</b>
          </div>

          <div className="detail-row">
            <span>Under Investigation</span>
            <b>
              {countStatus(
                "UNDER INVESTIGATION"
              )}
            </b>
          </div>

          <div className="detail-row">
            <span>Resolved</span>
            <b>{countStatus("RESOLVED")}</b>
          </div>

          <div className="detail-row">
            <span>Rejected</span>
            <b>{countStatus("REJECTED")}</b>
          </div>
        </section>

        <section className="form-card">
          <h3>Security Settings</h3>

          <button
            type="button"
            className="setting"
            onClick={openPasswordForm}
          >
            <b>Change Password</b>
            <span>→</span>
          </button>

          <div className="setting">
            <b>Email Notifications</b>
            <span>→</span>
          </div>

          <div className="setting">
            <b>SMS Notifications</b>
            <span>→</span>
          </div>
        </section>
      </div>
    </div>
  );
}