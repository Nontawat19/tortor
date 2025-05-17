import React from "react";

const RightSidebar: React.FC = () => {
  return (
    <aside className="w-[280px] fixed top-[60px] right-0 h-[calc(100vh-60px)] bg-[#18191a] text-[#e4e6eb] p-5 overflow-y-auto hidden xl:block">
      {/* โฆษณา */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold mb-3">โฆษณา</h4>
        <div className="space-y-3">
          <img
            src="https://via.placeholder.com/150"
            alt="ad"
            className="w-full rounded-md shadow"
          />
          <img
            src="https://via.placeholder.com/150"
            alt="ad"
            className="w-full rounded-md shadow"
          />
        </div>
      </div>

      {/* วันเกิด */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold mb-2">วันเกิด</h4>
        <p className="text-sm leading-relaxed">
          วันนี้เป็นวันเกิดของ <strong>MarTae Phuengpheng</strong> 🎂
        </p>
      </div>

      {/* ผู้ติดต่อ */}
      <div>
        <h4 className="text-lg font-semibold mb-2">ผู้ติดต่อ</h4>
        <ul className="space-y-1 text-sm">
          <li>Thanakorn Rawi</li>
          <li>Kit Ti</li>
          <li>Phakphum TN</li>
        </ul>
      </div>
    </aside>
  );
};

export default RightSidebar;
