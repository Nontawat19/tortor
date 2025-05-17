import React from "react";
import PostHeader from "./PostHeader";
import PostContent from "./PostContent";
import PostListFooter from "./PostListFooter";

interface MediaItem {
  type: "image" | "video";
  url: string;
}

interface PlatformData {
  platform: string;
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
  privacy: "public" | "followers" | "private";
  urls?: PlatformData[];
}

interface UserData {
  uid: string;
  fullName: string;
  profileUrl?: string;
}

interface PostItemProps {
  post: Post;
  user: UserData | undefined;
  currentUser?: UserData | null;
  openModal: (media: MediaItem[], index: number) => void;
}

const PostItem: React.FC<PostItemProps> = ({
  post,
  user,
  currentUser,
  openModal,
}) => {
  const handleCommentClick = () => {
    console.log("แสดงความคิดเห็นสำหรับโพสต์:", post.id);
  };

  return (
    <div className="bg-[#242526] text-white p-4 rounded-xl shadow-sm mb-4 w-full">
      <PostHeader
        user={user}
        createdAt={post.createdAt}
        privacy={post.privacy}
        urls={post.urls}
      />
      <PostContent post={post} openModal={openModal} />
      <PostListFooter
        post={post}
        user={currentUser || undefined}
        onCommentClick={handleCommentClick}
      />
    </div>
  );
};

export default PostItem;
