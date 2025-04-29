import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { firestore, storage } from "@/firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import imageCompression from "browser-image-compression";
import { FaPhotoVideo } from "react-icons/fa";

import "@/styles/PostCreator.css";

const PostCreator = () => {
  const { currentUser } = useAuth();
  const [profileUrl, setProfileUrl] = useState<string>("");
  const [text, setText] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [detectedUrls, setDetectedUrls] = useState<{ url: string; platform: string }[]>([]);

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
      const previewUrls = files.map(file => URL.createObjectURL(file));
      setPreviews(previewUrls);
    } else {
      setPreviews([]);
    }
  }, [files]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selectedFiles = Array.from(e.target.files);
    if (files.length + selectedFiles.length > 10) {
      alert("สามารถเลือกไฟล์ได้ไม่เกิน 10 ไฟล์");
      return;
    }
    setFiles(prev => [...prev, ...selectedFiles]);
  };

  const detectPlatformUrls = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const matches = text.match(urlRegex) || [];

    const platforms = matches
      .map((url) => {
        if (url.includes("facebook.com")) return { url, platform: "facebook" };
        if (url.includes("youtube.com") || url.includes("youtu.be")) return { url, platform: "youtube" };
        if (url.includes("tiktok.com")) return { url, platform: "tiktok" };
        return null;
      })
      .filter(Boolean) as { url: string; platform: string }[];

    return platforms;
  };

  const removeUrlsFromText = (text: string) => {
    return text.replace(/(https?:\/\/[^\s]+)/g, '').trim();
  };

  const compressImage = async (file: File) => {
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true
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

      const platformUrls = detectPlatformUrls(text);
      const cleanText = removeUrlsFromText(text);

      const postData = {
        userId: currentUser?.uid,
        text: cleanText,
        media: mediaUrls,
        urls: platformUrls,
        createdAt: serverTimestamp()
      };

      const newPostRef = doc(firestore, `posts/${Date.now()}-${currentUser?.uid}`);
      await setDoc(newPostRef, postData);

      setText("");
      setFiles([]);
      setPreviews([]);
      setDetectedUrls([]);
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
          placeholder="คุณกำลังคิดอะไรอยู่..."
          className="post-input"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            setDetectedUrls(detectPlatformUrls(e.target.value));
          }}
        />
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

      {detectedUrls.length > 0 && (
        <div className="preview-area">
          {detectedUrls.map((item, idx) => (
            <div key={idx} className="preview-url">
              <a href={item.url} target="_blank" rel="noopener noreferrer" className="url-link">
                {item.platform.toUpperCase()}: {item.url}
              </a>
            </div>
          ))}
        </div>
      )}

      <div className="post-bottom">
        <label className="post-option">
          <input type="file" hidden multiple accept="image/*,video/*" onChange={handleFileChange} />
          <FaPhotoVideo className="post-icon photo" /> รูป/วิดีโอ
        </label>
        <button className="post-button" onClick={handlePost} disabled={uploading}>
          {uploading ? "กำลังโพสต์..." : "โพสต์"}
        </button>
      </div>
    </div>
  );
};

export default PostCreator;