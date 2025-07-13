import React from "react";
import {
  FaChartLine,
  FaFileAlt,
  FaCalendarAlt,
  FaComments,
  FaThLarge,
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
    label: "Check-in",
    icon: <FaChartLine className="text-xl" />,
    path: "/staff/checkin",
  },
  {
    label: "Appointment List",
    icon: <FaFileAlt className="text-xl" />,
    path: "/staff/appointmentlist",
  },
  {
    label: "Schedule",
    icon: <FaCalendarAlt className="text-xl" />,
    path: "/staff/schedule",
  },
  {
    label: "Content",
    icon: <FaComments className="text-xl" />,
    path: "/staff/content",
  },
 
];

const StaffSidebar = () => {
  const navigate = useNavigate(); // ✅ Sử dụng hook này

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/signin"); // ✅ Điều hướng nội bộ, không reload
  };

  return (
    <aside className="w-64 min-h-screen bg-gradient-to-b from-gray-50 to-white shadow-xl flex flex-col transition-all duration-300">
      {/* Logo Section */}
      <div className="px-6 py-8 flex items-center justify-center border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <FaChartLine className="text-2xl text-blue-600" />
          <h1 className="text-2xl font-extrabold text-gray-800 tracking-tight">
            STAFF
          </h1>
        </div>
      </div>

      {/* Navigation Section */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {navItems.map((item, index) => (
          <SidebarLink
            key={index}
            icon={item.icon}
            label={item.label}
            to={item.path}
            hasDropdown={item.hasDropdown}
          />
        ))}

        {/* Logout Button */}
        <div
          onClick={handleLogout}
          className="flex items-center justify-between px-4 py-3 rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200 ease-in-out cursor-pointer group"
        >
          <div className="flex items-center space-x-3">
            <FiLogOut className="text-gray-500 group-hover:text-red-600" />
            <span className="text-sm font-medium">Đăng xuất</span>
          </div>
        </div>
      </nav>
    </aside>
  );
};

const SidebarLink = ({ icon, label, to, hasDropdown }) => (
  <Link
    to={to}
    className="flex items-center justify-between px-4 py-3 rounded-lg text-gray-600 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 ease-in-out group"
  >
    <div className="flex items-center space-x-3">
      <span className="text-gray-500 group-hover:text-blue-600">{icon}</span>
      <span className="text-sm font-medium">{label}</span>
    </div>
    {hasDropdown && (
      <IoIosArrowDown className="text-gray-400 group-hover:text-blue-600 transition-transform duration-200 group-hover:rotate-180" />
    )}
  </Link>
);

export default StaffSidebar;
