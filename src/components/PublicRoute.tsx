import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from "react-router-dom";
import { auth } from "../firebase";

interface PublicRouteProps {
  children: React.ReactNode;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const location = useLocation();
  const [user, setUser] = useState<null | object>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>กำลังโหลด...</div>;
  }

  // ✅ อย่า redirect ถ้าอยู่ที่ /register
  if (user && location.pathname !== "/register") {
    return <Navigate to="/home" replace />;
  }

  return <>{children}</>;
};

export default PublicRoute;
