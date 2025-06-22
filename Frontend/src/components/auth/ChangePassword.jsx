import InputField from "../common/InputField";

const ChangePassword = ({ onBack }) => {
  return (
    <div className="login-container">
      <h2 className="form-title">Change Password</h2>
      <form action="#" className="login-form">
        <InputField type="password" placeholder="New Password" icon="lock" />
        <InputField type="password" placeholder="Confirm New Password" icon="lock" />
        <button type="submit" className="login-button">Update Password</button>
      </form>
      <div className="signup-prompt" style={{textAlign: 'center', marginTop: '1.5rem'}}>
        <a href="#" className="signup-link" onClick={e => { e.preventDefault(); onBack && onBack(); }}>Back</a>
      </div>
    </div>
  );
};

export default ChangePassword;
