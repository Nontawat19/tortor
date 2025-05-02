import React from 'react';
import '@/styles/postlist/PostSkeleton.css'; // ปรับการอ้างอิงให้ตรงกับตำแหน่งใหม่

const PostSkeleton: React.FC = () => {
  return (
    <div className="post-skeleton">
      <div className="skeleton-avatar"></div>
      <div className="skeleton-content">
        <div className="skeleton-line skeleton-line-short"></div>
        <div className="skeleton-line skeleton-line-long"></div>
        <div className="skeleton-media"></div>
      </div>
    </div>
  );
};

export default PostSkeleton;