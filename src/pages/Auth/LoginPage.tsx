import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth, firestore } from "../../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import ToastContent from "../../components/ToastContent";
import Logo from "../../assets/logo.png";
import { showFirebaseError } from "../../utils/showFirebaseError";
import { SiGoogle } from "react-icons/si";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.warn(
        <ToastContent title="ข้อมูลไม่ครบ" message="กรุณากรอกอีเมลและรหัสผ่าน" />
      );
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

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const uid = user.uid;

      const userDocRef = doc(firestore, "users", uid);
      const userDocSnap = await getDoc(userDocRef);

      if (!userDocSnap.exists()) {
        await setDoc(userDocRef, {
          fullName: user.displayName || "",
          email: user.email || "",
          profileUrl: user.photoURL || "",
          createdAt: Date.now(),
        });
      }

      navigate("/home", { state: { fromLogin: true } });
    } catch (error: any) {
      console.error(error);
      showFirebaseError(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar />

      <div className="bg-white w-full max-w-md rounded-2xl p-8 sm:p-10 shadow-2xl relative animate-fadeIn">
        <div className="flex justify-center mb-4">
          <img src={Logo} alt="Logo" className="w-28 h-auto animate-fadeLogoIn" />
        </div>

        <h2 className="text-2xl font-bold text-center text-indigo-900 mb-6">เข้าสู่ระบบ</h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="อีเมล"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-lg bg-gray-100 border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="password"
            placeholder="รหัสผ่าน"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-lg bg-gray-100 border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 hover:-translate-y-[2px] transition-all duration-200"
          >
            เข้าสู่ระบบ
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center text-gray-400 text-sm my-5">
          <div className="flex-grow h-px bg-gray-300" />
          <span className="px-4">หรือ</span>
          <div className="flex-grow h-px bg-gray-300" />
        </div>

        {/* Google Login */}
        <button
          type="button"
          className="w-full py-3 px-6 bg-white border border-gray-300 rounded-lg shadow-sm text-gray-700 text-sm font-medium flex items-center justify-center gap-2 hover:bg-gray-50 hover:-translate-y-[1px] transition-all"
          onClick={handleGoogleLogin}
        >
          <SiGoogle className="text-red-500 text-xl" />
          เข้าสู่ระบบด้วย Google
        </button>

        {/* Links */}
        <div className="mt-6 flex flex-wrap justify-center items-center gap-3 text-sm">
          <p
            className="text-indigo-600 font-medium hover:underline cursor-pointer"
            onClick={() => navigate("/register")}
          >
            ยังไม่มีบัญชีผู้ใช้? <span className="font-bold">สมัครสมาชิก</span>
          </p>
          <span className="text-gray-400 font-semibold hidden sm:inline">|</span>
          <p
            className="text-indigo-600 font-medium hover:underline cursor-pointer"
            onClick={() => navigate("/forgot-password")}
          >
            ลืมรหัสผ่าน? <span className="font-bold">รีเซ็ตรหัสผ่าน</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
