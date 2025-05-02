import React from 'react';
import { FaArrowLeft } from "react-icons/fa";
import "@/styles/SearchSidebar.css";

interface SearchSidebarProps {
  onClose: () => void;
  history: { id: number; name: string }[];
}

const SearchSidebar: React.FC<SearchSidebarProps> = ({ onClose, history }) => {
  return (
    <div className="search-sidebar-overlay" onClick={onClose}>
      <div className="search-sidebar" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="search-sidebar-header">
          <button className="back-btn" onClick={onClose}>
            <FaArrowLeft />
          </button>
          <input
            type="text"
            className="search-input"
            placeholder="ค้นหาบน Facebook"
          />
        </div>

        {/* Content */}
        <div className="search-sidebar-content">
          <div className="search-recent-header">
            <span>ล่าสุด</span>
            <button className="edit-btn">แก้ไข</button>
          </div>
          {history.map((item) => (
            <div key={item.id} className="search-item">
              <img
                src={`https://i.pravatar.cc/40?img=${item.id}`}
                alt={item.name}
                className="avatar"
              />
              <div className="item-info">
                <span className="item-name">{item.name}</span>
                <span className="item-sub">9+ รายการใหม่</span>
              </div>
              <button className="remove-btn">✖</button>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default SearchSidebar;
