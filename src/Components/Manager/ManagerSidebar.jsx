import React from "react";
import { NavLink } from "react-router-dom";
import {
  LocalHospital,
  FormatListBulleted,
  Engineering,
  EventNote,
  AccountBox,
  MiscellaneousServices,
  Person,
  MonetizationOn,
  Hotel,
  LocalShipping,
  EventAvailable,
  PhotoLibrary,
  Newspaper,
  Widgets,
} from "@mui/icons-material";

const sidebarItems = [
  { text: "Doctors", icon: <LocalHospital />, path: "/manager/doctors" },
  {
    text: "Doctor List",
    icon: <FormatListBulleted />,
    path: "/manager/doctorlist",
  },
  { text: "Staff", icon: <Engineering />, path: "/manager/staff" },
  { text: "Appointments", icon: <EventNote />, path: "/manager/appointments" },
  { text: "Patients", icon: <AccountBox />, path: "/manager/patient" },
  {
    text: "Service",
    icon: <MiscellaneousServices />,
    path: "/manager/service",
  },
  { text: "User", icon: <Person />, path: "/manager/user" },
  { text: "Phát đồ ARV", icon: <Newspaper />, path: "/manager/arv" },
  { text: "Thuốc", icon: <Hotel />, path: "/manager/drugs" },
  { text: "Ambulance", icon: <LocalShipping />, path: "/manager/ambulance" },
  {
    text: "Event Management",
    icon: <EventAvailable />,
    path: "/manager/events",
  },
  { text: "Gallery", icon: <PhotoLibrary />, path: "/manager/gallery" },
  { text: "News & Updates", icon: <Newspaper />, path: "/manager/news" },
  { text: "UI Elements", icon: <Widgets />, path: "/manager/ui" },
];

const ManagerSidebar = () => {
  return (
    <div className="w-64 h-screen bg-white border-r shadow-sm flex flex-col">
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
        <h1 className="text-xl font-bold">Medflex</h1>
      </div>

      {/* Profile */}
      <div className="p-4 flex items-center border-b">
        <img
          src="https://randomuser.me/api/portraits/men/75.jpg"
          alt="Nick Gonzalez"
          className="w-12 h-12 rounded-full mr-3"
        />
        <div>
          <p className="font-semibold text-gray-800">Manager</p>
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
  );
};

export default ManagerSidebar;
