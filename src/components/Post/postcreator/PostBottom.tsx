import React from "react";
import { FaPhotoVideo } from "react-icons/fa";

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
    <div className="flex justify-between items-center gap-3 mt-3 pt-3 border-t border-[#3e4042] flex-wrap">
      <label className="flex items-center gap-2 bg-[#2d2f31] text-[#e4e6eb] px-4 py-2.5 rounded-xl text-sm font-medium cursor-pointer hover:bg-[#3a3b3c] transition">
        <FaPhotoVideo className="text-[#1877f2]" size={20} />
        <input
          type="file"
          hidden
          multiple
          accept="image/*,video/*"
          onChange={handleFileChange}
        />
        <span>รูปภาพ/วิดีโอ</span>
      </label>

      <div className="flex-grow flex justify-end">
        <button
          onClick={handlePost}
          disabled={uploading || !canPost}
          className={`px-6 py-2.5 rounded-xl font-semibold text-[15px] transition 
            ${
              canPost
                ? "bg-[#1877f2] text-white hover:bg-[#165fc1] cursor-pointer"
                : "bg-[#3a3b3c] text-[#8a8d91] cursor-not-allowed"
            }`}
        >
          {uploading ? "กำลังโพสต์..." : "โพสต์"}
        </button>
      </div>
    </div>
  );
};

export default PostBottom;
