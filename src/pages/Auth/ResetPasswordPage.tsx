import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { confirmPasswordReset } from "firebase/auth";
import { auth } from "../../firebase";
import { ToastContainer, toast } from "react-toastify";
import ToastContent from "../../components/ToastContent";
import Logo from "../../assets/logo.png";
import { showFirebaseError } from "../../utils/showFirebaseError";

import "react-toastify/dist/ReactToastify.css";
import "../../styles/ResetPasswordPage.css";

const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [oobCode, setOobCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get("oobCode");
    if (code) {
      setOobCode(code);
    }
  }, [location.search]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      toast.warn(<ToastContent title="ข้อมูลไม่ครบ" message="กรุณากรอกรหัสผ่านใหม่ให้ครบ" />);
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error(<ToastContent title="รหัสผ่านไม่ตรงกัน" message="กรุณายืนยันรหัสผ่านอีกครั้ง" />);
      return;
    }

    try {
      await confirmPasswordReset(auth, oobCode, newPassword);
      toast.success(<ToastContent title="รีเซ็ตรหัสผ่านสำเร็จ" message="กำลังกลับไปหน้าเข้าสู่ระบบ..." />);
      setTimeout(() => navigate("/login"), 2500);
    } catch (error: any) {
      console.error(error);
      showFirebaseError(error);
    }
  };

  return (
    <div className="reset-password-container">
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

        <h2>รีเซ็ตรหัสผ่านใหม่</h2>

        <form onSubmit={handleResetPassword}>
          <input
            type="password"
            placeholder="รหัสผ่านใหม่"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="ยืนยันรหัสผ่านใหม่"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button type="submit">ตั้งรหัสผ่านใหม่</button>
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

export default ResetPasswordPage;
