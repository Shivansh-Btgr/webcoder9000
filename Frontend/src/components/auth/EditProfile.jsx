import { useState } from "react";
import InputField from "../common/InputField";

const EditProfile = ({ user, onSave, onCancel }) => {
  const [username, setUsername] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");
  const [firstName, setFirstName] = useState(user?.first_name || "");
  const [lastName, setLastName] = useState(user?.last_name || "");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const access = localStorage.getItem("access_token");
      const response = await fetch("/api/users/update/", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access}`,
        },
        body: JSON.stringify({ username, email, first_name: firstName, last_name: lastName }),
      });
      const data = await response.json();
      if (response.ok) {
        setSuccess("Profile updated successfully!");
        alert("Profile updated successfully!");
        onSave && onSave({ username, email, first_name: firstName, last_name: lastName });
      } else {
        setError(typeof data === 'string' ? data : JSON.stringify(data));
      }
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2 className="form-title">Edit Profile</h2>
      <form className="login-form" onSubmit={handleSubmit}>
        <InputField type="text" placeholder="Username" icon="person" value={username} onChange={e => setUsername(e.target.value)} />
        <InputField type="email" placeholder="Email address" icon="mail" value={email} onChange={e => setEmail(e.target.value)} />
        <InputField type="text" placeholder="First Name" icon="person" value={firstName} onChange={e => setFirstName(e.target.value)} />
        <InputField type="text" placeholder="Last Name" icon="person" value={lastName} onChange={e => setLastName(e.target.value)} />
        <button type="submit" className="login-button" disabled={loading}>{loading ? "Saving..." : "Save Changes"}</button>
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
      </form>
      <div className="signup-prompt" style={{textAlign: 'center', marginTop: '1.5rem'}}>
        <a href="#" className="signup-link" onClick={e => { e.preventDefault(); onCancel && onCancel(); }}>Cancel</a>
      </div>
    </div>
  );
};

export default EditProfile;
