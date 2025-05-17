import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../firebase";
import { ToastContainer, toast } from "react-toastify";
import ToastContent from "../../components/ToastContent";
import Logo from "../../assets/logo.png";
import { showFirebaseError } from "../../utils/showFirebaseError";

import "react-toastify/dist/ReactToastify.css";

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.warn(<ToastContent title="ข้อมูลไม่ครบ" message="กรุณากรอกอีเมลของคุณ" />);
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      toast.success(<ToastContent title="ส่งอีเมลสำเร็จ" message="กรุณาตรวจสอบกล่องจดหมายของคุณ" />);
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
          <img src={Logo} alt="Tortor Logo" className="w-28 h-auto animate-fadeLogoIn" />
        </div>
        <h2 className="text-2xl font-bold text-center text-gray-800">ลืมรหัสผ่าน</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="กรอกอีเมลของคุณ"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 hover:scale-105 transition duration-200"
          >
            ส่งลิงก์รีเซ็ตรหัสผ่าน
          </button>
        </form>

        <div className="text-center text-sm">
          <p
            className="text-blue-600 font-medium cursor-pointer hover:underline"
            onClick={() => navigate("/login")}
          >
            กลับสู่หน้า Login
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
