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
      label: "MedicalList",
      icon: <MdDashboard />,
      path: "/doctor/medicallist",
    },
    {
      label: "Medical Dashboard",
      icon: <FaClipboardList />,
      path: "/medical-dashboard",
    },
    // {
    //   label: "Creata Medical",
    //   icon: <FaThLarge />,
    //   path: "/doctor/medical",
    // },
    {
      label: "Appointments",
      icon: <FaCalendarAlt />,
      path: "/doctor/appointments",
    },
    { label: "My Patients", icon: <IoMdPeople />, path: "/doctor/my-patients" },
    {
      label: "Patient Profile",
      icon: <AiFillIdcard />,
      path: "/doctor/patient-profile",
    },
    {
      label: "Doctors Dashboard",
      icon: <MdDashboard />,
      path: "/doctors-dashboard",
    },
    { label: "Doctors Grid", icon: <FaThLarge />, path: "/doctors-grid" },
    { label: "Doctors Cards", icon: <FaUserMd />, path: "/doctors-cards" },
    {
      label: "Doctors Profile",
      icon: <FaUser />,
      path: "/doctor/profile",
    },
    {
      label: "Doctor",
      icon: <FaPlus />,
      path: "/doctor/profile-doctor",
    },
    { label: "Doctor Slot", icon: <FaEdit />, path: "/doctor/doctorslot" },
    {
      label: "DoctorShedule",
      icon: <MdDashboard />,
      path: "/doctor/doctorschedule",
    },
    {
      label: "Doctor-Appointment",
      icon: <MdDashboard />,
      path: "/doctor/doctorsappoinment",
    },
  ];

  return (
    <div className="w-64 h-screen bg-white border-r shadow-sm">
      <div className="flex items-center px-6 py-4 border-b">
        <img
          src="https://cdn-icons-png.flaticon.com/512/6073/6073873.png"
          alt="Logo"
          className="w-10 h-10 mr-2"
        />
        <h1 className="text-xl font-bold text-gray-700">Clinix</h1>
      </div>

      <div className="flex flex-col items-center py-6 border-b">
        <img
          src="https://cdn-icons-png.flaticon.com/512/4140/4140037.png"
          alt="Admin"
          className="w-16 h-16 rounded-full mb-2"
        />
        <div className="text-center">
          <p className="text-sm text-gray-900 font-semibold">Nguyễn Văn A</p>
          <p className="text-xs text-gray-500">Quản trị viên bộ phận</p>
        </div>
      </div>

      <nav className="flex flex-col p-4 space-y-2">
        {menuItems.map((item) => (
          <SidebarItem
            key={item.label}
            icon={item.icon}
            label={item.label}
            path={item.path}
            active={location.pathname === item.path}
          />
        ))}
      </nav>
    </div>
  );
};

const SidebarItem = ({ icon, label, path, active }) => {
  return (
    <Link to={path}>
      <div
        className={`flex items-center px-4 py-2 rounded-lg cursor-pointer transition hover:bg-gray-100 ${
          active ? "bg-teal-100 text-teal-600 font-medium" : "text-gray-700"
        }`}
      >
        <div className="text-xl mr-3">{icon}</div>
        <span className="text-sm">{label}</span>
      </div>
    </Link>
  );
};

export default DoctorSidebar;
