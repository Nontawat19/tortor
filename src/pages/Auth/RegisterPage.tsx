import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { auth, firestore, storage } from "../../firebase";
import { createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import imageCompression from "browser-image-compression";
import { ToastContainer, toast } from "react-toastify";
import ToastContent from "../../components/ToastContent";
import Logo from "../../assets/logo.png";
import ProfilePlaceholder from "../../assets/profile.png";
import { showFirebaseError } from "../../utils/showFirebaseError";

import "react-toastify/dist/ReactToastify.css";

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

    if (!selectedFile) {
      toast.warn(<ToastContent title="ยังไม่เลือกรูปโปรไฟล์" message="กรุณาเลือกรูปภาพก่อนสมัครสมาชิก" />);
      return;
    }

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

      const compressedFile = await imageCompression(selectedFile, {
        maxSizeMB: 1,
        maxWidthOrHeight: 500,
        useWebWorker: true,
      });

      const storageReference = storageRef(storage, `profiles/${uid}`);
      await uploadBytes(storageReference, compressedFile);
      const imageUrl = await getDownloadURL(storageReference);

      await setDoc(doc(firestore, "users", uid), {
        fullName,
        email,
        profileUrl: imageUrl || profileUrl || "",
        createdAt: Date.now(),
      });

      await signOut(auth);

      toast.success(<ToastContent title="ลงทะเบียนสำเร็จ" message="กรุณาเข้าสู่ระบบอีกครั้ง" />);
      setTimeout(() => navigate("/login"), 2500);
    } catch (error: any) {
      console.error(error);
      showFirebaseError(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-4 py-10">
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar />

      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 space-y-6 animate-fadeIn">
        <div className="flex justify-center">
          <img src={Logo} alt="Logo" className="w-28 h-auto animate-fadeLogoIn" />
        </div>
        <h2 className="text-2xl font-bold text-center text-gray-800">สมัครสมาชิก</h2>

        <div className="flex justify-center">
          <label htmlFor="profileUpload" className="cursor-pointer">
            {previewImage ? (
              <img src={previewImage} alt="Profile" className="w-24 h-24 rounded-full object-cover border" />
            ) : (
              <div
                className="w-24 h-24 rounded-full border bg-center bg-cover bg-no-repeat"
                style={{ backgroundImage: `url(${ProfilePlaceholder})` }}
              />
            )}
          </label>
          <input id="profileUpload" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="text"
            placeholder="ชื่อ-นามสกุล"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="email"
            placeholder="อีเมล"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <div className="flex gap-3">
            <input
              type="password"
              placeholder="รหัสผ่าน"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="password"
              placeholder="ยืนยันรหัสผ่าน"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <input
            type="text"
            placeholder="URL โปรไฟล์ Facebook (ไม่บังคับ)"
            value={profileUrl}
            onChange={(e) => setProfileUrl(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 hover:scale-105 transition duration-200"
          >
            สมัครสมาชิก
          </button>
        </form>

        <p
          className="text-center text-sm text-blue-600 font-medium cursor-pointer hover:underline"
          onClick={() => navigate("/login")}
        >
          กลับสู่หน้า Login
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
