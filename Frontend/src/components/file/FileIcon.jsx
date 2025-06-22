import React from "react";

const FileIcon = ({ id, filename, language, onClick }) => {
  return (
    <div className="icon-card file-icon" onClick={onClick} style={{ cursor: 'pointer' }}>
      <div className="icon-symbol">📄</div>
      <div className="icon-name">{filename}</div>
      <div className="icon-language">{language}</div>
    </div>
  );
};

export default FileIcon;
