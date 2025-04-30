import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/services/firebase';
import '@/styles/PostList.css';

interface MediaItem {
  type: string;
  url: string;
}

interface Post {
  id: string;
  text: string;
  createdAt: any;
  media?: MediaItem[];
}

const PostList: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [modalPost, setModalPost] = useState<MediaItem[] | null>(null);
  const [modalIndex, setModalIndex] = useState<number>(0);

  useEffect(() => {
    const fetchPosts = async () => {
      const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Post[];
      setPosts(data);
    };

    fetchPosts();
  }, []);

  const openModal = (media: MediaItem[], index: number) => {
    setModalPost(media);
    setModalIndex(index);
  };

  const closeModal = () => {
    setModalPost(null);
    setModalIndex(0);
  };

  const prevImage = () => {
    if (modalPost) {
      setModalIndex((modalIndex - 1 + modalPost.length) % modalPost.length);
    }
  };

  const nextImage = () => {
    if (modalPost) {
      setModalIndex((modalIndex + 1) % modalPost.length);
    }
  };

  return (
    <>
      <div className="post-list">
        {posts.length === 0 ? (
          <div className="no-posts">
            <p>ยังไม่มีโพสต์ในระบบ</p>
          </div>
        ) : (
          posts.map(post => (
            <div key={post.id} className="post-item">
              <div className="post-header">
                <img
                  src="https://via.placeholder.com/40"
                  alt="avatar"
                  className="avatar"
                />
                <div className="post-header-info">
                  <span className="post-username">ผู้ใช้ไม่ทราบชื่อ</span>
                  <span className="post-time">
                    {post.createdAt?.seconds
                      ? new Date(post.createdAt.seconds * 1000).toLocaleString()
                      : 'ไม่ทราบเวลา'}
                  </span>
                </div>
              </div>
              <div className="post-content">
                <p>{post.text}</p>
                <div className="post-media-grid">
                  {post.media?.slice(0, 10).map((item, index) => (
                    item.type === 'image' ? (
                      <img
                        key={index}
                        src={item.url}
                        alt={`media-${index}`}
                        className="post-media"
                        onClick={() => openModal(post.media!, index)}
                      />
                    ) : (
                      <video
                        key={index}
                        src={item.url}
                        controls
                        className="post-media"
                      />
                    )
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {modalPost && (
        <div className="image-modal" onClick={closeModal}>
          <button
            className="modal-nav left"
            onClick={e => {
              e.stopPropagation();
              prevImage();
            }}
          >
            &lt;
          </button>
          {modalPost[modalIndex].type === 'video' ? (
            <video src={modalPost[modalIndex].url} controls />
          ) : (
            <img src={modalPost[modalIndex].url} alt="preview" />
          )}
          <button
            className="modal-nav right"
            onClick={e => {
              e.stopPropagation();
              nextImage();
            }}
          >
            &gt;
          </button>
        </div>
      )}
    </>
  );
};

export default PostList;