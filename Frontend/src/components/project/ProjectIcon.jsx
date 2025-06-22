import React from "react";

const ProjectIcon = ({ name }) => {
  return (
    <div className="icon-card project-icon">
      <div className="icon-symbol">📁</div>
      <div className="icon-name">{name}</div>
    </div>
  );
};

export default ProjectIcon;
