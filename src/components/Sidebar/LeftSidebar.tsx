import React from "react";
import "@/styles/LeftSidebar.css";
import { FaUserFriends, FaClock, FaUsers, FaStore } from "react-icons/fa";

const LeftSidebar: React.FC = () => {
  return (
    <aside className="left-sidebar">
      {/* โปรไฟล์ */}
      <div className="left-profile">
        <img
          src="https://i.pravatar.cc/150"
          alt="Profile"
          className="left-profile-pic"
        />
        <span className="left-profile-name">Nonthawat Suwannabupha</span>
      </div>

      {/* เมนู */}
      <div className="left-menu">
        <div className="left-item">
          <FaUserFriends className="left-icon" />
          <span>เพื่อน</span>
        </div>
        <div className="left-item">
          <FaClock className="left-icon" />
          <span>ความทรงจำ</span>
        </div>
        <div className="left-item">
          <FaUsers className="left-icon" />
          <span>กลุ่ม</span>
        </div>
        <div className="left-item">
          <FaStore className="left-icon" />
          <span>Marketplace</span>
        </div>
      </div>
    </aside>
  );
};

export default LeftSidebar;
