import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import PrivacySelector from "./PrivacySelector";
import "@/styles/postcreator/PostTop.css";
import defaultProfile from "@/assets/profile.png";

interface PostTopProps {
  text: string;
  setText: (value: string) => void;
  privacy?: string;
  setPrivacy?: (value: string) => void;
}

const PostTop: React.FC<PostTopProps> = ({
  text,
  setText,
  privacy = "public",
  setPrivacy,
}) => {
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const profileUrl = currentUser?.profileUrl;
  const imageSrc = profileUrl && profileUrl !== "" ? profileUrl : defaultProfile;
  const displayName = currentUser?.fullName || "ผู้ใช้ไม่มีชื่อ";

  return (
    <div className="post-top-wrapper">
      <div className="post-header">
        <img className="avatar" src={imageSrc} alt="profile" />
        <div className="user-block">
          <span className="user-name">{displayName}</span>
          {setPrivacy && (
            <div className="privacy-mini">
              <PrivacySelector value={privacy} onChange={setPrivacy} />
            </div>
          )}
        </div>
      </div>

      <textarea
        className="post-input"
        placeholder="คุณกำลังคิดอะไรอยู่..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
    </div>
  );
};

export default PostTop;
