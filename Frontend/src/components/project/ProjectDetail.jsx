import React from "react";
import FileIcon from "../file/FileIcon";

const ProjectDetail = ({ project, onEdit, onDelete, onViewFiles }) => {
  if (!project) return <div className="dashboard-split-container"><div className="empty-msg">Project not found.</div></div>;
  return (
    <>
      <div className="dashboard-navbar">
        <button className="dashboard-menu-btn" style={{visibility: 'hidden'}}>☰</button>
      </div>
      <div className="dashboard-split-container" style={{flexDirection: 'column', maxWidth: 700}}>
        <div className="project-detail-header-row">
          <h2 className="dashboard-title">{project.name}</h2>
          <div>
            <button className="create-btn" onClick={onEdit} style={{marginRight: '0.7rem'}}>Edit Project</button>
            <button className="delete-btn" onClick={onDelete}>Delete Project</button>
          </div>
        </div>
        <div className="project-detail-info">
          <div><b>Project ID:</b> {project.id}</div>
          <div><b>Name:</b> {project.name}</div>
          <div><b>Created At:</b> {new Date(project.created_at).toLocaleString()}</div>
          <div><b>Last Updated:</b> {new Date(project.updated_at).toLocaleString()}</div>
        </div>
        <div style={{marginTop: '2.5rem'}}>
          <h3 style={{marginBottom: '1rem'}}>Files in this Project</h3>
          <div style={{display: 'flex', gap: '1.5rem', flexWrap: 'wrap', justifyContent: 'center'}}>
            <div className="empty-msg">No files to display.</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProjectDetail;
