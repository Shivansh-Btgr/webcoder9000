import InputField from "../common/InputField";
import Editor from "@monaco-editor/react";
import Select from "react-select";
import { useState } from "react";

const languageOptions = [
  { value: "python", label: "Python" },
  { value: "cpp", label: "C++" },
  { value: "javascript", label: "JavaScript" },
  { value: "java", label: "Java" },
];

const EditFile = ({ file, onBack }) => {
  const [name, setName] = useState(file?.name || "");
  const [language, setLanguage] = useState(languageOptions.find(l => l.value === file?.language) || languageOptions[0]);
  const [content, setContent] = useState(file?.content || "");

  return (
    <div className="login-container" style={{ maxWidth: 900 }}>
      <h2 className="form-title">Edit File</h2>
      <form action="#" className="login-form" onSubmit={e => e.preventDefault()}>
        <InputField
          type="text"
          placeholder="File Name"
          icon="description"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <div style={{ marginBottom: '1rem' }}>
          <Select
            options={languageOptions}
            value={language}
            onChange={setLanguage}
            placeholder="Select Language"
          />
        </div>
        <div style={{ height: 350, marginBottom: '1.5rem' }}>
          <Editor
            height="100%"
            width="100%"
            language={language.value}
            value={content}
            theme="vs-dark"
            onChange={value => setContent(value)}
            options={{ fontSize: 16, minimap: { enabled: false } }}
          />
        </div>
        <button type="submit" className="login-button">Save Changes</button>
      </form>
      <div className="signup-prompt" style={{textAlign: 'center', marginTop: '1.5rem'}}>
        <a href="#" className="signup-link" onClick={e => { e.preventDefault(); onBack && onBack(); }}>Back</a>
      </div>
    </div>
  );
};

export default EditFile;
