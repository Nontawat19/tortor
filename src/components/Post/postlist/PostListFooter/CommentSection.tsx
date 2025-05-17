import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { AiFillHeart } from 'react-icons/ai';
import { formatDistanceToNowStrict } from 'date-fns';
import { th } from 'date-fns/locale';
import { firestore } from '@/firebase';
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  doc,
  arrayUnion,
  arrayRemove,
  increment,
} from 'firebase/firestore';
import CommentInput from './CommentInput';

interface Comment {
  id: string;
  text: string;
  user: string;
  profileUrl: string;
  uid: string;
  likes: number;
  liked?: boolean;
  likedBy?: string[];
  parentId: string | null;
  createdAt: Date | null;
  imageUrl?: string;
  children?: Comment[];
}

interface CommentSectionProps {
  postId: string;
}

const MAX_DEPTH = 2;
const INITIAL_VISIBLE_COMMENTS = 5;
const COMMENTS_INCREMENT = 5;

const CommentSection: React.FC<CommentSectionProps> = ({ postId }) => {
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const [commentTree, setCommentTree] = useState<Comment[]>([]);
  const [flatAllComments, setFlatAllComments] = useState<Comment[]>([]);
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COMMENTS);
  const [loading, setLoading] = useState(true);
  const [collapsedMap, setCollapsedMap] = useState<Record<string, boolean>>({});
  const [visibleRepliesMap, setVisibleRepliesMap] = useState<Record<string, number>>({});
  const [replyToId, setReplyToId] = useState<string | null>(null);
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const commentsRef = collection(firestore, 'posts', postId, 'comments');
    const q = query(commentsRef, orderBy('createdAt', 'asc'));

    setLoading(true);
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const flatComments: Comment[] = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        const likedBy = data.likedBy ?? [];
        return {
          id: docSnap.id,
          text: data.text,
          user: data.user,
          profileUrl: data.profileUrl,
          uid: data.uid,
          likes: data.likes ?? 0,
          likedBy,
          liked: currentUser ? likedBy.includes(currentUser.uid) : false,
          parentId: data.parentId || null,
          createdAt: data.createdAt?.toDate() || null,
          imageUrl: data.imageUrl || null,
        };
      });

      setFlatAllComments(flatComments);
      const tree = buildCommentTree(flatComments);
      setCommentTree(tree);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [postId, currentUser]);

  const buildCommentTree = (flat: Comment[]): Comment[] => {
    const map: Record<string, Comment & { children: Comment[] }> = {};
    const roots: Comment[] = [];

    flat.forEach((c) => {
      map[c.id] = { ...c, children: [] };
    });

    flat.forEach((c) => {
      if (c.parentId) {
        map[c.parentId]?.children.push(map[c.id]);
      } else {
        roots.push(map[c.id]);
      }
    });

    return roots;
  };

  const toggleLike = async (commentId: string, liked: boolean) => {
    if (!currentUser) {
      alert('คุณต้องเข้าสู่ระบบเพื่อกดไลค์');
      return;
    }

    const ref = doc(firestore, 'posts', postId, 'comments', commentId);
    await updateDoc(ref, {
      likes: increment(liked ? 1 : -1),
      likedBy: liked ? arrayUnion(currentUser.uid) : arrayRemove(currentUser.uid),
    });
  };

  const toggleExpandComment = (id: string) => {
    setExpandedComments((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const renderComment = (comment: Comment, depth = 0): React.ReactNode => {
    const isRootComment = comment.parentId === null;
    const isCollapsed = collapsedMap[comment.id] ?? true;
    const visibleReplies = visibleRepliesMap[comment.id] || COMMENTS_INCREMENT;

    if (isRootComment) {
      const index = flatAllComments.filter(c => c.parentId === null).findIndex(c => c.id === comment.id);
      if (index >= visibleCount) return null;
    }

    return (
      <div
        key={comment.id}
        className={`flex items-start gap-2 pt-1 ${depth > 0 ? 'border-l border-gray-700 pl-3 ml-4' : ''}`}
      >
        <img
          src={comment.profileUrl}
          alt={comment.user}
          className="w-7 h-7 rounded-full object-cover shrink-0"
        />
        <div className="flex-1">
          <div className="flex flex-col gap-1 text-gray-300 text-sm">
            <span className="font-semibold text-white">{comment.user}</span>
            {comment.createdAt && (
              <span className="text-xs text-gray-500">
                {formatDistanceToNowStrict(comment.createdAt, { addSuffix: true, locale: th })}
              </span>
            )}
            <div className="text-[0.82rem] text-gray-400 mt-0.5 whitespace-pre-wrap break-words break-all">
              {comment.text.length > 150 && !expandedComments[comment.id] ? (
                <>
                  {comment.text.slice(0, 150)}...
                  <button
                    className="text-blue-400 ml-1 hover:underline text-xs"
                    onClick={() => toggleExpandComment(comment.id)}
                  >
                    อ่านเพิ่มเติม
                  </button>
                </>
              ) : (
                <>
                  {comment.text}
                  {comment.text.length > 150 && (
                    <button
                      className="text-blue-400 ml-1 hover:underline text-xs"
                      onClick={() => toggleExpandComment(comment.id)}
                    >
                      แสดงน้อยลง
                    </button>
                  )}
                </>
              )}
            </div>
            {comment.imageUrl && (
              <img
                src={comment.imageUrl}
                alt="comment"
                className="mt-1 rounded-lg max-w-full"
              />
            )}
            <div className="flex items-center gap-2 mt-1 text-xs text-gray-400 flex-wrap">
              <button
                className="hover:text-red-500 transition focus:outline-none"
                onClick={() => toggleLike(comment.id, !comment.liked)}
              >
                <AiFillHeart className={`text-[26px] ${comment.liked ? 'text-red-500' : 'text-gray-400'}`} />
              </button>
              <span>{comment.likes} ไลค์</span>
              {depth < MAX_DEPTH && currentUser && (
                <span
                  className="text-blue-400 hover:underline cursor-pointer"
                  onClick={() => setReplyToId(comment.id)}
                >
                  ตอบกลับ
                </span>
              )}
            </div>
          </div>

          {replyToId === comment.id && currentUser && depth < MAX_DEPTH && (
            <CommentInput
              postId={postId}
              user={currentUser}
              parentId={comment.id}
              onAfterSubmit={() => setReplyToId(null)}
            />
          )}

          {comment.children && comment.children.length > 0 && depth < MAX_DEPTH && (
            <div className="mt-2">
              {!isCollapsed &&
                comment.children
                  .slice(0, visibleReplies)
                  .map((child) => renderComment(child, depth + 1))}

              <span
                className="text-blue-400 hover:underline cursor-pointer text-xs block mt-1"
                onClick={() =>
                  setCollapsedMap((prev) => ({ ...prev, [comment.id]: !isCollapsed }))
                }
              >
                {isCollapsed
                  ? `ดูตอบกลับเพิ่มเติม (${comment.children.length})`
                  : 'พับเก็บตอบกลับ'}
              </span>

              {!isCollapsed &&
                comment.children.length > visibleReplies && (
                  <span
                    className="text-blue-400 hover:underline cursor-pointer text-xs block mt-1"
                    onClick={() =>
                      setVisibleRepliesMap((prev) => ({
                        ...prev,
                        [comment.id]: visibleReplies + COMMENTS_INCREMENT,
                      }))
                    }
                  >
                    แสดงตอบกลับเพิ่มเติม
                  </span>
                )}
            </div>
          )}
        </div>
      </div>
    );
  };

  const showMoreComments = () => {
    setVisibleCount((prev) => prev + COMMENTS_INCREMENT);
  };

  return (
    <div className="mt-3 flex flex-col gap-3">
      {loading ? (
        Array.from({ length: 3 }).map((_, idx) => (
          <div key={idx} className="flex items-start gap-2 animate-pulse">
            <div className="w-7 h-7 rounded-full bg-gray-700" />
            <div className="flex-1 space-y-2">
              <div className="h-2.5 bg-gray-700 rounded w-1/3" />
              <div className="h-2.5 bg-gray-700 rounded w-1/2" />
              <div className="h-2.5 bg-gray-700 rounded w-1/4" />
            </div>
          </div>
        ))
      ) : (
        commentTree.map((c) => renderComment(c))
      )}

      {!loading && flatAllComments.filter(c => c.parentId === null).length > visibleCount && (
        <span
          className="text-blue-400 hover:underline cursor-pointer text-xs"
          onClick={showMoreComments}
        >
          ดูความคิดเห็นเพิ่มเติม
        </span>
      )}
    </div>
  );
};

export default CommentSection;
