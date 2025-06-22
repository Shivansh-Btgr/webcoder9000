import { useState } from "react";
import InputField from "../common/InputField";

const ForgotPassword = ({ onSwitchToLogin }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch("/api/users/password-reset/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        setError("Failed to send reset email. Please check your email address.");
      } else {
        setSuccess("If this email exists, a password reset link has been sent.");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="login-container">
      <h2 className="form-title">Forgot Password?</h2>
      <p style={{textAlign: 'center', marginBottom: '1.5rem', color: '#888', fontSize: '1rem'}}>Enter your email address and we'll send you a link to reset your password.</p>
      <form className="login-form" onSubmit={handleSubmit}>
        <InputField type="email" placeholder="Email address" icon="mail" value={email} onChange={e => setEmail(e.target.value)} />
        <button type="submit" className="login-button" disabled={loading} style={{marginTop: 10}}>
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
        {error && <div className="error-message" style={{marginTop: 12}}>{error}</div>}
        {success && <div className="success-message" style={{marginTop: 12, color: '#10b981'}}>{success}</div>}
      </form>
      <div className="signup-prompt" style={{textAlign: 'center', marginTop: '1.5rem'}}>
        <span style={{display: 'block', marginBottom: '0.3rem'}}>Remembered your password?</span>
        <a href="#" className="signup-link" onClick={e => { e.preventDefault(); onSwitchToLogin(); }}>Log in</a>
      </div>
    </div>
  );
};

export default ForgotPassword;
