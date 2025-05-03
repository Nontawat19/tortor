import React, { useEffect, useRef, useState } from "react";
import { FaGlobeAsia, FaUserFriends, FaLock, FaChevronDown } from "react-icons/fa";
import "@/styles/postcreator/PrivacySelector.css";

const options = [
  { label: "สาธารณะ", icon: <FaGlobeAsia />, value: "public" },
  { label: "ผู้ติดตาม", icon: <FaUserFriends />, value: "followers" },
  { label: "เฉพาะฉัน", icon: <FaLock />, value: "private" },
];

interface Props {
  value: string;
  onChange: (value: string) => void;
}

const PrivacySelector: React.FC<Props> = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null); // ✅ สำหรับตรวจจับ click นอก

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false); // ✅ ปิด dropdown เมื่อคลิกข้างนอก
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const current = options.find((opt) => opt.value === value);

  return (
    <div className="privacy-selector" ref={ref}>
      <button className="privacy-button" onClick={() => setIsOpen((prev) => !prev)}>
        {current?.icon} {current?.label} <FaChevronDown />
      </button>

      {isOpen && (
        <div className="dropdown-menu">
          {options.map((opt) => (
            <div
              key={opt.value}
              className="dropdown-option"
              onClick={() => {
                onChange(opt.value);
                setIsOpen(false);
              }}
            >
              {opt.icon} {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PrivacySelector;
