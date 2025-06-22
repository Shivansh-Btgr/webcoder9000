import React from "react";

const FileIcon = ({ filename, language }) => {
  return (
    <div className="icon-card file-icon">
      <div className="icon-symbol">📄</div>
      <div className="icon-name">{filename}</div>
      <div className="icon-language">{language}</div>
    </div>
  );
};

export default FileIcon;
