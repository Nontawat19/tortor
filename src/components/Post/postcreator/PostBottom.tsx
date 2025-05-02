import React from "react";
import "../../../styles/postcreator/PostBottom.css";

interface PostBottomProps {
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handlePost: () => void;
  uploading: boolean;
}

const PostBottom: React.FC<PostBottomProps> = ({
  handleFileChange,
  handlePost,
  uploading,
}) => {
  return (
    <div className="post-bottom">
      <label className="post-option">
        <input
          type="file"
          hidden
          multiple
          accept="image/*,video/*"
          onChange={handleFileChange}
        />
        รูปภาพ/วิดีโอ
      </label>
      <button
        className="post-button"
        onClick={handlePost}
        disabled={uploading}
      >
        {uploading ? "กำลังโพสต์..." : "โพสต์"}
      </button>
    </div>
  );
};

export default PostBottom;