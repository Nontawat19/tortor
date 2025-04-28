import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../firebase";
import { ToastContainer, toast } from "react-toastify";
import ToastContent from "../../components/ToastContent";
import Logo from "../../assets/logo.png";
import { showFirebaseError } from "../../utils/showFirebaseError";

import "react-toastify/dist/ReactToastify.css";
import "../../styles/ForgotPasswordPage.css";

const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.warn(<ToastContent title="ข้อมูลไม่ครบ" message="กรุณากรอกอีเมลของคุณ" />);
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      toast.success(<ToastContent title="ส่งลิงก์สำเร็จ" message="โปรดตรวจสอบกล่องอีเมลของคุณ" />);
      setTimeout(() => navigate("/login"), 3000);
    } catch (error: any) {
      console.error(error);
      showFirebaseError(error);
    }
  };

  return (
    <div className="forgot-password-container">
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

      <div className="login-card"> {/* ✅ ใช้ login-card */}
        <div className="logo-container">
          <img src={Logo} alt="Tortor Logo" className="logo-image" />
        </div>

        <h2>ลืมรหัสผ่าน</h2>

        <form onSubmit={handleForgotPassword}>
          <input
            type="email"
            placeholder="กรอกอีเมลของคุณ"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit">ส่งลิงก์รีเซ็ตรหัสผ่าน</button>
        </form>

        <div className="link-container">
          <p className="link-text" onClick={() => navigate("/login")}>
            ย้อนกลับไปหน้า <span>เข้าสู่ระบบ</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
