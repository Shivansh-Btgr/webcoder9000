import { useState } from "react";
import SocialLogin from "../common/SocialLogin";
import InputField from "../common/InputField";

const LoginForm = ({ onSwitchToRegister, onSwitchToForgot, onLoginSuccess }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/users/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (response.ok && data.access) {
        localStorage.setItem("access_token", data.access);
        localStorage.setItem("refresh_token", data.refresh);
        onLoginSuccess && onLoginSuccess(data.access);
      } else {
        setError("user login failed");
      }
    } catch (err) {
      setError("user login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {error && <div className="error-message" style={{ marginBottom: 16 }}>{error}</div>}
      <h2 className="form-title">Log in with</h2>
      <SocialLogin onLogin={onLoginSuccess} />

      <p className="separator"><span>or</span></p>

      <form className="login-form" onSubmit={handleSubmit}>
        <InputField type="text" placeholder="Username" icon="person" value={username} onChange={e => setUsername(e.target.value)} />
        <InputField type="password" placeholder="Password" icon="lock" value={password} onChange={e => setPassword(e.target.value)} />
        <a href="#" className="forgot-password-link" onClick={e => { e.preventDefault(); onSwitchToForgot(); }}>Forgot password?</a>
        <button type="submit" className="login-button" disabled={loading}>{loading ? "Logging in..." : "Log In"}</button>
      </form>

      <p className="signup-prompt">
        Don&apos;t have an account? <a href="#" className="signup-link" onClick={e => { e.preventDefault(); onSwitchToRegister(); }}>Sign up</a>
      </p>
    </div>
  )
}

export default LoginForm;
