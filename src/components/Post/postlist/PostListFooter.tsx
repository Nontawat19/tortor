import React, { useState, useEffect } from 'react';
import { BiDoorOpen } from 'react-icons/bi';
import { db } from '@/services/firebase';
import {
  doc,
  getDoc,
  runTransaction,
  onSnapshot,
} from 'firebase/firestore';

import LikeButton from './PostListFooter/LikeButton';
import LikerAvatars from './PostListFooter/LikerAvatars';
import CommentToggle from './PostListFooter/CommentToggle';
import CommentSection from './PostListFooter/CommentSection';
import CommentInput from './PostListFooter/CommentInput';

interface Post {
  id: string;
  likes?: number;
  likedBy?: string[];
}

interface UserData {
  uid: string;
  fullName: string;
  profileUrl?: string;
}

interface PostListFooterProps {
  post: Post;
  user: UserData | undefined;
  onCommentClick: () => void;
}

const PostListFooter: React.FC<PostListFooterProps> = ({ post, user }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes || 0);
  const [likers, setLikers] = useState<string[]>(post.likedBy || []);
  const [likerProfiles, setLikerProfiles] = useState<UserData[]>([]);
  const [showComments, setShowComments] = useState(false);

  useEffect(() => {
    const postRef = doc(db, 'posts', post.id);
    const unsub = onSnapshot(postRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        const updatedLikers: string[] = data.likedBy || [];
        setLikers(updatedLikers);
        setLikesCount(data.likes || 0);
        if (user) {
          setIsLiked(updatedLikers.includes(user.uid));
        }
      }
    });

    return () => unsub();
  }, [post.id, user]);

  useEffect(() => {
    const fetchLikerProfiles = async () => {
      const latestLikers = likers.slice(-3);
      const userDocs = await Promise.all(
        latestLikers.map(async (uid) => {
          const userDoc = await getDoc(doc(db, 'users', uid));
          return userDoc.exists() ? (userDoc.data() as UserData) : null;
        })
      );
      setLikerProfiles(userDocs.filter(Boolean) as UserData[]);
    };

    fetchLikerProfiles();
  }, [likers]);

  const handleLike = async () => {
    if (!user) return;
    const postRef = doc(db, 'posts', post.id);

    try {
      await runTransaction(db, async (transaction) => {
        const postSnapshot = await transaction.get(postRef);
        if (!postSnapshot.exists()) return;

        const postData = postSnapshot.data();
        const likedBy: string[] = postData.likedBy || [];
        const hasLiked = likedBy.includes(user.uid);

        const newLikedBy = hasLiked
          ? likedBy.filter((uid) => uid !== user.uid)
          : [...likedBy, user.uid];

        const rawLikes = (postData.likes || 0) + (hasLiked ? -1 : 1);
        const safeLikes = Math.max(0, rawLikes);

        transaction.update(postRef, {
          likedBy: newLikedBy,
          likes: safeLikes,
        });
      });
    } catch (error) {
      console.error('Error updating likes: ', error);
    }
  };

  return (
    <div className="px-4 pt-2 pb-4 text-white">
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-1">
          <div className="flex gap-4">
            <LikeButton isLiked={isLiked} onLike={handleLike} />
            <CommentToggle onToggle={() => setShowComments(!showComments)} />
          </div>
          <LikerAvatars likerProfiles={likerProfiles} likesCount={likesCount} />
        </div>

        <div className="flex items-center">
          <button className="bg-transparent border-none cursor-pointer p-1 relative">
            <BiDoorOpen className="text-white text-[25px]" />
          </button>
        </div>
      </div>

      {showComments && (
        <>
          {user && <CommentInput postId={post.id} user={user} />}
          <CommentSection postId={post.id} />
        </>
      )}
    </div>
  );
};

export default PostListFooter;
