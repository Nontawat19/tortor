import React from 'react';
import defaultProfile from '@/assets/profile.png';
import '@/styles/postlist/PostHeader.css';
import { formatDistanceToNow } from 'date-fns';
import { th } from 'date-fns/locale';

import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaTiktok,
  FaGlobeAsia,
  FaUserFriends,
  FaLock
} from 'react-icons/fa';

interface UserData {
  fullName: string;
  profileUrl?: string;
}

interface PlatformData {
  platform: 'facebook' | 'instagram' | 'youtube' | 'tiktok';
  url: string;
}

interface PostHeaderProps {
  user: UserData | undefined;
  createdAt: { seconds: number; nanoseconds: number } | undefined;
  privacy: 'public' | 'followers' | 'private';
  urls?: PlatformData[];
}

const PostHeader: React.FC<PostHeaderProps> = ({ user, createdAt, privacy, urls }) => {
  const getRelativeTime = (timestamp: any) => {
    if (timestamp?.seconds) {
      const date = new Date(timestamp.seconds * 1000);
      return formatDistanceToNow(date, { addSuffix: true, locale: th });
    }
    return 'ไม่ทราบเวลา';
  };

  const getPrivacyIcon = (privacy: string) => {
    switch (privacy) {
      case 'public': return <FaGlobeAsia />;
      case 'followers': return <FaUserFriends />;
      case 'private': return <FaLock />;
      default: return null;
    }
  };

  const getPrivacyLabel = (privacy: string) => {
    switch (privacy) {
      case 'public': return 'สาธารณะ';
      case 'followers': return 'ผู้ติดตาม';
      case 'private': return 'เฉพาะฉัน';
      default: return '';
    }
  };

  const renderPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'facebook': return <FaFacebookF />;
      case 'instagram': return <FaInstagram />;
      case 'youtube': return <FaYoutube />;
      case 'tiktok': return <FaTiktok />;
      default: return null;
    }
  };

  const getPlatformLabel = (platform: string) => {
    switch (platform) {
      case 'facebook': return 'ดูเพิ่มเติมที่ Facebook';
      case 'instagram': return 'ดูเพิ่มเติมที่ Instagram';
      case 'youtube': return 'ดูเพิ่มเติมที่ YouTube';
      case 'tiktok': return 'ดูเพิ่มเติมที่ TikTok';
      default: return '';
    }
  };

  const isMobile = typeof window !== "undefined" && /iPhone|Android/i.test(navigator.userAgent);

  const getSmartLink = (url: string, platform: string) => {
    if (!isMobile) return url;

    try {
      const u = new URL(url);

      switch (platform) {
        case "facebook":
          // ใช้ universal deep link ของ Facebook
          return `fb://facewebmodal/f?href=${url}`;

        case "instagram":
          // Instagram ใช้ deep link เปิดแอปโดยตรง
          return `instagram://app`;

        case "youtube": {
          // รองรับ watch?v=, shorts/, embed/, youtu.be/
          const videoIdMatch = url.match(/(?:v=|\/)([a-zA-Z0-9_-]{11})/);
          if (videoIdMatch) {
            return `vnd.youtube://${videoIdMatch[1]}`;
          }
          break;
        }

        case "tiktok": {
          const videoIdMatch = url.match(/\/video\/(\d+)/);
          if (videoIdMatch) {
            return `intent://@user/video/${videoIdMatch[1]}#Intent;scheme=https;package=com.zhiliaoapp.musically;end`;
          }
          break;
        }
      }
    } catch (e) {
      return url;
    }

    return url;
  };

  return (
    <div className="post-header-wrapper">
      <div className="post-header">
        <img
          className="avatar"
          src={user?.profileUrl || defaultProfile}
          alt="avatar"
          onError={(e) => (e.currentTarget.src = defaultProfile)}
        />
        <div className="post-header-info">
          <span className="post-username">{user?.fullName || 'ไม่ทราบชื่อ'}</span>
          <div className="post-time-privacy">
            <span className="post-time">{getRelativeTime(createdAt)}</span>
            <span className="post-privacy">
              {getPrivacyIcon(privacy)} {getPrivacyLabel(privacy)}
            </span>
          </div>
        </div>
      </div>

      {urls && urls.length > 0 && (
        <div className="post-platform-icon">
          {urls.map((item, index) => (
            <a
              key={index}
              href={getSmartLink(item.url, item.platform)}
              target="_blank"
              rel="noopener noreferrer"
              className={`platform-icon ${item.platform}`}
              title={item.platform}
            >
              {renderPlatformIcon(item.platform)}
              <span className="platform-label">{getPlatformLabel(item.platform)}</span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default PostHeader;
