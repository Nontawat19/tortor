import React, { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, firestore, storage } from "../../firebase";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import LogoutButton from "../../components/LogoutButton"; // ✅ import LogoutButton

import "react-toastify/dist/ReactToastify.css";
import "../../styles/ProfilePage.css";

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [profileUrl, setProfileUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          navigate("/login");
          return;
        }
        const userRef = doc(firestore, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const data = userSnap.data();
          setFullName(data.fullName || "");
          setEmail(data.email || "");
          setProfileUrl(data.profileUrl || "");
        }
      } catch (error) {
        console.error(error);
        toast.error("โหลดข้อมูลไม่สำเร็จ");
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleSave = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        toast.error("ไม่พบผู้ใช้");
        return;
      }

      const userRef = doc(firestore, "users", user.uid);
      let updatedProfileUrl = profileUrl;

      if (selectedFile) {
        const storageReference = storageRef(storage, `profiles/${user.uid}`);
        await uploadBytes(storageReference, selectedFile);
        updatedProfileUrl = await getDownloadURL(storageReference);
      }

      await updateDoc(userRef, {
        fullName,
        profileUrl: updatedProfileUrl,
      });

      toast.success("อัปเดตข้อมูลสำเร็จ!");
    } catch (error) {
      console.error(error);
      toast.error("เกิดข้อผิดพลาดในการบันทึก");
    }
  };

  return (
    <div className="profile-container">
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        closeButton={false}
        style={{ width: "400px" }}
      />

      <h1>โปรไฟล์ของฉัน</h1>

      {profileUrl && (
        <img src={profileUrl} alt="Profile" className="profile-image" />
      )}

      <div style={{ marginTop: "20px" }}>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="profile-upload-input"
        />
      </div>

      <div>
        <input
          type="text"
          placeholder="ชื่อ-นามสกุล"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="profile-input"
        />
      </div>

      <div>
        <input
          type="email"
          value={email}
          disabled
          className="profile-input-disabled"
        />
      </div>

      <button onClick={handleSave} className="profile-save-button">
        บันทึกข้อมูล
      </button>

      {/* ✅ ใช้ LogoutButton */}
      <div style={{ marginTop: "20px" }}>
        <LogoutButton className="profile-save-button" />
      </div>
    </div>
  );
};

export default ProfilePage;
