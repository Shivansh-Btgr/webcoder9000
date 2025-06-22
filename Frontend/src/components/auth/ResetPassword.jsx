import { useState } from "react";
import InputField from "../common/InputField";

function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param) || "";
}

const ResetPassword = ({ onBackToLogin }) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const uid = getQueryParam("uid");
  const token = getQueryParam("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!newPassword || !confirmPassword) {
      setError("Please enter and confirm your new password.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/users/password-reset-confirm/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid, token, new_password: newPassword }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.detail || "Failed to reset password.");
      } else {
        setSuccess("Password reset successful! You can now log in.");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="login-container">
      <h2 className="form-title">Reset Password</h2>
      <form className="login-form" onSubmit={handleSubmit}>
        <InputField
          type="password"
          placeholder="New password"
          icon="lock"
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)}
        />
        <InputField
          type="password"
          placeholder="Confirm new password"
          icon="lock"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
        />
        <button type="submit" className="login-button" disabled={loading} style={{marginTop: 10}}>
          {loading ? "Resetting..." : "Reset Password"}
        </button>
        {error && <div className="error-message" style={{marginTop: 12}}>{error}</div>}
        {success && <div className="success-message" style={{marginTop: 12, color: '#10b981'}}>{success}</div>}
      </form>
      <div className="signup-prompt" style={{textAlign: 'center', marginTop: '1.5rem'}}>
        <a href="#" className="signup-link" onClick={e => { e.preventDefault(); onBackToLogin && onBackToLogin(); }}>Back to Login</a>
      </div>
    </div>
  );
};

export default ResetPassword;
