import React from 'react'; 
import { AiFillHeart } from 'react-icons/ai';

interface LikeButtonProps {
  isLiked: boolean;
  onLike: () => void;
}

const LikeButton: React.FC<LikeButtonProps> = ({ isLiked, onLike }) => {
  return (
    <button
      onClick={onLike}
      aria-label="กดไลค์"
      className="w-7 h-7 flex items-center justify-center p-0 border-none bg-transparent cursor-pointer focus:outline-none focus:ring-0"
    >
      <AiFillHeart
        className={`text-[50px] transition-all duration-200 ${
          isLiked
            ? 'text-red-500 scale-[1.03]'
            : 'text-gray-300 scale-[1]'
        }`}
      />
    </button>
  );
};

export default LikeButton;
