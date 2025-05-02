import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { auth, firestore, storage } from "../../firebase"; // เปลี่ยน database -> firestore
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore"; // เพิ่ม import firestore method
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import imageCompression from "browser-image-compression";
import { ToastContainer, toast } from "react-toastify";
import ToastContent from "../../components/ToastContent";
import Logo from "../../assets/logo.png";
import ProfilePlaceholder from "../../assets/profile.png";
import { showFirebaseError } from "../../utils/showFirebaseError";

import "react-toastify/dist/ReactToastify.css";
import "../../styles/RegisterPage.css";

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profileUrl, setProfileUrl] = useState("");
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName || !email || !password || !confirmPassword) {
      toast.warn(<ToastContent title="ข้อมูลไม่ครบ" message="กรุณากรอกข้อมูลให้ครบทุกช่อง" />);
      return;
    }

    if (password.length < 6) {
      toast.warn(<ToastContent title="รหัสผ่านสั้นเกินไป" message="ต้องมีอย่างน้อย 6 ตัวอักษร" />);
      return;
    }

    if (password !== confirmPassword) {
      toast.error(<ToastContent title="รหัสผ่านไม่ตรงกัน" message="กรุณายืนยันรหัสผ่านอีกครั้ง" />);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const uid = user.uid;

      let profileImageUrl = "";

      if (selectedFile) {
        const compressedFile = await imageCompression(selectedFile, {
          maxSizeMB: 1,
          maxWidthOrHeight: 500,
          useWebWorker: true,
        });

        const storageReference = storageRef(storage, `profiles/${uid}`);
        await uploadBytes(storageReference, compressedFile);
        profileImageUrl = await getDownloadURL(storageReference);
      }

      await setDoc(doc(firestore, "users", uid), {
        fullName,
        email,
        profileUrl: profileImageUrl || profileUrl || "",
        createdAt: Date.now(),
      });

      toast.success(<ToastContent title="ลงทะเบียนสำเร็จ" message="กำลังกลับไปหน้า Login..." />);
      setTimeout(() => navigate("/login"), 2500);
    } catch (error: any) {
      console.error(error);
      showFirebaseError(error);
    }
  };

  return (
    <div className="register-container">
      {/* Toast, Form, UI เหมือนเดิม */}
      {/* ... */}
    </div>
  );
};

export default RegisterPage;
