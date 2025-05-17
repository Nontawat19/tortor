import React, { useEffect, useRef, useState } from "react";
import { FaGlobeAsia, FaUserFriends, FaLock, FaChevronDown } from "react-icons/fa";

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
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const current = options.find((opt) => opt.value === value);

  return (
    <div className="relative inline-block" ref={ref}>
      <button
        className="bg-[#3a3b3c] text-[#e4e6eb] text-sm px-3 py-[6px] rounded-full flex items-center gap-2 hover:bg-[#4e4f50] transition"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {current?.icon} {current?.label} <FaChevronDown size={12} />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-2 bg-[#242526] rounded-xl shadow-xl py-2 min-w-[180px]">
          {options.map((opt) => (
            <div
              key={opt.value}
              className="px-4 py-2 text-sm text-[#e4e6eb] flex items-center gap-2 hover:bg-[#3a3b3c] cursor-pointer transition"
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
