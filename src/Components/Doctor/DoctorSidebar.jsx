import React from "react";
import {
  FaCalendarPlus,
  FaCalendarCheck,
  FaStethoscope,
  FaUsers,
  FaIdCardAlt,
  FaCalendarAlt,
  FaUserCircle,
  FaBusinessTime,
  FaSignOutAlt,
} from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";

const DoctorSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    {
      section: "Danh dách cuộc hẹn",
      items: [
        {
          label: "Danh sách cuộc hẹn",
          icon: <FaCalendarPlus />,
          path: "/doctor/doctorsappoinment",
        },
        {
          label: "Danh sách bệnh nhân",
          icon: <FaStethoscope />,
          path: "/doctor/appointments",
        },
      ],
    },
    // {
    //   section: "Patients",
    //   items: [
    //     {
    //       label: "My Patients",
    //       icon: <FaUsers />,
    //       path: "/doctor/my-patients",
    //     },
    //     // {
    //     //   label: "Patient Profile",
    //     //   icon: <FaIdCardAlt />,
    //     //   path: "/doctor/patient-profile",
    //     // },
    //   ],
    // },
    {
      section: "Bác sĩ",
      items: [
        {
          label: "Hồ sơ cá nhân",
          icon: <FaUserCircle />,
          path: "/doctor/profile",
        },
        {
          label: "Lịch làm việc",
          icon: <FaCalendarAlt />,
          path: "/doctor/calendar",
        },

        {
          label: "Ca làm việc",
          icon: <FaBusinessTime />,
          path: "/doctor/doctorslot",
        },
        {
          label: "Xác nhận lịch làm việc",
          icon: <FaCalendarCheck />,
          path: "/doctor/doctorschedule",
        },
      ],
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/signin");
  };

  return (
    <div className="w-64 h-screen bg-gradient-to-b from-teal-50 to-white border-r shadow-lg flex flex-col transition-all duration-300">
      {/* Logo */}
      <div className="flex items-center px-6 py-4 border-b border-teal-100">
        <img
          src="https://cdn-icons-png.flaticon.com/512/6073/6073873.png"
          alt="Logo"
          className="w-12 h-12 mr-3 transform hover:scale-105 transition-transform"
        />
        <h1 className="text-2xl font-extrabold text-teal-600 tracking-tight">
          Doctor
        </h1>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4 overflow-y-auto">
        {menuItems.map((section, index) => (
          <div key={index} className="mb-6">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 mb-2">
              {section.section}
            </h2>
            {section.items.map((item) => (
              <SidebarItem
                key={item.label}
                icon={item.icon}
                label={item.label}
                path={item.path}
                active={location.pathname === item.path}
              />
            ))}
          </div>
        ))}
      </nav>

      {/* Footer - Logout */}
      <div className="p-4 border-t border-teal-100">
        <div
          onClick={handleLogout}
          className="flex items-center px-4 py-2 text-sm text-red-500 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors cursor-pointer"
        >
          <FaSignOutAlt className="mr-3" />
          Đăng xuất
        </div>
      </div>
    </div>
  );
};

const SidebarItem = ({ icon, label, path, active }) => {
  return (
    <Link to={path}>
      <div
        className={`flex items-center px-4 py-3 mx-2 rounded-lg cursor-pointer transition-all duration-200 transform hover:scale-[1.02] hover:bg-teal-50 ${
          active
            ? "bg-teal-100 text-teal-700 font-semibold shadow-sm"
            : "text-gray-600"
        }`}
      >
        <div className="text-lg mr-3">{icon}</div>
        <span className="text-sm font-medium">{label}</span>
      </div>
    </Link>
  );
};

export default DoctorSidebar;
