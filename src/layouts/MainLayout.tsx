import React from "react";
import Navbar from "../components/Navbar/Navbar";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <>
      <Navbar />
      <div
        className="layout-wrapper"
        style={{
          backgroundColor: "#18191a",
          height: "100vh",              // เปลี่ยนจาก minHeight
          overflow: "hidden",           // ปิด scroll หลัก
          paddingTop: "56px",
          display: "flex",
          flexDirection: "column"
        }}
      >
        {children}
      </div>
    </>
  );
};

export default MainLayout;
