import React, { useState, useRef, useEffect } from "react";
import ProjectIcon from "../project/ProjectIcon";
import FileIcon from "../file/FileIcon";

const Dashboard = ({ projects = [], files = [], onCreateProject, onCreateFile, onMenu, onLogout, onChangePassword }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  return (
    <>
      <div className="dashboard-navbar">
        <button className="dashboard-menu-btn" onClick={() => setMenuOpen((v) => !v)}>☰</button>
        <div className="dashboard-navbar-options-wrapper" ref={menuRef}>
          {menuOpen && (
            <div className="dashboard-navbar-options">
              <button onClick={onChangePassword} className="dashboard-navbar-option">Change Password</button>
              <button onClick={onLogout} className="dashboard-navbar-option">Logout</button>
            </div>
          )}
        </div>
      </div>
      <div className="dashboard-split-container">
        <div className="dashboard-half dashboard-projects">
          <div className="dashboard-header-row">
            <h2 className="dashboard-title">Your Projects</h2>
            <button className="create-btn" onClick={onCreateProject}>+ New Project</button>
          </div>
          <div className="icon-grid">
            {projects.length === 0 ? (
              <div className="empty-msg">No projects found.</div>
            ) : (
              projects.map(project => (
                <ProjectIcon key={project.id} name={project.name} updatedAt={project.updated_at} />
              ))
            )}
          </div>
        </div>
        <div className="dashboard-half dashboard-files">
          <div className="dashboard-header-row">
            <h2 className="dashboard-title">Your Files</h2>
            <button className="create-btn" onClick={onCreateFile}>+ New File</button>
          </div>
          <div className="icon-grid">
            {files.length === 0 ? (
              <div className="empty-msg">No files found.</div>
            ) : (
              files.map(file => (
                <FileIcon key={file.id} filename={file.filename} language={file.language} />
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
