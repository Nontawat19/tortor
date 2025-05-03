import React from "react";
import "../../../styles/postcreator/PreviewArea.css";

interface PreviewAreaProps {
  previews: string[];
  files: File[];
  onRemove: (index: number) => void;
}

const PreviewArea: React.FC<PreviewAreaProps> = ({ previews, files, onRemove }) => {
  return (
    <div className="preview-area">
      {previews.slice(0, 7).map((src, idx) => (
        <div key={idx} className="preview-item">
          <button className="remove-button" onClick={() => onRemove(idx)}>
            ✕
          </button>
          {files[idx]?.type.startsWith("video/") ? (
            <video src={src} controls className="preview-video" />
          ) : (
            <img src={src} alt={`preview-${idx}`} className="preview-image" />
          )}
        </div>
      ))}
      {previews.length > 7 && (
        <div className="preview-item">
          <div className="preview-overlay">
            <img
              src={previews[7]}
              alt="preview-last"
              className="preview-image"
            />
            <div className="overlay-text">+{previews.length - 7}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PreviewArea;