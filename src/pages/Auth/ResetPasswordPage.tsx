import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { confirmPasswordReset } from "firebase/auth";
import { auth } from "../../firebase";
import { ToastContainer, toast } from "react-toastify";
import ToastContent from "../../components/ToastContent";
import Logo from "../../assets/logo.png";
import { showFirebaseError } from "../../utils/showFirebaseError";

import "react-toastify/dist/ReactToastify.css";

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-4 py-10">
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar />

      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 space-y-6 animate-fadeIn">
        <div className="flex justify-center">
          <img src={Logo} alt="Tortor Logo" className="w-28 h-auto animate-fadeLogoIn" />
        </div>
        <h2 className="text-2xl font-bold text-center text-gray-800">รีเซ็ตรหัสผ่านใหม่</h2>

        <form onSubmit={handleResetPassword} className="space-y-4">
          <input
            type="password"
            placeholder="รหัสผ่านใหม่"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="password"
            placeholder="ยืนยันรหัสผ่านใหม่"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 hover:scale-105 transition duration-200"
          >
            ตั้งรหัสผ่านใหม่
          </button>
        </form>

        <div className="text-center text-sm">
          <p
            className="text-blue-600 font-medium cursor-pointer hover:underline"
            onClick={() => navigate("/login")}
          >
            ย้อนกลับไปหน้าเข้าสู่ระบบ
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
