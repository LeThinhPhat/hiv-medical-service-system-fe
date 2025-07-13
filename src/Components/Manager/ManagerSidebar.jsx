import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  CalendarToday,
  FormatListBulleted,
  Groups,
  EventNote,
  People,
  MiscellaneousServices,
  Person,
  MedicalServices,
  Medication,
  CalendarMonth,
  Logout,
} from "@mui/icons-material";

const sidebarItems = [
  {
    text: "Lịch làm việc bác sĩ",
    icon: <CalendarToday />,
    path: "/manager/doctors",
  },
  {
    text: "Doctor List",
    icon: <FormatListBulleted />,
    path: "/manager/doctorlist",
  },
  // { text: "Staff", icon: <Groups />, path: "/manager/staff" },
  { text: "Appointments", icon: <EventNote />, path: "/manager/appointments" },
  { text: "Patients", icon: <People />, path: "/manager/patient" },
  {
    text: "Service",
    icon: <MiscellaneousServices />,
    path: "/manager/service",
  },
  { text: "Phát đồ ARV", icon: <MedicalServices />, path: "/manager/arv" },
  { text: "Thuốc", icon: <Medication />, path: "/manager/drugs" },
  { text: "Lịch làm việc", icon: <CalendarMonth />, path: "/manager/schedule" },
];

const ManagerSidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Xoá token (nếu có)
    localStorage.removeItem("token");

    // Điều hướng về trang đăng nhập
    navigate("/signin");
  };

  return (
    <div className="w-64 h-screen bg-white border-r shadow-sm flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center p-4 bg-teal-600 text-white">
          <svg
            className="w-6 h-6 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
          <h1 className="text-xl font-bold">Manager</h1>
        </div>

        {/* Profile */}
        <div className="p-4 flex items-center border-b">
          <img
            src="https://static.vecteezy.com/system/resources/previews/014/194/219/non_2x/businessman-manager-boss-man-an-office-worker-illustration-flat-design-vector.jpg"
            alt="Manager"
            className="w-12 h-12 rounded-full mr-3"
          />
          <div>
            <p className="font-semibold text-gray-800">Profile</p>
          </div>
        </div>

        {/* Sidebar navigation */}
        <nav className="flex-1 overflow-y-auto p-2">
          {sidebarItems.map((item) => (
            <NavLink
              key={item.text}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 p-3 my-1 rounded-lg transition-colors
                ${
                  isActive
                    ? "bg-teal-100 text-teal-700 font-semibold border-l-4 border-teal-500"
                    : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              <span className="text-lg">{item.icon}</span>
              <span className="text-sm">{item.text}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Logout button */}
      <div className="p-4 border-t">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 text-red-600 hover:text-white hover:bg-red-500 px-4 py-2 rounded-lg transition"
        >
          <Logout />
          <span className="text-sm font-semibold">Đăng xuất</span>
        </button>
      </div>
    </div>
  );
};

export default ManagerSidebar;
