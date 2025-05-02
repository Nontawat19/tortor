import React from 'react';
import '@/styles/postlist/PostMediaModal.css';
import { motion } from 'framer-motion';
import { useSwipeable } from 'react-swipeable';

interface MediaItem {
  type: 'image' | 'video';
  url: string;
}

interface PostMediaModalProps {
  media: MediaItem[];
  currentIndex: number;
  closeModal: () => void;
  setModalIndex: (index: number) => void;
}

const PostMediaModal: React.FC<PostMediaModalProps> = ({
  media,
  currentIndex,
  closeModal,
  setModalIndex,
}) => {
  const prevImage = () => {
    setModalIndex((currentIndex - 1 + media.length) % media.length);
  };

  const nextImage = () => {
    setModalIndex((currentIndex + 1) % media.length);
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: nextImage,
    onSwipedRight: prevImage,
    trackMouse: true,
  });

  return (
    <motion.div
      className="image-modal"
      onClick={closeModal}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      {...swipeHandlers}
    >
      {/* ปุ่มปิด */}
      <button
        className="modal-close"
        onClick={(e) => {
          e.stopPropagation();
          closeModal();
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="white"
          width="32px" /* เพิ่มขนาด */
          height="32px" /* เพิ่มขนาด */
        >
          <path d="M18.3 5.71a1 1 0 0 0-1.42 0L12 10.59 7.12 5.71a1 1 0 0 0-1.42 1.42L10.59 12l-4.89 4.88a1 1 0 0 0 1.42 1.42L12 13.41l4.88 4.89a1 1 0 0 0 1.42-1.42L13.41 12l4.89-4.88a1 1 0 0 0 0-1.42z" />
        </svg>
      </button>

      {/* ปุ่มเลื่อนซ้าย */}
      <button
        className="modal-prev"
        onClick={(e) => {
          e.stopPropagation();
          prevImage();
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="white"
          width="64px" /* เพิ่มขนาด */
          height="64px" /* เพิ่มขนาด */
          stroke="white"
          strokeWidth="2" /* เพิ่มความหนา */
        >
          <path d="M15.41 16.59L10.83 12l4.58-4.59a1 1 0 0 0-1.42-1.42l-5 5a1 1 0 0 0 0 1.42l5 5a1 1 0 0 0 1.42-1.42z" />
        </svg>
      </button>

      {/* ภาพหลัก */}
      <div className="media-container">
        {media[currentIndex].type === 'video' ? (
          <video src={media[currentIndex].url} controls />
        ) : (
          <img src={media[currentIndex].url} alt="preview" />
        )}
      </div>

      {/* ปุ่มเลื่อนขวา */}
      <button
        className="modal-next"
        onClick={(e) => {
          e.stopPropagation();
          nextImage();
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="white"
          width="64px" /* เพิ่มขนาด */
          height="64px" /* เพิ่มขนาด */
          stroke="white"
          strokeWidth="2" /* เพิ่มความหนา */
        >
          <path d="M8.59 16.59L13.17 12l-4.58-4.59a1 1 0 0 1 1.42-1.42l5 5a1 1 0 0 1 0 1.42l-5 5a1 1 0 0 1-1.42-1.42z" />
        </svg>
      </button>

      {/* Thumbnail ด้านล่าง */}
      <div className="thumbnail-container">
        {media.map((item, index) => (
          <img
            key={index}
            src={item.url}
            alt={`thumb-${index}`}
            className={`thumbnail ${index === currentIndex ? 'active' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              setModalIndex(index);
            }}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default PostMediaModal;
