import InputField from "../common/InputField";

const CreateProject = ({ onBack }) => {
  return (
    <div className="login-container">
      <h2 className="form-title">Create New Project</h2>
      <form action="#" className="login-form">
        <InputField type="text" placeholder="Project Name" icon="folder" />
        <button type="submit" className="login-button">Create Project</button>
      </form>
      <div className="signup-prompt" style={{textAlign: 'center', marginTop: '1.5rem'}}>
        <a href="#" className="signup-link" onClick={e => { e.preventDefault(); onBack && onBack(); }}>Back</a>
      </div>
    </div>
  );
};

export default CreateProject;
