import React from "react";

interface PostTopProps {
  profileUrl: string;
  text: string;
  setText: (value: string) => void;
}

const PostTop: React.FC<PostTopProps> = ({ profileUrl, text, setText }) => {
  return (
    <div className="post-top">
      <img
        src={profileUrl}
        alt="Profile"
        className={`profile-img ${!profileUrl ? "loading" : ""}`}
        onError={(e) => (e.currentTarget.src = defaultProfile)}
      />
      <textarea
        className="post-input"
        placeholder="คุณกำลังคิดอะไรอยู่..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      ></textarea>
    </div>
  );
};

export default PostTop;