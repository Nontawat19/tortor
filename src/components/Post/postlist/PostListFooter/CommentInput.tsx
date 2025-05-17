import React, { useState } from "react";
import { BsSend } from "react-icons/bs";
import { FaImages } from "react-icons/fa";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import imageCompression from "browser-image-compression";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { firestore } from "@/firebase";
import defaultProfile from "@/assets/profile.png";
import TextareaAutosize from "react-textarea-autosize";

interface CommentInputProps {
  postId: string;
  user: {
    uid: string;
    fullName: string;
    profileUrl?: string;
  };
  parentId?: string | null;
  onAfterSubmit?: () => void;
}

const CommentInput: React.FC<CommentInputProps> = ({
  postId,
  user,
  parentId = null,
  onAfterSubmit,
}) => {
  const [comment, setComment] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const compressAndUploadImage = async (file: File): Promise<string> => {
    const compressed = await imageCompression(file, {
      maxSizeMB: 0.5,
      maxWidthOrHeight: 800,
      useWebWorker: true,
    });
    const storage = getStorage();
    const storageRef = ref(storage, `comments/${postId}/${Date.now()}_${file.name}`);
    await uploadBytes(storageRef, compressed);
    return await getDownloadURL(storageRef);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim() && !selectedImage) return;

    try {
      let imageUrl = null;
      if (selectedImage) {
        imageUrl = await compressAndUploadImage(selectedImage);
      }

      const newComment = {
        text: comment,
        user: user.fullName,
        uid: user.uid,
        profileUrl: user.profileUrl || defaultProfile,
        likes: 0,
        likedBy: [],
        createdAt: serverTimestamp(),
        parentId,
        imageUrl,
      };

      await addDoc(collection(firestore, "posts", postId, "comments"), newComment);
      setComment("");
      setSelectedImage(null);
      setPreviewUrl(null);
      onAfterSubmit?.();
    } catch (error) {
      console.error("ส่งความคิดเห็นไม่สำเร็จ:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 mt-2 w-full">
      <div className="flex gap-2 items-start w-full">
        <img
          src={user.profileUrl || defaultProfile}
          alt="avatar"
          className="w-[30px] h-[30px] rounded-full object-cover shrink-0"
        />

        <div className="flex-1 flex flex-col gap-2">
          <div className="flex items-start bg-[#2e2e2e] rounded-2xl px-3 py-2 w-full">
            <TextareaAutosize
              minRows={1}
              maxRows={10}
              className="flex-1 resize-none overflow-hidden bg-transparent text-gray-200 text-sm leading-snug focus:outline-none focus:ring-0"
              placeholder={parentId ? "ตอบกลับ..." : `แสดงความคิดเห็นในชื่อ ${user.fullName}`}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />

            <div className="flex items-center gap-2 ml-3 mt-1">
              <label htmlFor={`image-upload-${parentId || "main"}`} className="cursor-pointer text-gray-400">
                <FaImages className="text-[20px]" />
              </label>
              <input
                type="file"
                id={`image-upload-${parentId || "main"}`}
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />

              <button
                type="submit"
                className={`w-[34px] h-[34px] rounded-full flex items-center justify-center transition-all ${
                  comment.trim() || selectedImage
                    ? "bg-[#3a3a3a] hover:bg-[#4b4b4b] text-white"
                    : "bg-[#2a2a2a] text-[#555] cursor-not-allowed"
                }`}
                disabled={!comment.trim() && !selectedImage}
              >
                <BsSend className="text-[18.7px]" />
              </button>
            </div>
          </div>

          {previewUrl && (
            <div className="relative mt-1 rounded-lg overflow-hidden max-w-[300px]">
              <img src={previewUrl} alt="preview" className="w-full h-auto rounded-lg block" />
              <button
                type="button"
                onClick={() => {
                  setSelectedImage(null);
                  setPreviewUrl(null);
                }}
                className="absolute top-1.5 right-1.5 bg-black/60 text-white w-[22px] h-[22px] text-[12px] rounded-full flex items-center justify-center"
              >
                ❌
              </button>
            </div>
          )}
        </div>
      </div>
    </form>
  );
};

export default CommentInput;
