import React from "react";

const ProjectIcon = ({ name, onClick }) => {
  return (
    <div className="icon-card project-icon" onClick={onClick} style={{ cursor: 'pointer' }}>
      <div className="icon-symbol">📁</div>
      <div className="icon-name">{name}</div>
    </div>
  );
};

export default ProjectIcon;
