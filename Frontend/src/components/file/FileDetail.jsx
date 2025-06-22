import React, { useState } from "react";
import InputField from "../common/InputField";
import Editor from "@monaco-editor/react";
import Select from "react-select";

const languageOptions = [
  { value: "python", label: "Python" },
  { value: "cpp", label: "C++" },
  { value: "javascript", label: "JavaScript" },
  { value: "java", label: "Java" },
];

const FileDetail = ({ file, onBack, onSave, onEdit, onDelete }) => {
  const [name, setName] = useState(file?.filename || file?.name || "");
  const [language, setLanguage] = useState(languageOptions.find(l => l.value === (file?.language || file?.language)) || languageOptions[0]);
  const [content, setContent] = useState(file?.content || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [customInput, setCustomInput] = useState("");
  const [editorTheme, setEditorTheme] = useState("vs-dark");
  const [output, setOutput] = useState("");
  const [runInput, setRunInput] = useState("");
  const themes = [
    { value: "vs-dark", label: "Dark" },
    { value: "vs-light", label: "Light" },
    { value: "hc-black", label: "High Contrast Black" },
    { value: "hc-light", label: "High Contrast Light" },
  ];

  return (
    <div className="login-container" style={{ maxWidth: 900 }}>
      <h2 className="form-title">File Details</h2>
      <div className="project-detail-header-row" style={{marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <div style={{fontWeight: 600, fontSize: 18}}>{name}</div>
        <div>
          {onDelete && <button className="delete-btn" onClick={onDelete}>Delete File</button>}
        </div>
      </div>
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
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
            <select value={editorTheme} onChange={e => setEditorTheme(e.target.value)} style={{ padding: '0.3rem 0.7rem', borderRadius: 5, fontSize: 15 }}>
              {themes.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
          <Editor
            height="100%"
            width="100%"
            language={language.value}
            value={content}
            theme={editorTheme}
            onChange={value => setContent(value)}
            options={{ fontSize: 16, minimap: { enabled: false } }}
          />
        </div>
        <div style={{marginBottom: 0, width: '100%', display: 'flex', flexDirection: 'column'}}>
          <label style={{fontWeight: 600, color: '#fff', marginBottom: 4}}>Input for Run</label>
          <input
            type="text"
            value={runInput}
            onChange={e => setRunInput(e.target.value)}
            placeholder="Enter input for code execution (stdin)"
            style={{padding: '0.5rem 1rem', borderRadius: 6, border: '1px solid #333', fontSize: 15, background: '#23272f', color: '#fff', marginBottom: 0}}
          />
        </div>
        <button
          type="button"
          className="login-button"
          style={{marginTop: 16, marginBottom: 0, background: '#2563eb', color: '#fff', fontWeight: 600, fontSize: 16, borderRadius: 6, border: 'none', cursor: 'pointer', width: '100%'}}
          onClick={async () => {
            setLoading(true);
            setOutput("");
            setError("");
            const access = localStorage.getItem("access_token");
            try {
              const res = await fetch("/api/execute/", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${access}`,
                },
                body: JSON.stringify({
                  code: content,
                  language: language.value,
                  input: runInput,
                }),
              });
              if (!res.ok) {
                setOutput("Failed to execute file.");
                setLoading(false);
                return;
              }
              const data = await res.json();
              let formatted = "";
              if (data.stdout) formatted += `Stdout:\n${data.stdout}`;
              if (data.stderr) formatted += `\nStderr:\n${data.stderr}`;
              if (typeof data.exit_code !== 'undefined') formatted += `\nExit Code: ${data.exit_code}`;
              setOutput(formatted.trim() || JSON.stringify(data));
              setLoading(false);
            } catch (err) {
              setOutput("Network error");
              setLoading(false);
            }
          }}
        >
          Run
        </button>
        <div style={{ width: '100%', background: '#18191c', color: '#fff', borderRadius: 6, padding: '0.7rem 1rem', minHeight: 50, fontFamily: 'monospace', fontSize: 15, marginTop: 16, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
          {output ? output.split('\n').map((line, idx) => (
            <React.Fragment key={idx}>
              {line}
              {idx !== output.split('\n').length - 1 && <br />}
            </React.Fragment>
          )) : <span style={{ color: '#888' }}>Output will appear here</span>}
        </div>
        <button
          type="button"
          className="login-button"
          style={{marginTop: 24, background: '#10b981', color: '#fff', fontWeight: 600, fontSize: 16, borderRadius: 6, border: 'none', cursor: 'pointer', width: '100%'}}
          onClick={async () => {
            setLoading(true);
            setError("");
            const access = localStorage.getItem("access_token");
            try {
              const res = await fetch(`/api/files/${file.id}/`, {
                method: "PATCH",
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
              setLoading(false);
              setError("");
              alert("File saved successfully!");
            } catch (err) {
              setError("Network error");
              setLoading(false);
            }
          }}
        >
          {loading ? "Saving..." : "Save"}
        </button>
        {error && <div className="error-msg" style={{marginTop:8}}>{error}</div>}
      </form>
      <div className="signup-prompt" style={{textAlign: 'center', marginTop: '1.5rem'}}>
        <a href="#" className="signup-link" onClick={e => { e.preventDefault(); onBack && onBack(); }}>Back</a>
      </div>
    </div>
  );
};

export default FileDetail;
