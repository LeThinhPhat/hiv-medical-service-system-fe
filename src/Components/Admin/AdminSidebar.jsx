import React from "react";
import { useNavigate } from "react-router-dom";
import {
  HomeIcon,
  UsersIcon,
  ClipboardDocumentListIcon,
  ArchiveBoxIcon,
  CalendarDaysIcon,
  ArrowLeftOnRectangleIcon,
} from "@heroicons/react/24/outline";

const menuItems = [
  { text: "Users", icon: <UsersIcon className="w-6 h-6" />, path: "/admin/users" },
  { text: "Logout", icon: <ArrowLeftOnRectangleIcon className="w-6 h-6" />, path: "/signin", isLogout: true },
];

const AdminSidebar = () => {
  const navigate = useNavigate();

  const handleItemClick = (item) => {
    if (item.isLogout) {
      // ✅ Xử lý logout
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate(item.path); // Điều hướng về /signin
    } else {
      navigate(item.path);
    }
  };

  return (
    <div className="w-64 h-screen bg-white border-r border-gray-200 shadow-md flex flex-col">
      <div className="bg-[#00C2CB] p-5 text-center text-white font-semibold text-xl tracking-wide rounded-b-lg shadow">
        🏥 Admin
      </div>
      <ul className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map((item, index) => (
          <li
            key={index}
            onClick={() => handleItemClick(item)}
            className={`flex items-center space-x-4 p-3 rounded-lg cursor-pointer transition-all duration-200
              ${item.isLogout ? "hover:bg-red-50 text-red-500" : "hover:bg-[#e0f7fa] text-gray-800"}`}
          >
            <span className={`${item.isLogout ? "text-red-500" : "text-[#00C2CB]"}`}>{item.icon}</span>
            <span className="font-medium text-[15px]">{item.text}</span>
          </li>
        ))}
      </ul>
      <div className="p-4 text-xs text-gray-400 text-center">
        &copy; 2025 Clinic Management
      </div>
    </div>
  );
};

export default AdminSidebar;
