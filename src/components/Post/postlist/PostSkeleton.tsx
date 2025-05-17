import React from 'react';

const PostSkeleton: React.FC = () => {
  return (
    <div className="w-full max-w-[680px] mx-auto">
      <div className="w-full flex gap-2.5 p-4 bg-[#1c1c1c] rounded-lg mb-4 min-h-[400px]">
        <div className="w-[50px] h-[50px] bg-[#2a2a2a] rounded-full shrink-0"></div>
        <div className="flex-1 flex flex-col gap-2">
          <div className="h-2.5 bg-[#2a2a2a] rounded w-[30%]"></div>
          <div className="h-2.5 bg-[#2a2a2a] rounded w-[80%]"></div>
          <div className="w-full h-[240px] bg-[#2a2a2a] rounded-lg"></div>
        </div>
      </div>
    </div>
  );
};

export default PostSkeleton;
