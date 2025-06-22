import { useState, useEffect } from "react";
import SocialLogin from "../common/SocialLogin";
import InputField from "../common/InputField";

const RegisterForm = ({ onSwitchToLogin }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        onSwitchToLogin && onSwitchToLogin();
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [success, onSwitchToLogin]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const response = await fetch("/api/users/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password, password2: confirmPassword }),
      });
      const data = await response.json();
      if (response.ok) {
        setSuccess("Registration successful!");
        setUsername(""); setEmail(""); setPassword(""); setConfirmPassword("");
      } else {
        setError("Registration failed: " + (typeof data === 'string' ? data : JSON.stringify(data)));
      }
    } catch (err) {
      setError("Registration failed: Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {error && <div className="error-message" style={{marginBottom: 16}}>{error}</div>}
      {success && <div className="success-message" style={{marginBottom: 16}}>{success}</div>}
      <h2 className="form-title">Sign up with</h2>
      <SocialLogin />

      <p className="separator"><span>or</span></p>

      <form className="login-form" onSubmit={handleSubmit}>
        <InputField type="text" placeholder="Username" icon="person" value={username} onChange={e => setUsername(e.target.value)} />
        <InputField type="email" placeholder="Email address" icon="mail" value={email} onChange={e => setEmail(e.target.value)} />
        <InputField type="password" placeholder="Password" icon="lock" value={password} onChange={e => setPassword(e.target.value)} />
        <InputField type="password" placeholder="Confirm Password" icon="lock" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
        <button type="submit" className="login-button" disabled={loading}>{loading ? "Signing up..." : "Sign Up"}</button>
      </form>

      <p className="signup-prompt">
        Already have an account? <a href="#" className="signup-link" onClick={e => { e.preventDefault(); onSwitchToLogin(); }}>Log in</a>
      </p>
    </div>
  )
}

export default RegisterForm;
