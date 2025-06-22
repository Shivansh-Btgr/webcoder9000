import InputField from "../common/InputField";

const ForgotPassword = ({ onSwitchToLogin }) => {
  return (
    <div className="login-container">
      <h2 className="form-title">Forgot Password?</h2>
      <p style={{textAlign: 'center', marginBottom: '1.5rem', color: '#888', fontSize: '1rem'}}>Enter your email address and we'll send you a link to reset your password.</p>
      <form action="#" className="login-form">
        <InputField type="email" placeholder="Email address" icon="mail" />
        <button type="submit" className="login-button">Send Reset Link</button>
      </form>
      <div className="signup-prompt" style={{textAlign: 'center', marginTop: '1.5rem'}}>
        <span style={{display: 'block', marginBottom: '0.3rem'}}>Remembered your password?</span>
        <a href="#" className="signup-link" onClick={e => { e.preventDefault(); onSwitchToLogin(); }}>Log in</a>
      </div>
    </div>
  );
};

export default ForgotPassword;
