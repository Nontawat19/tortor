import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

import { MdDashboardCustomize } from "react-icons/md";
import { PiVideoFill } from "react-icons/pi";
import { RiShoppingBag2Fill } from "react-icons/ri";
import { FaFireAlt, FaBell } from "react-icons/fa";
import { BsChatDotsFill } from "react-icons/bs";
import { FiSearch, FiGlobe } from "react-icons/fi";

import defaultProfile from "@/assets/profile.png";
import SearchSidebar from "@/components/SearchSidebar/SearchSidebar";

const mockSearchHistory = [
  { id: 1, name: "โรงเรียนบ้านแก้วปัดโป่ง" },
  { id: 2, name: "Arisa" },
  { id: 3, name: "Garena RoV Thailand" },
  { id: 4, name: "อบต. ไชยบุรี" },
  { id: 5, name: "Garena : ROV Thailand" },
  { id: 6, name: "เชฟ กระทะล้าง" },
  { id: 7, name: "Jane Waraphon" },
  { id: 8, name: "แลกผู้ติดตาม" },
  { id: 9, name: "เพจรีวิวคาเฟ่" },
  { id: 10, name: "ข่าวสดออนไลน์" },
];

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeIcon, setActiveIcon] = useState<string>("");

  const currentUser = useSelector((state: RootState) => state.auth.user);
  const profileUrl = currentUser?.profileUrl || defaultProfile;

  const handleIconClick = (icon: string, path?: string) => {
    setActiveIcon(icon);
    if (path) navigate(path);
  };

  const iconClass = (name: string) =>
    `transition duration-200 cursor-pointer w-[26px] h-[26px] text-[#b0b3b8] hover:text-white hover:scale-110 ${
      activeIcon === name ? "text-sky-400 scale-125" : ""
    }`;

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 h-[60px] bg-zinc-900/75 backdrop-blur-md rounded-b-xl z-[999] shadow-md px-4 flex justify-center items-center transition-all duration-300">
        <div className="w-full max-w-[1440px] flex justify-between items-center gap-3 px-2">
          {/* Left */}
          <div className="flex items-center gap-4">
            <FiGlobe
              className="w-[30px] h-[30px] text-sky-400 hover:text-white cursor-pointer"
              onClick={() => navigate("/home")}
            />
            <div className="hidden md:block">
              <input
                type="text"
                placeholder="ค้นหาบนแอป"
                className="bg-white/10 hover:bg-white/20 text-white text-sm rounded-full px-4 py-1.5 outline-none transition w-[200px] focus:bg-white/20"
              />
            </div>
            <FiSearch
              className="md:hidden w-[26px] h-[26px] text-[#b0b3b8] bg-white/10 p-1.5 rounded-full hover:bg-white/20 hover:text-white cursor-pointer"
              onClick={() => setIsSearchOpen(true)}
            />
          </div>

          {/* Center Icons */}
          <div className="flex items-center gap-6 sm:gap-4">
            <MdDashboardCustomize
              className={iconClass("dashboard")}
              onClick={() => handleIconClick("dashboard", "/dashboard")}
            />
            <PiVideoFill
              className={iconClass("video")}
              onClick={() => handleIconClick("video", "/videos")}
            />
            <RiShoppingBag2Fill
              className={iconClass("shop")}
              onClick={() => handleIconClick("shop", "/shop")}
            />
            <FaFireAlt
              className={iconClass("trending")}
              onClick={() => handleIconClick("trending", "/trending")}
            />
            <BsChatDotsFill
              className={iconClass("chat")}
              onClick={() => handleIconClick("chat", "/messages")}
            />
            <FaBell
              className={iconClass("notify")}
              onClick={() => handleIconClick("notify", "/notifications")}
            />
          </div>

          {/* Profile Picture */}
          <div className="flex items-center">
            <img
              src={profileUrl}
              alt="profile"
              className="w-[36px] h-[36px] rounded-full object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
              onClick={() => handleIconClick("profile", "/profile")}
              onError={(e) => {
                e.currentTarget.src = defaultProfile;
              }}
            />
          </div>
        </div>
      </nav>

      {/* Search Sidebar */}
      {isSearchOpen && (
        <SearchSidebar
          onClose={() => setIsSearchOpen(false)}
          history={mockSearchHistory}
        />
      )}
    </>
  );
};

export default Navbar;
