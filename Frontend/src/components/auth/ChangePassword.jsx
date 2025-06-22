import { useState } from "react";
import InputField from "../common/InputField";

const ChangePassword = ({ onBack }) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    const access = localStorage.getItem("access_token");
    try {
      const res = await fetch("/api/users/change-password/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access}`,
        },
        body: JSON.stringify({
          old_password: oldPassword,
          new_password: newPassword,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.detail || "Failed to change password.");
      } else {
        setSuccess("Password changed successfully!");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="login-container">
      <h2 className="form-title">Change Password</h2>
      <form className="login-form" onSubmit={handleSubmit}>
        <InputField
          type="password"
          placeholder="Current password"
          icon="lock"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
        />
        <InputField
          type="password"
          placeholder="New password"
          icon="lock"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <button
          type="submit"
          className="login-button"
          disabled={loading}
          style={{ marginTop: 10 }}
        >
          {loading ? "Changing..." : "Change Password"}
        </button>
        {error && (
          <div className="error-message" style={{ marginTop: 12 }}>
            {error}
          </div>
        )}
        {success && (
          <div
            className="success-message"
            style={{ marginTop: 12, color: "#10b981" }}
          >
            {success}
          </div>
        )}
      </form>
      <div
        className="signup-prompt"
        style={{ textAlign: "center", marginTop: "1.5rem" }}
      >
        <a
          href="#"
          className="signup-link"
          onClick={(e) => {
            e.preventDefault();
            onBack && onBack();
          }}
        >
          Back
        </a>
      </div>
    </div>
  );
};

export default ChangePassword;
