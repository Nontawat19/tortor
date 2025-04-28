import React, { ReactNode } from "react"; // ✅ Import ReactNode มาใช้
import { Navigate } from "react-router-dom";
import { auth } from "../firebase";

interface ProtectedRouteProps {
  children: ReactNode; // ✅ เปลี่ยนจาก JSX.Element เป็น ReactNode
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const user = auth.currentUser;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>; // ✅ ต้องครอบ children ด้วย Fragment
};

export default ProtectedRoute;
