import React from "react";
import Navbar from "../components/Navbar/Navbar";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <>
      <Navbar />
      <div style={{ 
        paddingTop: "40px", 
        backgroundColor: "#18191a", 
        minHeight: "100vh",
        width: "100%",
        maxWidth: "120%",
        margin: 0,
        padding: 0,
        boxSizing: "border-box",
        overflowX: "hidden"
      }}>
        {children}
      </div>
    </>
  );
};

export default MainLayout;
