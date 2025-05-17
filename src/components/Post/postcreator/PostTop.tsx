// ✅ Post Components แปลงจาก CSS เป็น TailwindCSS ครบฟีเจอร์ พร้อม backend logic

// --- PostTop.tsx ---
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import PrivacySelector from "./PrivacySelector";
import defaultProfile from "@/assets/profile.png";

interface PostTopProps {
  text: string;
  setText: (value: string) => void;
  privacy?: string;
  setPrivacy?: (value: string) => void;
}

const PostTop: React.FC<PostTopProps> = ({ text, setText, privacy = "public", setPrivacy }) => {
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const profileUrl = currentUser?.profileUrl;
  const imageSrc = profileUrl && profileUrl !== "" ? profileUrl : defaultProfile;
  const displayName = currentUser?.fullName || "ผู้ใช้ไม่มีชื่อ";

  return (
    <div className="flex flex-col gap-0">
      <div className="flex items-start gap-2 mb-2">
        <img className="w-10 h-10 rounded-full object-cover" src={imageSrc} alt="profile" />
        <div className="flex flex-col items-start gap-0">
          <span className="font-semibold text-sm text-gray-200">{displayName}</span>
          {setPrivacy && privacy && (
            <div className="scale-90 origin-top-left">
              <PrivacySelector value={privacy} onChange={setPrivacy} />
            </div>
          )}
        </div>
      </div>

      <textarea
        className="bg-[#3a3b3c] rounded-xl p-3 text-sm text-gray-200 resize-none w-full min-h-[140px]"
        placeholder="คุณกำลังคิดอะไรอยู่..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
    </div>
  );
};

export default PostTop;
