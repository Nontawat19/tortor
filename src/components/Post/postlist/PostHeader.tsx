import React from 'react';
import defaultProfile from '@/assets/profile.png';
import '@/styles/postlist/PostHeader.css';
import { formatDistanceToNow } from 'date-fns';
import { th } from 'date-fns/locale'; // ใช้ locale ภาษาไทย

interface UserData {
  fullName: string;
  profileUrl?: string;
}

interface PostHeaderProps {
  user: UserData | undefined;
  createdAt: any;
}

const PostHeader: React.FC<PostHeaderProps> = ({ user, createdAt }) => {
  const getRelativeTime = (timestamp: any) => {
    if (timestamp?.seconds) {
      const date = new Date(timestamp.seconds * 1000);
      return formatDistanceToNow(date, { addSuffix: true, locale: th });
    }
    return 'ไม่ทราบเวลา';
  };

  return (
    <div className="post-header">
      <img
        className="avatar"
        src={user?.profileUrl || defaultProfile}
        alt="avatar"
        onError={(e) => (e.currentTarget.src = defaultProfile)}
      />
      <div className="post-header-info">
        <span className="post-username">{user?.fullName || 'ไม่ทราบชื่อ'}</span>
        <span className="post-time">{getRelativeTime(createdAt)}</span>
      </div>
    </div>
  );
};

export default PostHeader;