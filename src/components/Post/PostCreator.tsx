import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { firestore, storage } from "@/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import imageCompression from "browser-image-compression";

import PostTop from "./postcreator/PostTop";
import PreviewArea from "./postcreator/PreviewArea";
import PostBottom from "./postcreator/PostBottom";

const PostCreator: React.FC = () => {
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const [text, setText] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [privacy, setPrivacy] = useState("public");

  useEffect(() => {
    if (files.length > 0) {
      const previewUrls = files.map((file) => URL.createObjectURL(file));
      setPreviews(previewUrls);
      return () => previewUrls.forEach((url) => URL.revokeObjectURL(url));
    } else {
      setPreviews([]);
    }
  }, [files]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selectedFiles = Array.from(e.target.files);
    if (files.length + selectedFiles.length > 20) {
      alert("ไม่สามารถอัปโหลดเกิน 20 ไฟล์ได้");
      return;
    }
    setFiles((prev) => [...prev, ...selectedFiles]);
  };

  const handleRemove = (index: number) => {
    setFiles((prev) => prev.filter((_, idx) => idx !== index));
    setPreviews((prev) => prev.filter((_, idx) => idx !== index));
  };

  const compressImage = async (file: File) => {
    const options = { maxSizeMB: 1, maxWidthOrHeight: 1920, useWebWorker: true };
    return await imageCompression(file, options);
  };

  const extractTextAndUrls = (text: string) => {
    const urlPatterns = {
      facebook: /\bhttps?:\/\/(?:www\.|m\.|web\.)?facebook\.com\/[^\s\u0E00-\u0E7F]+/gi,
      instagram: /\bhttps?:\/\/(?:www\.|m\.)?instagram\.com\/[^\s\u0E00-\u0E7F]+/gi,
      youtube: /\bhttps?:\/\/(?:www\.|m\.)?(?:youtube\.com\/[^\s\u0E00-\u0E7F]+|youtu\.be\/[^\s\u0E00-\u0E7F]+)/gi,
    };
    const detected: { platform: string; url: string }[] = [];
    let cleanedText = text;
    for (const [platform, pattern] of Object.entries(urlPatterns)) {
      const matches = [...text.matchAll(pattern)];
      matches.forEach((match) => {
        detected.push({ platform, url: match[0] });
        cleanedText = cleanedText.replace(match[0], " ");
      });
    }
    cleanedText = cleanedText.replace(/\s+/g, " ").trim();
    return { cleanedText, urls: detected };
  };

  const { cleanedText, urls: detectedUrls } = extractTextAndUrls(text);
  const canPost = cleanedText.trim() !== "" || files.length > 0 || detectedUrls.length > 0;

  const handlePost = async () => {
    if (uploading || !currentUser) return;
    setUploading(true);
    try {
      const mediaUrls: { url: string; type: string }[] = [];

      for (const file of files) {
        let uploadFile = file;
        if (file.type.startsWith("image/")) {
          try {
            uploadFile = await compressImage(file);
          } catch (err) {
            console.warn("Image compression failed", err);
          }
        }

        const fileRef = ref(storage, `posts/${currentUser.uid}/${Date.now()}-${file.name}`);
        await uploadBytes(fileRef, uploadFile);
        const url = await getDownloadURL(fileRef);
        mediaUrls.push({ url, type: file.type.startsWith("image/") ? "image" : "video" });
      }

      const postData = {
        userId: currentUser.uid,
        text: cleanedText,
        media: mediaUrls,
        urls: detectedUrls,
        privacy,
        createdAt: serverTimestamp(),
      };

      const newPostRef = doc(firestore, `posts/${Date.now()}-${currentUser.uid}`);
      await setDoc(newPostRef, postData);

      setText("");
      setFiles([]);
      setPreviews([]);
      setPrivacy("public");
      alert("โพสต์สำเร็จ!");
    } catch (error) {
      console.error(error);
      alert("เกิดข้อผิดพลาดในการโพสต์");
    }
    setUploading(false);
  };

  return (
    <div className="w-full max-w-[600px] bg-[#242526] rounded-xl p-4 shadow-md mb-6 mx-auto">
      <PostTop text={text} setText={setText} privacy={privacy} setPrivacy={setPrivacy} />
      {previews.length > 0 && (
        <PreviewArea previews={previews} files={files} onRemove={handleRemove} />
      )}
      <PostBottom
        handleFileChange={handleFileChange}
        handlePost={handlePost}
        uploading={uploading}
        canPost={canPost}
      />
    </div>
  );
};

export default PostCreator;
