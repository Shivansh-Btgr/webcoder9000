import React from "react";
import FileIcon from "../file/FileIcon";

const ProjectDetail = ({ project, files, onEdit, onDelete, onBack, onCreateFile, onFileClick }) => {
  if (!project) return <div className="dashboard-split-container"><div className="empty-msg">Project not found.</div></div>;
  // Defensive: parse dates only if present and valid
  let createdAt = project.created_at ? new Date(project.created_at) : null;
  return (
    <>
      <div className="dashboard-navbar">
        <button className="dashboard-menu-btn" onClick={onBack} aria-label="Back">←</button>
      </div>
      <div className="dashboard-split-container" style={{flexDirection: 'column', maxWidth: 700}}>
        <div className="project-detail-header-row">
          <h2 className="dashboard-title">{project.name}</h2>
          <div>
            <button className="create-btn" onClick={onEdit} style={{marginRight: '0.7rem'}}>Edit Project</button>
            <button className="create-btn" onClick={onCreateFile} style={{marginRight: '0.7rem'}}>+ New File</button>
            <button className="delete-btn" onClick={onDelete}>Delete Project</button>
          </div>
        </div>
        <div className="project-detail-info">
          <div><b>Name:</b> {project.name}</div>
          <div><b>Created At:</b> {createdAt ? createdAt.toLocaleString() : "-"}</div>
        </div>
        <div style={{marginTop: '2.5rem'}}>
          <h3 style={{marginBottom: '1rem'}}>Files in this Project</h3>
          <div style={{display: 'flex', gap: '1.5rem', flexWrap: 'wrap', justifyContent: 'center'}}>
            {files && files.length > 0 ? (
              files.map(file => <FileIcon key={file.id} id={file.id} filename={file.filename} language={file.language} onClick={() => onFileClick(file)} />)
            ) : (
              <div className="empty-msg">No files to display.</div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProjectDetail;
