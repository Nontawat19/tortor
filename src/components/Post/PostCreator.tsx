import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { firestore, storage } from "@/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import imageCompression from "browser-image-compression";

import "@/styles/postcreator/PostCreator.css";
import "@/styles/postcreator/PrivacySelector.css";

import PostTop from "./postcreator/PostTop";
import PreviewArea from "./postcreator/PreviewArea";
import PostBottom from "./postcreator/PostBottom";

const PostCreator = () => {
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
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };
    return await imageCompression(file, options);
  };

  const urlPatterns = {
    facebook: /(?:https?:\/\/)?(?:www\.|web\.|m\.)?facebook\.com(?:\/\S*)?/,
    instagram: /(?:https?:\/\/)?(?:www\.|m\.)?instagram\.com(?:\/\S*)?/,
    youtube: /(?:https?:\/\/)?(?:www\.|m\.)?youtube\.com\/\S+|youtu\.be\/\S+/,
    tiktok: /(?:https?:\/\/)?(?:www\.|m\.|vm\.)?tiktok\.com\/\S+/,
  };
  

  const canPost =
    text.trim() !== "" ||
    files.length > 0 ||
    Object.values(urlPatterns).some((pattern) => pattern.test(text));

  const handlePost = async () => {
    if (uploading || !currentUser) return;
    setUploading(true);
    try {
      let mediaUrls: { url: string; type: string }[] = [];

      for (const file of files) {
        let uploadFile = file;
        if (file.type.startsWith("image/")) {
          uploadFile = await compressImage(file);
        }
        const fileRef = ref(storage, `posts/${currentUser.uid}/${Date.now()}-${file.name}`);
        await uploadBytes(fileRef, uploadFile);
        const url = await getDownloadURL(fileRef);
        mediaUrls.push({ url, type: file.type.startsWith("image/") ? "image" : "video" });
      }

      const detectedUrls: { platform: string; url: string }[] = [];
      for (const [platform, pattern] of Object.entries(urlPatterns)) {
        const match = text.match(pattern);
        if (match) {
          detectedUrls.push({ platform, url: match[0] });
        }
      }

      const postData = {
        userId: currentUser.uid,
        text,
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
    <div className="post-container">
      <PostTop
        text={text}
        setText={setText}
        privacy={privacy}
        setPrivacy={setPrivacy}
      />

      {previews.length > 0 && (
        <PreviewArea
          previews={previews}
          files={files}
          onRemove={handleRemove}
        />
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
