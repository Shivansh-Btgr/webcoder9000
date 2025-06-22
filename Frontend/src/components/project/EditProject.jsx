import InputField from "../common/InputField";
import { useState } from "react";

const EditProject = ({ project, onBack }) => {
  const [name, setName] = useState(project?.name || "");

  return (
    <div className="login-container">
      <h2 className="form-title">Edit Project</h2>
      <form action="#" className="login-form">
        <InputField
          type="text"
          placeholder="Project Name"
          icon="folder"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <button type="submit" className="login-button">Save Changes</button>
      </form>
      <div className="signup-prompt" style={{textAlign: 'center', marginTop: '1.5rem'}}>
        <a href="#" className="signup-link" onClick={e => { e.preventDefault(); onBack && onBack(); }}>Back</a>
      </div>
    </div>
  );
};

export default EditProject;
