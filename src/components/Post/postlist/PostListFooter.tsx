// ไฟล์ PostListFooter.tsx
import React, { useState, useEffect } from 'react';
import '@/styles/postlist/PostListFooter.css';
import { AiFillHeart, AiOutlineComment } from 'react-icons/ai';
import { BiDoorOpen } from 'react-icons/bi';
import { db } from '@/services/firebase';
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  getDoc,
  query,
  orderBy,
  runTransaction,
} from 'firebase/firestore';
import { formatDistanceToNow } from 'date-fns';
import { th } from 'date-fns/locale';

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

interface Comment {
  id: string;
  text: string;
  user: string;
  profileUrl: string;
  uid: string;
  likes: number;
  createdAt: Date | null;
  replies?: Comment[];
}

interface PostListFooterProps {
  post: Post;
  user: UserData | undefined;
  onCommentClick: () => void;
}

const PostListFooter: React.FC<PostListFooterProps> = ({ post, user, onCommentClick }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes || 0);
  const [likers, setLikers] = useState<string[]>(post.likedBy || []);
  const [likerProfiles, setLikerProfiles] = useState<UserData[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState('');
  const [replyText, setReplyText] = useState('');
  const [replyToId, setReplyToId] = useState<string | null>(null);

  useEffect(() => {
    if (user && post.likedBy) {
      setIsLiked(post.likedBy.includes(user.uid));
      setLikers(post.likedBy);
    }
    setLikesCount(post.likes || 0);
  }, [post, user]);

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

  useEffect(() => {
    const fetchComments = async () => {
      const commentsRef = collection(db, 'posts', post.id, 'comments');
      const q = query(commentsRef, orderBy('createdAt', 'asc'));
      const snapshot = await getDocs(q);
      const fetchedComments: Comment[] = await Promise.all(
        snapshot.docs.map(async (docSnap) => {
          const data = docSnap.data();
          const repliesRef = collection(db, 'posts', post.id, 'comments', docSnap.id, 'replies');
          const repliesSnap = await getDocs(repliesRef);
          const replies: Comment[] = repliesSnap.docs.map((replyDoc) => {
            const replyData = replyDoc.data();
            return {
              id: replyDoc.id,
              text: replyData.text,
              user: replyData.user,
              profileUrl: replyData.profileUrl,
              uid: replyData.uid,
              likes: replyData.likes ?? 0,
              createdAt: replyData.createdAt ? new Date(replyData.createdAt.seconds * 1000) : null,
            };
          });

          return {
            id: docSnap.id,
            text: data.text,
            user: data.user,
            profileUrl: data.profileUrl,
            uid: data.uid,
            likes: data.likes ?? 0,
            createdAt: data.createdAt ? new Date(data.createdAt.seconds * 1000) : null,
            replies,
          };
        })
      );
      setComments(fetchedComments);
    };

    fetchComments();
  }, [post.id]);

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

        const newLikesCount = (postData.likes || 0) + (hasLiked ? -1 : 1);
        const safeLikes = Math.max(0, newLikesCount);

        transaction.update(postRef, {
          likedBy: newLikedBy,
          likes: safeLikes,
        });

        setIsLiked(!hasLiked);
        setLikers(newLikedBy);
        setLikesCount(safeLikes);

        // อัปเดต Avatar เรียลไทม์
        if (!hasLiked) {
          setLikerProfiles((prev) => {
            const exists = prev.some(p => p.uid === user.uid);
            if (!exists && user) {
              const newList = [...prev, user];
              return newList.slice(-3);
            }
            return prev;
          });
        } else {
          setLikerProfiles((prev) => prev.filter(p => p.uid !== user.uid));
        }
      });
    } catch (error) {
      console.error('Error updating likes: ', error);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim() || !user) return;

    try {
      const newComment = {
        text: comment,
        user: user.fullName,
        profileUrl: user.profileUrl || '/default-profile.png',
        uid: user.uid,
        likes: 0,
        createdAt: new Date(),
      };
      const docRef = await addDoc(collection(db, 'posts', post.id, 'comments'), newComment);
      setComments((prev) => [...prev, { id: docRef.id, ...newComment, replies: [] }]);
      setComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleReplySubmit = async (e: React.FormEvent, parentId: string) => {
    e.preventDefault();
    if (!replyText.trim() || !user) return;

    const newReply = {
      text: replyText,
      user: user.fullName,
      profileUrl: user.profileUrl || '/default-profile.png',
      uid: user.uid,
      likes: 0,
      createdAt: new Date(),
    };

    try {
      const repliesRef = collection(db, 'posts', post.id, 'comments', parentId, 'replies');
      const docRef = await addDoc(repliesRef, newReply);
      const replyWithId = { id: docRef.id, ...newReply };
      setComments((prev) =>
        prev.map((comment) =>
          comment.id === parentId
            ? { ...comment, replies: [...(comment.replies || []), replyWithId] }
            : comment
        )
      );
      setReplyText('');
      setReplyToId(null);
    } catch (error) {
      console.error('Error adding reply:', error);
    }
  };

  return (
    <div className="post-list-footer">
      <div className="action-bar">
        <div className="left-actions stacked-actions">
          <div className="action-icons">
            <button className="action-button like-button" onClick={handleLike}>
              <AiFillHeart className={`like-icon ${isLiked ? 'liked' : ''}`} />
            </button>
            <button className="action-button comment-button rounded-full" onClick={() => setShowComments(!showComments)}>
              <AiOutlineComment className="icon" />
            </button>
          </div>
          <div className="likes-display below">
            <div className="liker-avatars">
              {likerProfiles.map((liker, index) => (
                <img
                  key={index}
                  src={liker.profileUrl}
                  alt={liker.fullName}
                  className="liker-avatar"
                />
              ))}
            </div>
            <span className="likes-text">{likesCount} likes</span>
          </div>
        </div>
        <div className="right-actions">
          <button className="action-button">
            <BiDoorOpen className="icon" />
          </button>
        </div>
      </div>

      {showComments && (
        <div className="comments-section">
          {comments.map((comment) => (
            <div key={comment.id} className="comment-item">
              <img src={comment.profileUrl} alt={comment.user} className="comment-avatar" />
              <div className="comment-main">
                <div className="comment-bubble">
                  <div className="comment-header">
                    <span className="comment-user">{comment.user}</span>
                    <span className="comment-time">
                      {comment.createdAt
                        ? formatDistanceToNow(comment.createdAt, { addSuffix: true, locale: th })
                        : 'ไม่ทราบเวลา'}
                    </span>
                  </div>
                  <div className="comment-text">{comment.text}</div>
                  <div className="comment-footer">
                    <button onClick={() => setReplyToId(comment.id)}>💬 ตอบกลับ</button>
                  </div>
                  {comment.replies?.map((reply) => (
                    <div key={reply.id} className="reply-item reverse">
                      <div className="reply-bubble">
                        <div className="reply-text">{reply.text}</div>
                        <div className="reply-profile">{reply.user}</div>
                      </div>
                      <img src={reply.profileUrl} alt={reply.user} className="reply-avatar" />
                    </div>
                  ))}
                  {replyToId === comment.id && (
                    <form onSubmit={(e) => handleReplySubmit(e, comment.id)} className="reply-form">
                      <textarea
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        className="reply-input"
                        placeholder="เขียนข้อความตอบกลับ..."
                      />
                      <button type="submit" className="submit-reply-button">ส่ง</button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="comment-form-container">
        <form className="comment-form" onSubmit={handleCommentSubmit}>
          <textarea
            className="comment-input"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="เขียนความคิดเห็นของคุณ..."
          />
          <button type="submit" className="submit-comment-button">ส่งความคิดเห็น</button>
        </form>
      </div>
    </div>
  );
};

export default PostListFooter;
