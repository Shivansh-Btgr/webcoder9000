import React from "react";
import Editor from "@monaco-editor/react";

const FileDetail = ({ file, onEdit, onDelete, onBack }) => {
  if (!file) return (
    <div className="dashboard-split-container">
      <div className="empty-msg">File not found.</div>
    </div>
  );
  return (
    <>
      <div className="dashboard-navbar">
        <button className="dashboard-menu-btn" style={{visibility: 'hidden'}}>☰</button>
      </div>
      <div className="dashboard-split-container" style={{flexDirection: 'column', maxWidth: 700}}>
        <div className="project-detail-header-row">
          <h2 className="dashboard-title">{file.name}</h2>
          <div>
            <button className="create-btn" onClick={onEdit} style={{marginRight: '0.7rem'}}>Edit File</button>
            <button className="delete-btn" onClick={onDelete}>Delete File</button>
          </div>
        </div>
        <div className="project-detail-info">
          <div><b>File ID:</b> {file.id}</div>
          <div><b>Name:</b> {file.name}</div>
          <div><b>Language:</b> {file.language}</div>
          <div><b>Created At:</b> {new Date(file.created_at).toLocaleString()}</div>
          <div><b>Last Updated:</b> {new Date(file.updated_at).toLocaleString()}</div>
        </div>
        <div style={{margin: '2rem 0'}}>
          <Editor
            height="300px"
            width="100%"
            language={file.language}
            value={file.content || ''}
            theme="vs-dark"
            options={{ readOnly: true, fontSize: 16, minimap: { enabled: false } }}
          />
        </div>
        <div style={{marginTop: '1.5rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem'}}>
          <button
            style={{
              background: '#2563eb', color: '#fff', fontWeight: 600, fontSize: 16, padding: '0.7rem 2.5rem', borderRadius: 6, border: 'none', cursor: 'pointer', width: '100%', maxWidth: 350
            }}
            onClick={() => alert('Run File')}
          >
            Run
          </button>
          <button
            className="view-files-btn"
            style={{width: '100%', maxWidth: 350, fontWeight: 600, fontSize: 16}}
            onClick={onBack}
          >
            Back to Files
          </button>
        </div>
      </div>
    </>
  );
};

export default FileDetail;
