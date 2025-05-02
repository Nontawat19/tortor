import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { Link } from "react-router-dom";
import {
  FaUserFriends,
  FaClock,
  FaUsers,
  FaStore,
} from "react-icons/fa";

import defaultProfile from "@/assets/profile.png";
import "@/styles/LeftSidebar.css";

const LeftSidebar = () => {
  const currentUser = useSelector((state: RootState) => state.auth.user);

  return (
    <div className="left-sidebar">
      <Link to="/profile" className="left-profile">
        <img
          src={currentUser?.profileUrl || defaultProfile}
          alt="Profile"
          className="left-profile-pic"
          onError={(e) => {
            e.currentTarget.src = defaultProfile;
          }}
        />
        <span className="left-profile-name">
          {currentUser?.fullName || "ไม่ทราบชื่อ"}
        </span>
      </Link>

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
    </div>
  );
};

export default LeftSidebar;
