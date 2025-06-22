import React from "react";

const FileIcon = ({ name, updatedAt }) => {
  return (
    <div className="icon-card file-icon">
      <div className="icon-symbol">📄</div>
      <div className="icon-name">{name}</div>
      <div className="icon-updated">{new Date(updatedAt).toLocaleString()}</div>
    </div>
  );
};

export default FileIcon;
