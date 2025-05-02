import React from 'react';
import '@/styles/postlist/PostContent.css';

interface MediaItem {
  type: 'image' | 'video';
  url: string;
}

interface Post {
  id: string;
  text: string;
  media?: MediaItem[];
}

interface PostContentProps {
  post: Post;
  openModal: (media: MediaItem[], index: number) => void;
}

const PostContent: React.FC<PostContentProps> = ({ post, openModal }) => {
  const renderMedia = () => {
    if (!post.media || post.media.length === 0) return null;

    const displayedMedia = post.media.slice(0, 4); // แสดงผลสูงสุด 4 ภาพ
    const remainingCount = post.media.length - 4; // จำนวนภาพที่เหลือ

    return (
      <div
        className={`post-media-grid post-media-grid-${displayedMedia.length}`}
      >
        {displayedMedia.map((item, index) => (
          <div
            key={index}
            className="post-media-wrapper"
            onClick={() => openModal(post.media!, index)}
          >
            {item.type === 'video' ? (
              <video src={item.url} controls />
            ) : (
              <img src={item.url} alt={`media-${index}`} />
            )}
            {index === 3 && remainingCount > 0 && (
              <div className="post-overlay-count">+{remainingCount}</div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="post-content">
      <p>{post.text}</p>
      {renderMedia()}
    </div>
  );
};

export default PostContent;