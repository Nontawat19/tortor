import React from 'react';

interface UserData {
  uid: string;
  fullName: string;
  profileUrl?: string;
}

interface LikerAvatarsProps {
  likerProfiles: UserData[];
  likesCount: number;
}

const LikerAvatars: React.FC<LikerAvatarsProps> = ({ likerProfiles, likesCount }) => {
  return (
    <div className="flex items-center gap-1 pt-2 pl-1">
      <div className="flex items-center">
        {likerProfiles.map((liker, index) => (
          <img
            key={liker.uid}
            src={liker.profileUrl}
            alt={liker.fullName}
            className="w-6 h-6 rounded-full object-cover border border-white -ml-2 first:ml-0"
          />
        ))}
      </div>
      <span className="text-[0.8rem] text-gray-300 ml-2">
        {likesCount} likes
      </span>
    </div>
  );
};

export default LikerAvatars;
