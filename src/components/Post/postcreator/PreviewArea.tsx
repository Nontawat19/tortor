import React, { useState, useEffect } from "react";

interface PreviewAreaProps {
  previews: string[];
  files: File[];
  onRemove: (index: number) => void;
}

const PreviewArea: React.FC<PreviewAreaProps> = ({ previews, files, onRemove }) => {
  const [loaded, setLoaded] = useState<boolean[]>([]);

  useEffect(() => {
    setLoaded(Array(previews.length).fill(false));
  }, [previews]);

  const handleImageLoad = (index: number) => {
    setLoaded((prev) => {
      const updated = [...prev];
      updated[index] = true;
      return updated;
    });
  };

  return (
    <div className="flex gap-2 items-center overflow-x-auto whitespace-nowrap">
      {previews.slice(0, 7).map((src, idx) => (
        <div key={idx} className="relative flex-shrink-0 w-[90px] h-[90px] rounded-lg overflow-hidden">
          {/* ปุ่มลบ */}
          <button
            onClick={() => onRemove(idx)}
            className="absolute top-1.5 right-1.5 bg-red-600 hover:bg-red-700 text-white rounded-full w-6 h-6 text-[13.7px] flex items-center justify-center z-50 shadow-md"
          >
            ✕
          </button>

          {/* รูปภาพหรือวิดีโอ */}
          {files[idx]?.type.startsWith("video/") ? (
            <div className="relative w-full h-full">
              <video
                src={src}
                controls
                preload="metadata"
                className="w-full h-full object-cover rounded-lg"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <svg className="w-10 h-10 text-white opacity-80" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6 4l10 6-10 6V4z" />
                </svg>
              </div>
            </div>
          ) : (
            <div className="relative w-full h-full">
              <img
                src={src}
                alt={`preview-${idx}`}
                className={`w-full h-full object-cover transition duration-300 rounded-lg ${
                  loaded[idx] ? "" : "blur-sm"
                }`}
                onLoad={() => handleImageLoad(idx)}
              />
              {!loaded[idx] && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 border-[3px] border-white border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>
          )}
        </div>
      ))}

      {/* ถ้ามีเกิน 7 ไฟล์ */}
      {previews.length > 7 && (
        <div className="relative flex-shrink-0 w-[90px] h-[90px]">
          <img
            src={previews[7]}
            alt="preview-last"
            className="w-full h-full object-cover rounded-lg"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 text-white text-[16px] font-bold flex items-center justify-center rounded-lg">
            +{previews.length - 7}
          </div>
        </div>
      )}
    </div>
  );
};

export default PreviewArea;
