import React from "react";
import {
  FaUserMd,
  FaCalendarAlt,
  FaClipboardList,
  FaThLarge,
  FaUser,
  FaEdit,
  FaPlus,
} from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { IoMdPeople } from "react-icons/io";
import { AiFillIdcard } from "react-icons/ai";
import { Link, useLocation } from "react-router-dom";

const DoctorSidebar = () => {
  const location = useLocation();

  const menuItems = [
    {
      section: "Dashboard",
      items: [
        {
          label: "Medical Dashboard",
          icon: <FaClipboardList />,
          path: "/medical-dashboard",
        },
        {
          label: "Doctors Dashboard",
          icon: <MdDashboard />,
          path: "/doctors-dashboard",
        },
      ],
    },
    {
      section: "Medical Records",
      items: [
        {
          label: "Medical List",
          icon: <MdDashboard />,
          path: "/doctor/medicallist",
        },
        {
          label: "Create Medical",
          icon: <FaThLarge />,
          path: "/doctor/medical",
        },
      ],
    },
    {
      section: "Appointments",
      items: [
        {
          label: "Appointments",
          icon: <FaPlus />,
          path: "/doctor/appointments",
        },
        {
          label: "Doctor Schedule",
          icon: <FaEdit />,
          path: "/doctor/doctorschedule",
        },
        {
          label: "Doctor Appointment",
          icon: <FaCalendarAlt />,
          path: "/doctor/doctorsappoinment",
        },
      ],
    },
    {
      section: "Patients",
      items: [
        {
          label: "My Patients",
          icon: <IoMdPeople />,
          path: "/doctor/my-patients",
        },
        {
          label: "Patient Profile",
          icon: <AiFillIdcard />,
          path: "/doctor/patient-profile",
        },
      ],
    },
    {
      section: "Doctors",
      items: [
        {
          label: "Doctors Grid",
          icon: <FaThLarge />,
          path: "/doctors-grid",
        },
        {
          label: "Doctors Cards",
          icon: <FaUserMd />,
          path: "/doctors-cards",
        },
        {
          label: "Doctor Profile",
          icon: <FaUser />,
          path: "/doctor/profile",
        },
        {
          label: "Doctor Slot",
          icon: <FaEdit />,
          path: "/doctor/doctorslot",
        },
      ],
    },
  ];

  return (
    <div className="w-64 h-screen bg-gradient-to-b from-teal-50 to-white border-r shadow-lg flex flex-col transition-all duration-300">
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
      <div className="p-4 border-t border-teal-100">
        <Link to="/doctor/settings">
          <div className="flex items-center px-4 py-2 text-sm text-gray-600 hover:bg-teal-50 hover:text-teal-600 rounded-lg transition-colors">
            <FaUser className="mr-3" />
            Settings
          </div>
        </Link>
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
