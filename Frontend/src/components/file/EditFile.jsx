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

const EditFile = ({ file, onBack, onSave }) => {
  const [name, setName] = useState(file?.filename || "");
  const [language, setLanguage] = useState(languageOptions.find(l => l.value === file?.language) || languageOptions[0]);
  const [content, setContent] = useState(file?.content || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const access = localStorage.getItem("access_token");
    try {
      const res = await fetch(`/api/files/${file.id}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access}`,
        },
        body: JSON.stringify({
          filename: name,
          content,
          language: language.value,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.detail || "Failed to update file");
        setLoading(false);
        return;
      }
      const updated = await res.json();
      onSave && onSave(updated);
    } catch (err) {
      setError("Network error");
      setLoading(false);
    }
  };

  return (
    <div className="login-container" style={{ maxWidth: 900 }}>
      <h2 className="form-title">Edit File</h2>
      <form action="#" className="login-form" onSubmit={handleSubmit}>
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
        <button type="submit" className="login-button" disabled={loading}>{loading ? "Saving..." : "Save Changes"}</button>
        {error && <div className="error-msg" style={{marginTop:8}}>{error}</div>}
      </form>
      <div className="signup-prompt" style={{textAlign: 'center', marginTop: '1.5rem'}}>
        <a href="#" className="signup-link" onClick={e => { e.preventDefault(); onBack && onBack(); }}>Back</a>
      </div>
    </div>
  );
};

export default EditFile;
