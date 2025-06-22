import InputField from "../common/InputField";
import { useState } from "react";

const CreateProject = ({ onBack, onCreate }) => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const access = localStorage.getItem("access_token");
    try {
      const res = await fetch("/api/projects/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access}`,
        },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.detail || "Failed to create project");
        setLoading(false);
        return;
      }
      const created = await res.json();
      onCreate && onCreate(created);
    } catch (err) {
      setError("Network error");
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2 className="form-title">Create New Project</h2>
      <form action="#" className="login-form" onSubmit={handleSubmit}>
        <InputField
          type="text"
          placeholder="Project Name"
          icon="folder"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button type="submit" className="login-button" disabled={loading}>
          {loading ? "Creating..." : "Create Project"}
        </button>
        {error && (
          <div className="error-msg" style={{ marginTop: 8 }}>
            {error}
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

export default CreateProject;
