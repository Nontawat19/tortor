import React from "react";

interface MediaItem {
  type: "image" | "video";
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
  urls?: { platform: string; url: string }[];
}

interface PostContentProps {
  post: Post;
  openModal: (media: MediaItem[], index: number) => void;
}

const PostContent: React.FC<PostContentProps> = ({ post, openModal }) => {
  const safeText = post.text.replace(/(https?:\/\/\S+)/g, "\u200B$1\u200B");
  const media = post.media || [];
  const count = Math.min(media.length, 4);
  const items = media.slice(0, 4);

  const renderMedia = () => {
    if (count === 0) return null;

    if (count === 1) {
      return (
        <div className="mt-3 rounded-xl overflow-hidden">
          <PostMediaItem item={items[0]} index={0} media={media} openModal={openModal} full />
        </div>
      );
    }

    if (count === 2) {
      return (
        <div className="grid grid-cols-2 gap-[2px] mt-3 rounded-xl overflow-hidden">
          {items.map((item, index) => (
            <PostMediaItem key={index} item={item} index={index} media={media} openModal={openModal} />
          ))}
        </div>
      );
    }

    if (count === 3) {
      return (
        <div className="grid grid-cols-3 gap-[2px] mt-3 h-[400px] rounded-xl overflow-hidden">
          <div className="col-span-2 h-full">
            <PostMediaItem item={items[0]} index={0} media={media} openModal={openModal} full />
          </div>
          <div className="grid grid-rows-2 gap-[2px] h-full">
            <PostMediaItem item={items[1]} index={1} media={media} openModal={openModal} />
            <PostMediaItem item={items[2]} index={2} media={media} openModal={openModal} />
          </div>
        </div>
      );
    }

    if (count === 4) {
      return (
        <div className="grid grid-cols-2 grid-rows-2 gap-[2px] mt-3 rounded-xl overflow-hidden">
          {items.map((item, index) => (
            <PostMediaItem
              key={index}
              item={item}
              index={index}
              media={media}
              openModal={openModal}
            />
          ))}
        </div>
      );
    }
  };

  return (
    <div className="text-[15px] whitespace-pre-wrap leading-[1.6] mt-2 text-white">
      <p>{safeText}</p>
      {renderMedia()}
    </div>
  );
};

interface PostMediaItemProps {
  item: MediaItem;
  index: number;
  media: MediaItem[];
  openModal: (media: MediaItem[], index: number) => void;
  full?: boolean;
}

const PostMediaItem: React.FC<PostMediaItemProps> = ({
  item,
  index,
  media,
  openModal,
  full = false,
}) => {
  return (
    <div
      className={`relative group cursor-pointer overflow-hidden ${
        full ? "w-full h-full" : "aspect-square h-full"
      } bg-black`}
      onClick={() => openModal(media, index)}
    >
      {item.type === "image" ? (
        <img
          src={item.url}
          alt={`media-${index}`}
          className="w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
        />
      ) : (
        <video
          src={item.url}
          controls
          className="w-full h-full object-cover"
        />
      )}
    </div>
  );
};

export default PostContent;
