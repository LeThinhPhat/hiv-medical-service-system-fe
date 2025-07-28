import React, { useState } from "react";
import {
  FaChartLine,
  FaFileAlt,
  FaCalendarAlt,
  FaComments,
} from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { IoIosArrowDown } from "react-icons/io";
import { FiLogOut } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";

const navItems = [
  {
    label: "Dashboard",
    icon: <MdDashboard className="text-xl" />,
    path: "/staff/dashboard",
  },
  {
    label: "Cuộc hẹn chờ duyệt",
    icon: <MdDashboard className="text-xl" />,
    path: "/staff/pending-appointments",
  },
  {
    label: "Cuộc hẹn ẩn danh",
    icon: <FaComments className="text-xl" />,
    path: "/staff/anonymous-appointments",
  },
  {
    label: "Check-in",
    icon: <FaChartLine className="text-xl" />,
    path: "/staff/checkin",
  },
  {
    label: "Danh sách lịch hẹn",
    icon: <FaFileAlt className="text-xl" />,
    path: "/staff/appointmentlist",
  },
  {
    label: "Thời Khóa biểu",
    icon: <FaCalendarAlt className="text-xl" />,
    path: "/staff/schedule",
  },
  {
    label: "Content",
    icon: <FaComments className="text-xl" />,
    path: "/staff/content",
    // hasDropdown: true,
    // subItems: [
    //   { label: "Bài viết", path: "/staff/content/posts" },
    //   { label: "Thông báo", path: "/staff/content/notifications" },
    // ],
  },
];

const StaffSidebar = () => {
  const navigate = useNavigate();
  const [openDropdown, setOpenDropdown] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/signin");
  };

  const toggleDropdown = (index) => {
    setOpenDropdown(openDropdown === index ? null : index);
  };

  return (
    <aside className="w-64 min-h-screen bg-gradient-to-b from-blue-50 to-gray-100 shadow-2xl flex flex-col transition-all duration-300">
      {/* Logo Section */}
      <div className="px-6 py-8 flex items-center justify-center border-b border-gray-200/50 bg-white/50 backdrop-blur-sm">
        <div className="flex items-center space-x-3">
          <FaChartLine className="text-3xl text-blue-600 animate-pulse" />
          <h1 className="text-2xl font-extrabold text-gray-800 tracking-tight">
            STAFF
          </h1>
        </div>
      </div>

      {/* Navigation Section */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item, index) => (
          <SidebarLink
            key={index}
            icon={item.icon}
            label={item.label}
            to={item.path}
            hasDropdown={item.hasDropdown}
            subItems={item.subItems}
            isOpen={openDropdown === index}
            onToggle={() => toggleDropdown(index)}
          />
        ))}
      </nav>

      {/* Logout Button */}
      <div
        onClick={handleLogout}
        className="mx-4 mb-4 flex items-center justify-between px-4 py-3 rounded-xl bg-red-50/50 text-red-600 hover:bg-red-100 hover:text-red-700 transition-all duration-300 ease-in-out cursor-pointer group"
      >
        <div className="flex items-center space-x-3">
          <FiLogOut className="text-xl text-red-500 group-hover:text-red-600 transition-colors duration-200" />
          <span className="text-sm font-medium">Đăng xuất</span>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </aside>
  );
};

const SidebarLink = ({
  icon,
  label,
  to,
  hasDropdown,
  subItems,
  isOpen,
  onToggle,
}) => (
  <div>
    <Link
      to={to}
      onClick={hasDropdown ? onToggle : undefined}
      className="flex items-center justify-between px-4 py-3 rounded-xl text-gray-600 hover:bg-blue-100 hover:text-blue-700 transition-all duration-300 ease-in-out group"
    >
      <div className="flex items-center space-x-3">
        <span className="text-gray-500 group-hover:text-blue-600 transition-colors duration-200">
          {icon}
        </span>
        <span className="text-sm font-medium">{label}</span>
      </div>
      {hasDropdown && (
        <IoIosArrowDown
          className={`text-gray-400 group-hover:text-blue-600 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      )}
    </Link>
    {hasDropdown && isOpen && (
      <div className="ml-8 mt-1 space-y-1 animate-fade-in">
        {subItems.map((subItem, index) => (
          <Link
            key={index}
            to={subItem.path}
            className="flex items-center px-4 py-2 rounded-lg text-gray-500 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 text-sm"
          >
            <span className="w-5 h-5 mr-2 flex items-center justify-center">
              <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
            </span>
            {subItem.label}
          </Link>
        ))}
      </div>
    )}
  </div>
);

export default StaffSidebar;
