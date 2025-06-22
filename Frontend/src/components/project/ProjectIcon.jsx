import React from "react";

const ProjectIcon = ({ name, updatedAt }) => {
  return (
    <div className="icon-card project-icon">
      <div className="icon-symbol">📁</div>
      <div className="icon-name">{name}</div>
      <div className="icon-updated">{new Date(updatedAt).toLocaleString()}</div>
    </div>
  );
};

export default ProjectIcon;
