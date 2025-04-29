import React from "react";
import "@/styles/RightSidebar.css";
import "@/styles/LeftSidebar.css";


const RightSidebar: React.FC = () => {
  return (
    <aside className="right-sidebar">
      {/* โฆษณา */}
      <div className="right-section">
        <h4>โฆษณา</h4>
        <img src="https://via.placeholder.com/150" alt="ad" className="right-ad" />
        <img src="https://via.placeholder.com/150" alt="ad" className="right-ad" />
      </div>

      {/* วันเกิด */}
      <div className="right-section">
        <h4>วันเกิด</h4>
        <p>วันนี้เป็นวันเกิดของ <strong>MarTae Phuengpheng</strong> 🎂</p>
      </div>

      {/* ผู้ติดต่อ */}
      <div className="right-section">
        <h4>ผู้ติดต่อ</h4>
        <ul className="contact-list">
          <li>Thanakorn Rawi</li>
          <li>Kit Ti</li>
          <li>Phakphum TN</li>
        </ul>
      </div>
    </aside>
  );
};

export default RightSidebar;
