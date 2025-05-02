import React from "react";
import "../../../styles/postcreator/PreviewArea.css";

interface PreviewAreaProps {
  previews: string[];
  files: File[];
}

const PreviewArea: React.FC<PreviewAreaProps> = ({ previews, files }) => {
  return (
    <div className="preview-area">
      {previews.map((src, idx) => (
        <div key={idx} className="preview-item">
          {files[idx]?.type.startsWith("video/") ? (
            <video src={src} controls className="preview-video" />
          ) : (
            <img src={src} alt="preview" className="preview-image" />
          )}
        </div>
      ))}
    </div>
  );
};

export default PreviewArea;