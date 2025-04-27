import "@/styles/LoginPage.css";
import React, { useState } from "react";
import "@/styles/LoginPage.css";
import { auth } from "@/services/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

// นำเข้าภาพโลโก้
import Logo from "@/assets/logo.png"; // **ตรงนี้คุณต้องเอารูปไปไว้ใน src/assets/** แล้วตั้งชื่อเช่น logo.png

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/home"); 
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        
        {/* โลโก้และข้อความ */}
        <div className="logo-container">
          <img src={Logo} alt="Tortor Logo" className="logo-image" />
        </div>

        <h2>Login</h2>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
        </form>

      </div>
    </div>
  );
};

export default LoginPage;
