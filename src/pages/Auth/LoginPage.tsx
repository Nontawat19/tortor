import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, FacebookAuthProvider, signInWithPopup } from "firebase/auth"; // ✅ เพิ่ม FacebookAuthProvider
import { auth } from "../../firebase";
import { ToastContainer, toast } from "react-toastify";
import ToastContent from "../../components/ToastContent";
import Logo from "../../assets/logo.png";
import { showFirebaseError } from "../../utils/showFirebaseError";

import "react-toastify/dist/ReactToastify.css";
import "../../styles/LoginPage.css";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.warn(<ToastContent title="ข้อมูลไม่ครบ" message="กรุณากรอกอีเมลและรหัสผ่าน" />);
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      setTimeout(() => {
        navigate("/home", { state: { fromLogin: true } });
      }, 300);
    } catch (error: any) {
      console.error(error);
      showFirebaseError(error);
    }
  };

  const handleFacebookLogin = async () => {
    const provider = new FacebookAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      navigate("/home", { state: { fromLogin: true } });
    } catch (error: any) {
      console.error(error);
      showFirebaseError(error);
    }
  };

  return (
    <div className="login-container">
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

      <div className="login-card">
        <div className="logo-container">
          <img src={Logo} alt="Tortor Logo" className="logo-image" />
        </div>

        <h2>เข้าสู่ระบบ</h2>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="อีเมล"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="รหัสผ่าน"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">เข้าสู่ระบบ</button>
        </form>

        {/* ✅ ปุ่ม Facebook Login */}
        <button type="button" className="facebook-login-button" onClick={handleFacebookLogin}>
          เข้าสู่ระบบด้วย Facebook
        </button>

        <div className="link-container">
          <p className="link-text" onClick={() => navigate("/register")}>
            ยังไม่มีบัญชีผู้ใช้? <span>สมัครสมาชิก</span>
          </p>
          <p className="link-text" onClick={() => navigate("/forgot-password")}>
            ลืมรหัสผ่าน? <span>รีเซ็ตรหัสผ่าน</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
