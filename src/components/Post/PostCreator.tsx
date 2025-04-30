import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { firestore, storage } from "@/firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import imageCompression from "browser-image-compression";
import { FaRegImage, FaVideo } from "react-icons/fa6";

import "@/styles/PostCreator.css";

const PostCreator = () => {
  const { currentUser } = useAuth();
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
      <div className="post-top">
        <img
          src={profileUrl || "/default-avatar.png"}
          alt="Profile"
          className="profile-img"
        />
        <textarea
          className="post-input"
          placeholder="คุณกำลังคิดอะไรอยู่..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        ></textarea>
      </div>

      {previews.length > 0 && (
        <div className="preview-area">
          {previews.map((src, idx) => (
            <div key={idx} className="preview-item">
              {files[idx]?.type.startsWith("video/") ? (
                <video src={src} controls className="preview-video" />
              ) : (
                <img src={src} alt="preview" className="preview-image" />
              )}
            </div>
          ))}
        </div>
      )}

      <div className="post-bottom">
        <label className="post-option">
          <input
            type="file"
            hidden
            multiple
            accept="image/*,video/*"
            onChange={handleFileChange}
          />
          <FaRegImage /> รูปภาพ/วิดีโอ
        </label>
        <button
          className="post-button"
          onClick={handlePost}
          disabled={uploading}
        >
          {uploading ? "กำลังโพสต์..." : "โพสต์"}
        </button>
      </div>
    </div>
  );
};

export default PostCreator;
