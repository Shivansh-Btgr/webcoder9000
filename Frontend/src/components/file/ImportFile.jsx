import React, { useState } from "react";

const ImportFile = ({ projectId, onBack, onImportSuccess }) => {
  const [shareUUID, setShareUUID] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleImport = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);
    const access = localStorage.getItem("access_token");
    try {
      const res = await fetch(`/api/files/import-shared/?share_uuid=${encodeURIComponent(shareUUID)}&project=${projectId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access}`,
        },
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.detail || "Failed to import file");
        setLoading(false);
        return;
      }
      setSuccess(true);
      setLoading(false);
      onImportSuccess && onImportSuccess();
    } catch (err) {
      setError("Network error");
      setLoading(false);
    }
  };

  return (
    <div className="login-container" style={{ maxWidth: 400 }}>
      <h2 className="form-title">Import Shared File</h2>
      <form className="login-form" onSubmit={handleImport}>
        <label style={{ fontWeight: 600, marginBottom: 8, display: 'block' }}>Share UUID</label>
        <input
          type="text"
          value={shareUUID}
          onChange={e => setShareUUID(e.target.value)}
          placeholder="Enter Share UUID"
          style={{ padding: '0.7rem 1rem', borderRadius: 6, border: '1px solid #d1d5db', fontSize: 16, width: '100%', marginBottom: 16 }}
          required
        />
        <button
          type="submit"
          className="login-button"
          style={{ background: '#2563eb', color: '#fff', fontWeight: 600, fontSize: 16, borderRadius: 6, border: 'none', cursor: 'pointer', width: '100%', marginBottom: 8 }}
          disabled={loading}
        >
          {loading ? "Importing..." : "Import File"}
        </button>
        {error && <div className="error-msg" style={{ marginTop: 8 }}>{error}</div>}
        {success && <div style={{ color: '#10b981', marginTop: 8 }}>File imported successfully!</div>}
      </form>
      <div className="signup-prompt" style={{ textAlign: 'center', marginTop: '1.5rem' }}>
        <a href="#" className="signup-link" onClick={e => { e.preventDefault(); onBack && onBack(); }}>Back</a>
      </div>
    </div>
  );
};

export default ImportFile;
