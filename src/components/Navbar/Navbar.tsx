import React, { useEffect, useState } from "react";
import {
  FaFacebook,
  FaHome,
  FaTv,
  FaStore,
  FaGamepad,
  FaBell,
  FaFacebookMessenger,
  FaSearch
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { auth, firestore } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";

import "@/styles/Navbar.css";
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
  { id: 10, name: "ข่าวสดออนไลน์" }
];

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const [profileUrl, setProfileUrl] = useState<string>("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const user = auth.currentUser;
      if (user) {
        const userRef = doc(firestore, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const data = userSnap.data();
          setProfileUrl(data.profileUrl || "");
        }
      }
    };
    fetchProfile();
  }, []);

  return (
    <>
      <nav className="fb-navbar">
        <div className="fb-navbar-container">
          <div className="fb-navbar-left">
            <FaFacebook className="fb-brand-icon" onClick={() => navigate("/home")} />
            {/* ช่องค้นหา เฉพาะ Desktop */}
            <div className="fb-search-desktop">
              <input
                type="text"
                placeholder="ค้นหาบน Facebook"
                className="fb-search-input"
              />
            </div>

            {/* ปุ่มค้นหา Mobile */}
            <FaSearch
              className="fb-search-icon-mobile"
              onClick={() => setIsSearchOpen(true)}
            />
          </div>

          <div className="fb-navbar-center">
            <FaHome className="fb-icon" onClick={() => navigate("/home")} />
            <FaTv className="fb-icon" />
            <FaStore className="fb-icon" />
            <FaGamepad className="fb-icon" />
          </div>

          <div className="fb-navbar-right">
            <FaFacebookMessenger className="fb-icon" />
            <FaBell className="fb-icon" />
            <img
              src={profileUrl || "https://i.pravatar.cc/150"}
              alt="profile"
              className="fb-profile-pic"
              onClick={() => navigate("/profile")}
            />
          </div>
        </div>
      </nav>

      {/* เปิด SearchSidebar */}
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
