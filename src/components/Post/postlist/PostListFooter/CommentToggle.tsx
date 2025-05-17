import React from 'react';
import { AiOutlineComment } from 'react-icons/ai';

interface CommentToggleProps {
  onToggle: () => void;
}

const CommentToggle: React.FC<CommentToggleProps> = ({ onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className="w-6 h-6 p-0 cursor-pointer bg-transparent border-none relative rounded-full group"
    >
      <AiOutlineComment className="text-white text-[26px] group-hover:text-gray-400 transition-colors duration-300" />
    </button>
  );
};

export default CommentToggle;
