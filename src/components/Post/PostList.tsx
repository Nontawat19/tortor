import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot, doc, getDoc } from 'firebase/firestore';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { db } from '@/services/firebase';
import PostMediaModal from './postlist/PostMediaModal';
import PostItem from './postlist/PostItem';
import PostSkeleton from '@/components/Post/postlist/PostSkeleton';
import '@/styles/postlist/PostList.css';

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
  id: string; // ใช้ id เป็น uid
  uid: string; // เพิ่มฟิลด์ uid
  name: string;
  avatarUrl: string;
  fullName: string;
  profileUrl?: string;
}

const PostList: React.FC = () => {
  const currentUserData = useSelector((state: RootState) => state.auth.user);
  const [posts, setPosts] = useState<Post[]>([]);
  const [users, setUsers] = useState<Record<string, UserData>>({});
  const [modalPost, setModalPost] = useState<MediaItem[] | null>(null);
  const [modalIndex, setModalIndex] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [isImagesLoaded, setIsImagesLoaded] = useState<boolean>(false);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));

      const unsubscribe = onSnapshot(q, async (querySnapshot) => {
        const data = querySnapshot.docs.map(doc => {
          const raw = doc.data();
          return {
            id: doc.id,
            userId: raw.userId,
            text: raw.text,
            media: raw.media,
            createdAt: raw.createdAt,
            likes: raw.likes,
            likedBy: raw.likedBy,
            privacy: raw.privacy || 'public',
            urls: raw.urls || [],
          };
        }) as Post[];

        const userIds = Array.from(new Set(data.map(post => post.userId)));
        const userMap: Record<string, UserData> = { ...users };

        await Promise.all(
          userIds.map(async (uid) => {
            if (!userMap[uid]) {
              const userDoc = await getDoc(doc(db, 'users', uid));
              if (userDoc.exists()) {
                userMap[uid] = userDoc.data() as UserData;
              }
            }
          })
        );

        setUsers(userMap);
        setPosts(data);
        setLoading(false);
      });

      return () => unsubscribe();
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    if (!loading && posts.length > 0) {
      const imagePromises = posts.flatMap(post =>
        post.media?.map(mediaItem => {
          if (mediaItem.type === 'image') {
            return new Promise<void>((resolve) => {
              const img = new Image();
              img.src = mediaItem.url;
              img.onload = () => resolve();
              img.onerror = () => resolve();
            });
          }
          return Promise.resolve();
        }) || []
      );

      Promise.all(imagePromises).then(() => {
        setIsImagesLoaded(true);
      });
    }
  }, [loading, posts]);

  const openModal = (media: MediaItem[], index: number) => {
    setModalPost(media);
    setModalIndex(index);
  };

  const closeModal = () => {
    setModalPost(null);
    setModalIndex(0);
  };

  return (
    <>
      <div className="post-list">
        {loading || !isImagesLoaded ? (
          Array.from({ length: 5 }).map((_, index) => <PostSkeleton key={index} />)
        ) : posts.length === 0 ? (
          <div className="no-posts">
            <p>ยังไม่มีโพสต์ในระบบ</p>
          </div>
        ) : (
          posts.map(post => (
            <PostItem
              key={post.id}
              post={post}
              user={users[post.userId]}                     // เจ้าของโพสต์
              currentUser={currentUserData || undefined}    // ✅ ป้องกัน null
              openModal={openModal}
            />
          ))
        )}
      </div>

      {modalPost && (
        <PostMediaModal
          media={modalPost}
          currentIndex={modalIndex}
          closeModal={closeModal}
          setModalIndex={setModalIndex}
        />
      )}
    </>
  );
};

export default PostList;
