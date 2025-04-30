import React from "react";
import Navbar from "../components/Navbar/Navbar";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <>
      <Navbar />
      <div className="layout-wrapper">
        {children}
      </div>
    </>
  );
};

export default MainLayout;
