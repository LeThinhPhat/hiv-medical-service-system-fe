import React from "react";
import {
  FaClipboardList,
  FaFileMedical,
  FaCalendarPlus,
  FaCalendarCheck,
  FaStethoscope,
  FaUsers,
  FaIdCardAlt,
  FaUserMd,
  FaCalendarAlt,
  FaUserCircle,
  FaBusinessTime,
  FaUser,
  FaSignOutAlt,
} from "react-icons/fa";
import { MdOutlineDashboard, MdOutlineAnalytics } from "react-icons/md";
import { Link, useLocation, useNavigate } from "react-router-dom";

const DoctorSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    {
      section: "Dashboard",
      items: [
        {
          label: "Medical Dashboard",
          icon: <MdOutlineAnalytics />,
          path: "/medical-dashboard",
        },
        {
          label: "Doctors Dashboard",
          icon: <MdOutlineDashboard />,
          path: "/doctors-dashboard",
        },
      ],
    },
    {
      section: "Medical Records",
      items: [
        {
          label: "Medical List",
          icon: <FaClipboardList />,
          path: "/doctor/medicallist",
        },
        {
          label: "Create Medical",
          icon: <FaFileMedical />,
          path: "/doctor/medical",
        },
      ],
    },
    {
      section: "Appointments",
      items: [
        {
          label: "Appointments",
          icon: <FaCalendarPlus />,
          path: "/doctor/appointments",
        },
        {
          label: "Doctor Appointment",
          icon: <FaStethoscope />,
          path: "/doctor/doctorsappoinment",
        },
        {
          label: "Doctors Grid",
          icon: <FaUserMd />,
          path: "/doctors-grid",
        },
      ],
    },
    {
      section: "Patients",
      items: [
        {
          label: "My Patients",
          icon: <FaUsers />,
          path: "/doctor/my-patients",
        },
        {
          label: "Patient Profile",
          icon: <FaIdCardAlt />,
          path: "/doctor/patient-profile",
        },
      ],
    },
    {
      section: "Doctors",
      items: [
        {
          label: "Lịch làm việc",
          icon: <FaCalendarAlt />,
          path: "/doctor/calendar",
        },
        {
          label: "Hồ sơ cá nhân",
          icon: <FaUserCircle />,
          path: "/doctor/profile",
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
          Clinix
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

      {/* Footer Settings + Logout */}
      <div className="p-4 border-t border-teal-100 space-y-2">
        <Link to="/doctor/settings">
          <div className="flex items-center px-4 py-2 text-sm text-gray-600 hover:bg-teal-50 hover:text-teal-600 rounded-lg transition-colors">
            <FaUser className="mr-3" />
            Settings
          </div>
        </Link>

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
