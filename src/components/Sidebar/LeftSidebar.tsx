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

const LeftSidebar = () => {
  const currentUser = useSelector((state: RootState) => state.auth.user);

  return (
    <div className="w-[280px] fixed top-[60px] left-0 h-[calc(100vh-60px)] bg-[#18191a] text-[#e4e6eb] p-5 overflow-y-auto hidden md:block">
      {/* โปรไฟล์ผู้ใช้ */}
      <Link
        to="/profile"
        className="flex items-center gap-3 mb-6 px-3 py-2 rounded-xl hover:bg-white/10 transition text-inherit no-underline"
      >
        <img
          src={currentUser?.profileUrl || defaultProfile}
          alt="Profile"
          className="w-10 h-10 rounded-full object-cover"
          onError={(e) => {
            e.currentTarget.src = defaultProfile;
          }}
        />
        <span className="font-bold">
          {currentUser?.fullName || "ไม่ทราบชื่อ"}
        </span>
      </Link>

      {/* เมนู */}
      <div className="flex flex-col gap-5">
        <div className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-[#3a3b3c] transition cursor-pointer">
          <FaUserFriends className="text-[20px]" />
          <span className="text-[16px]">เพื่อน</span>
        </div>
        <div className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-[#3a3b3c] transition cursor-pointer">
          <FaClock className="text-[20px]" />
          <span className="text-[16px]">ความทรงจำ</span>
        </div>
        <div className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-[#3a3b3c] transition cursor-pointer">
          <FaUsers className="text-[20px]" />
          <span className="text-[16px]">กลุ่ม</span>
        </div>
        <div className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-[#3a3b3c] transition cursor-pointer">
          <FaStore className="text-[20px]" />
          <span className="text-[16px]">Marketplace</span>
        </div>
      </div>
    </div>
  );
};

export default LeftSidebar;
