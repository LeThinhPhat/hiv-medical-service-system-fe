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
  { text: "Dashboard", icon: <HomeIcon className="w-5 h-5" />, path: "/admin" },
  {
    text: "Users",
    icon: <UsersIcon className="w-5 h-5" />,
    path: "/admin/users",
  },
  {
    text: "Categories",
    icon: <ClipboardDocumentListIcon className="w-5 h-5" />,
    path: "/admin/categories",
  },
  {
    text: "Inventory",
    icon: <ArchiveBoxIcon className="w-5 h-5" />,
    path: "/admin/inventory",
  },
  {
    text: "Events",
    icon: <CalendarDaysIcon className="w-5 h-5" />,
    path: "/admin/events",
  },
  {
    text: "Logout",
    icon: <ArrowLeftOnRectangleIcon className="w-5 h-5" />,
    path: "/signin",
  },
];

const AdminSidebar = () => {
  const navigate = useNavigate();

  return (
    <div className="w-64 h-screen bg-[#AD9700] text-white shadow-lg flex flex-col">
      <div className="bg-[#00ABE1] p-4 text-center font-bold text-lg tracking-wide">
        Admin Panel
      </div>
      <ul className="flex-1 px-2 py-4 space-y-2">
        {menuItems.map((item, index) => (
          <li
            key={index}
            onClick={() => navigate(item.path)}
            className="flex items-center space-x-3 p-2 rounded-lg cursor-pointer hover:bg-yellow-300 hover:text-black transition-colors"
          >
            <span className="text-[#00ABE1]">{item.icon}</span>
            <span className="font-medium text-black">{item.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminSidebar;
