import React from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase";

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate("/login"); // ✅ ออกจากระบบแล้วไปหน้า Login
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการออกจากระบบ:", error);
    }
  };

  return (
    <div className="home-container">
      <h1>ยินดีต้อนรับสู่หน้า Home 🎉</h1>

      <button onClick={handleLogout} style={{ marginTop: "20px", padding: "10px 20px", fontSize: "16px" }}>
        ออกจากระบบ
      </button>
    </div>
  );
};

export default HomePage;
