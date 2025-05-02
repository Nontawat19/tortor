import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { firestore, storage } from "@/firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import imageCompression from "browser-image-compression";
import { FaRegImage } from "react-icons/fa6";

import defaultProfile from "@/assets/profile.png";
import PostTop from "./postcreator/PostTop";
import PreviewArea from "./postcreator/PreviewArea";
import PostBottom from "./postcreator/PostBottom";
import "@/styles/PostCreator.css";

const PostCreator = () => {
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const [profileUrl, setProfileUrl] = useState("");
  const [text, setText] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (currentUser) {
        const userRef = doc(firestore, "users", currentUser.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const data = userSnap.data();
          setProfileUrl(data.profileUrl || "");
        }
      }
    };
    fetchProfile();
  }, [currentUser]);

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
    if (files.length + selectedFiles.length > 10) {
      alert("ไม่สามารถอัพโหลดเกิน 10 ไฟล์ได้");
      return;
    }
    setFiles((prev) => [...prev, ...selectedFiles]);
  };

  const compressImage = async (file: File) => {
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };
    return await imageCompression(file, options);
  };

  const handlePost = async () => {
    if (uploading) return;
    setUploading(true);
    try {
      let mediaUrls: { url: string; type: string }[] = [];
      for (const file of files) {
        let uploadFile = file;
        if (file.type.startsWith("image/")) {
          uploadFile = await compressImage(file);
        }
        const fileRef = ref(storage, `posts/${currentUser?.uid}/${Date.now()}-${file.name}`);
        await uploadBytes(fileRef, uploadFile);
        const url = await getDownloadURL(fileRef);
        mediaUrls.push({ url, type: file.type.startsWith("image/") ? "image" : "video" });
      }

      const postData = {
        userId: currentUser?.uid,
        text,
        media: mediaUrls,
        createdAt: serverTimestamp(),
      };

      const newPostRef = doc(firestore, `posts/${Date.now()}-${currentUser?.uid}`);
      await setDoc(newPostRef, postData);

      setText("");
      setFiles([]);
      setPreviews([]);
      alert("โพสต์สำเร็จ!");
    } catch (error) {
      console.error(error);
      alert("เกิดข้อผิดพลาดในการโพสต์");
    }
    setUploading(false);
  };

  return (
    <div className="post-container">
      <PostTop profileUrl={profileUrl} text={text} setText={setText} />
      <PreviewArea previews={previews} files={files} />
      <PostBottom handleFileChange={handleFileChange} handlePost={handlePost} uploading={uploading} />
    </div>
  );
};

export default PostCreator;