import React, { useState } from "react";
import Editor from "@monaco-editor/react";
import Select from "react-select";

const languageOptions = [
  { value: "python", label: "Python" },
  { value: "cpp", label: "C++" },
  { value: "javascript", label: "JavaScript" },
  { value: "java", label: "Java" },
];

const themeOptions = [
  { value: "vs-dark", label: "Dark (vs-dark)" },
  { value: "light", label: "Light" },
  { value: "hc-black", label: "High Contrast Black (hc-black)" },
  { value: "vs", label: "Visual Studio (vs)" },
  { value: "hc-light", label: "High Contrast Light (hc-light)" },
  { value: "solarized-dark", label: "Solarized Dark (if available)" },
];

const CreateFile = ({ onBack, onCreate, projectId }) => {
  const [filename, setFilename] = useState("");
  const [content, setContent] = useState("");
  const [language, setLanguage] = useState(languageOptions[0]);
  const [theme, setTheme] = useState(themeOptions[0]);
  const [output, setOutput] = useState("");
  const [running, setRunning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Dummy run handler (replace with real API call for actual execution)
  const handleRun = () => {
    setRunning(true);
    setOutput("");
    setTimeout(() => {
      setOutput(`Output for ${filename || "file"}.${language.value}\n---\n${content ? content.slice(0, 100) : "(no code)"}`);
      setRunning(false);
    }, 1000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const access = localStorage.getItem("access_token");
    try {
      const res = await fetch("/api/files/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access}`,
        },
        body: JSON.stringify({
          project: projectId,
          filename,
          content,
          language: language.value,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.detail || "Failed to create file");
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
    <div className="login-container" style={{ maxWidth: 900 }}>
      <h2 className="form-title">Create New File</h2>
      <form action="#" className="login-form" onSubmit={handleSubmit}>
        <div className="input-wrapper">
          <input
            type="text"
            placeholder="File Name"
            className="input-field"
            value={filename}
            onChange={e => setFilename(e.target.value)}
            required
          />
          <i className="material-symbols-rounded">description</i>
        </div>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
          <div style={{ flex: 1 }}>
            <Select
              options={languageOptions}
              value={language}
              onChange={setLanguage}
              placeholder="Select Language"
            />
          </div>
          <div style={{ flex: 1 }}>
            <Select
              options={themeOptions}
              value={theme}
              onChange={setTheme}
              placeholder="Select Theme"
            />
          </div>
        </div>
        <div style={{ height: 350, marginBottom: '1.5rem' }}>
          <Editor
            height="100%"
            width="100%"
            language={language.value}
            value={content}
            theme={theme.value}
            onChange={value => setContent(value)}
            options={{ fontSize: 16, minimap: { enabled: false } }}
          />
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div style={{ flex: 1, background: '#18191c', color: '#fff', borderRadius: 6, padding: '0.7rem 1rem', minHeight: 50, fontFamily: 'monospace', fontSize: 15 }}>
            {output || <span style={{ color: '#888' }}>Output will appear here</span>}
          </div>
        </div>
        <button
          type="button"
          className="login-button"
          style={{
            width: '100%',
            marginBottom: 0,
            background: '#2563eb', // blue-600
            color: '#fff',
            display: 'block',
            marginLeft: 'auto',
            marginRight: 'auto',
            fontWeight: 600,
            fontSize: 16
          }}
          onClick={handleRun}
          disabled={running}
        >
          {running ? "Running..." : "Run"}
        </button>
        <button type="submit" className="login-button" disabled={loading}>{loading ? "Creating..." : "Create File"}</button>
        {error && <div className="error-msg" style={{marginTop:8}}>{error}</div>}
      </form>
      <div className="signup-prompt" style={{textAlign: 'center', marginTop: '1.5rem'}}>
        <a href="#" className="signup-link" onClick={e => { e.preventDefault(); onBack && onBack(); }}>Back</a>
      </div>
    </div>
  );
};

export default CreateFile;
