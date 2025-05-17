import React from "react";
import defaultProfile from "@/assets/profile.png";
import { formatDistanceToNow } from "date-fns";
import { th } from "date-fns/locale";
import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaGlobeAsia,
  FaUserFriends,
  FaLock,
} from "react-icons/fa";

interface UserData {
  fullName: string;
  profileUrl?: string;
}

interface PlatformData {
  platform: string;
  url: string;
}

interface PostHeaderProps {
  user: UserData | undefined;
  createdAt: { seconds: number; nanoseconds: number } | undefined;
  privacy: "public" | "followers" | "private";
  urls?: PlatformData[];
}

const PostHeader: React.FC<PostHeaderProps> = ({ user, createdAt, privacy, urls }) => {
  const getRelativeTime = (timestamp: { seconds: number; nanoseconds?: number } | undefined) => {
    if (timestamp?.seconds) {
      const date = new Date(timestamp.seconds * 1000);
      const result = formatDistanceToNow(date, { addSuffix: true, locale: th });
      return result.replace("ประมาณ ", ""); // 👈 ลบคำว่า "ประมาณ"
    }
    return "ไม่ทราบเวลา";
  };

  const getPrivacyIcon = (privacy: string) => {
    switch (privacy) {
      case "public":
        return <FaGlobeAsia className="w-[14px] h-[14px]" />;
      case "followers":
        return <FaUserFriends className="w-[14px] h-[14px]" />;
      case "private":
        return <FaLock className="w-[14px] h-[14px]" />;
      default:
        return null;
    }
  };

  const getPrivacyLabel = (privacy: string) => {
    switch (privacy) {
      case "public":
        return "สาธารณะ";
      case "followers":
        return "ผู้ติดตาม";
      case "private":
        return "เฉพาะฉัน";
      default:
        return "";
    }
  };

  const renderPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "facebook":
        return <FaFacebookF />;
      case "instagram":
        return <FaInstagram />;
      case "youtube":
        return <FaYoutube />;
      default:
        return null;
    }
  };

  const platformClass = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "facebook":
        return "bg-[#1877f2]";
      case "instagram":
        return "bg-gradient-to-r from-[#feda75] via-[#d62976] to-[#4f5bd5]";
      case "youtube":
        return "bg-[#ff0000]";
      default:
        return "bg-gray-400";
    }
  };

  return (
    <div className="relative">
      <div className="flex items-center gap-3 pr-24">
        <img
          src={user?.profileUrl || defaultProfile}
          alt="avatar"
          className="w-10 h-10 rounded-full object-cover"
          onError={(e) => (e.currentTarget.src = defaultProfile)}
        />
        <div className="flex flex-col">
          <span className="font-bold text-sm text-white">{user?.fullName || "ไม่ทราบชื่อ"}</span>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span>{getRelativeTime(createdAt)}</span>
            <span className="flex items-center gap-1">
              {getPrivacyIcon(privacy)} {getPrivacyLabel(privacy)}
            </span>
          </div>
        </div>
      </div>

      {urls && urls.length > 0 && (
        <div className="absolute top-2 right-2 flex gap-2 z-10 flex-wrap max-w-full overflow-x-auto">
          {urls.map((item, index) => {
            const icon = renderPlatformIcon(item.platform);
            return icon ? (
              <a
                key={index}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-1 px-3 py-1 rounded-full text-white text-xs font-semibold whitespace-nowrap no-underline ${platformClass(
                  item.platform
                )}`}
              >
                <span className="hidden sm:inline">ดูเพิ่มเติมที่</span>
                {icon}
              </a>
            ) : null;
          })}
        </div>
      )}
    </div>
  );
};

export default PostHeader;
