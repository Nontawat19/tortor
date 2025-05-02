import React, { useState, useEffect } from 'react';
import { doc, updateDoc, increment, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '@/services/firebase';
import PostHeader from './PostHeader';
import PostContent from './PostContent';
import '@/styles/postlist/PostItem.css';

interface MediaItem {
  type: 'image' | 'video';
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
}

interface UserData {
  fullName: string;
  profileUrl?: string;
}

interface PostItemProps {
  post: Post;
  user: UserData | undefined;
  openModal: (media: MediaItem[], index: number) => void;
}

const PostItem: React.FC<PostItemProps> = ({ post, user, openModal }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes || 0);

  useEffect(() => {
    if (user && post.likedBy?.includes(user.fullName)) {
      setIsLiked(true);
    }
  }, [user, post.likedBy]);

  const handleLike = async () => {
    if (!user) {
      console.error('User not logged in');
      return;
    }

    const postRef = doc(db, 'posts', post.id);

    try {
      if (isLiked) {
        setIsLiked(false);
        setLikesCount(likesCount - 1);
        await updateDoc(postRef, {
          likes: increment(-1),
          likedBy: arrayRemove(user.fullName),
        });
      } else {
        setIsLiked(true);
        setLikesCount(likesCount + 1);
        await updateDoc(postRef, {
          likes: increment(1),
          likedBy: arrayUnion(user.fullName),
        });
      }
    } catch (error) {
      console.error('Error updating likes:', error);
      setIsLiked(!isLiked);
      setLikesCount(isLiked ? likesCount + 1 : likesCount - 1);
    }
  };

  return (
    <div className="post-item">
      <PostHeader user={user} createdAt={post.createdAt} />
      <PostContent post={post} openModal={openModal} />
      <div className="post-actions">
        <button
          className={`like-button ${isLiked ? 'liked' : ''}`}
          onClick={handleLike}
          aria-label="Like button"
        ></button>
      </div>
      <div className="likes-count">{likesCount} likes</div>
    </div>
  );
};

export default PostItem;