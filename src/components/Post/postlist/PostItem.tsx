import React from 'react';
import PostHeader from './PostHeader';
import PostContent from './PostContent';
import PostListFooter from './PostListFooter';
import '@/styles/postlist/PostItem.css';

interface MediaItem {
  type: 'image' | 'video';
  url: string;
}

interface PlatformData {
  platform: 'facebook' | 'instagram' | 'youtube' | 'tiktok';
  url: string;
}

interface Post {
  id: string;
  userId: string;
  text: string;
  media?: MediaItem[];
  createdAt?: {
    seconds: number;
    nanoseconds: number;
  };
  likes?: number;
  likedBy?: string[];
  privacy: 'public' | 'followers' | 'private';
  urls?: PlatformData[];
}

interface UserData {
  uid: string; // เพิ่มฟิลด์ uid
  fullName: string;
  profileUrl?: string;
}

interface PostItemProps {
  post: Post;
  user: UserData | undefined;             // เจ้าของโพสต์
  currentUser?: UserData | null;          // ✅ อนุญาตให้เป็น null
  openModal: (media: MediaItem[], index: number) => void;
}

const PostItem: React.FC<PostItemProps> = ({ post, user, currentUser, openModal }) => {
  const handleCommentClick = () => {
    console.log('แสดงความคิดเห็นสำหรับโพสต์:', post.id);
  };

  return (
    <div className="post-item">
      <PostHeader
        user={user}
        createdAt={post.createdAt}
        privacy={post.privacy}
        urls={post.urls}
      />
      <PostContent post={post} openModal={openModal} />
      <PostListFooter
        post={post}
        user={currentUser || undefined} // ✅ ป้องกัน null ด้วย fallback
        onCommentClick={handleCommentClick}
      />
    </div>
  );
};

export default PostItem;
