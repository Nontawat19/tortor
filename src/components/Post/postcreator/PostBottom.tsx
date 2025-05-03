import React from "react";
import { FaPhotoVideo } from "react-icons/fa";
import "../../../styles/postcreator/PostBottom.css";

interface PostBottomProps {
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handlePost: () => void;
  uploading: boolean;
  canPost: boolean;
}

const PostBottom: React.FC<PostBottomProps> = ({
  handleFileChange,
  handlePost,
  uploading,
  canPost,
}) => {
  return (
    <div className="post-bottom">
      <label className="upload-button-ui">
        <FaPhotoVideo className="upload-icon" size={20} />
        <input
          type="file"
          hidden
          multiple
          accept="image/*,video/*"
          onChange={handleFileChange}
        />
        <span>รูปภาพ/วิดีโอ</span>
      </label>

      <div className="post-button-wrapper">
        <button
          className={`post-button ${canPost ? "can-post" : "cannot-post"}`}
          onClick={handlePost}
          disabled={uploading || !canPost}
        >
          {uploading ? "กำลังโพสต์..." : "โพสต์"}
        </button>
      </div>
    </div>
  );
};

export default PostBottom;
