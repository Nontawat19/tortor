import React from 'react';
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
      className="fixed inset-0 z-[9999] bg-black bg-opacity-95 flex flex-col items-center justify-center"
      onClick={closeModal}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      {...swipeHandlers}
    >
      {/* ปุ่มปิด */}
      <button
        className="absolute top-5 right-5 bg-black/60 hover:bg-white/20 rounded-full w-12 h-12 flex items-center justify-center transition"
        onClick={(e) => {
          e.stopPropagation();
          closeModal();
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="24" height="24">
          <path d="M18.3 5.71a1 1 0 0 0-1.42 0L12 10.59 7.12 5.71a1 1 0 0 0-1.42 1.42L10.59 12l-4.89 4.88a1 1 0 0 0 1.42 1.42L12 13.41l4.88 4.89a1 1 0 0 0 1.42-1.42L13.41 12l4.89-4.88a1 1 0 0 0 0-1.42z" />
        </svg>
      </button>

      {/* ปุ่มเลื่อนซ้าย */}
      <button
        className="absolute left-5 top-1/2 transform -translate-y-1/2 bg-black/60 hover:bg-white/20 rounded-full w-14 h-14 flex items-center justify-center transition"
        onClick={(e) => {
          e.stopPropagation();
          prevImage();
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="32" height="32">
          <path d="M15.41 16.59L10.83 12l4.58-4.59a1 1 0 0 0-1.42-1.42l-5 5a1 1 0 0 0 0 1.42l5 5a1 1 0 0 0 1.42-1.42z" />
        </svg>
      </button>

      {/* ภาพหลัก */}
      <div className="max-h-[80vh] max-w-[90vw] flex justify-center items-center p-4">
        {media[currentIndex].type === 'video' ? (
          <video src={media[currentIndex].url} controls className="max-w-full max-h-full rounded" />
        ) : (
          <img src={media[currentIndex].url} alt="preview" className="max-w-full max-h-full object-contain rounded" />
        )}
      </div>

      {/* ปุ่มเลื่อนขวา */}
      <button
        className="absolute right-5 top-1/2 transform -translate-y-1/2 bg-black/60 hover:bg-white/20 rounded-full w-14 h-14 flex items-center justify-center transition"
        onClick={(e) => {
          e.stopPropagation();
          nextImage();
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="32" height="32">
          <path d="M8.59 16.59L13.17 12l-4.58-4.59a1 1 0 0 1 1.42-1.42l5 5a1 1 0 0 1 0 1.42l-5 5a1 1 0 0 1-1.42-1.42z" />
        </svg>
      </button>

      {/* Thumbnail */}
      <div className="mt-5 flex gap-2 overflow-x-auto px-2 pb-1">
        {media.map((item, index) => (
          <img
            key={index}
            src={item.url}
            alt={`thumb-${index}`}
            className={`w-14 h-14 object-cover rounded cursor-pointer opacity-60 hover:opacity-100 border-2 ${
              index === currentIndex ? "border-white opacity-100" : "border-transparent"
            }`}
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
