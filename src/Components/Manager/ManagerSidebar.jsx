import React from "react";
import { NavLink } from "react-router-dom";
import {
  LocalHospital,
  Group,
  Event,
  AccountBalance,
  AccountBox,
  Apartment,
  MonetizationOn,
  Hotel,
  LocalShipping,
  PhotoLibrary,
  Newspaper,
  Widgets,
  People,
} from "@mui/icons-material";

const sidebarItems = [
  { text: "Doctors", icon: <LocalHospital />, path: "/manager/doctors" },
  { text: "Patients", icon: <Group />, path: "/manager/doctorlist" },
  { text: "Staff", icon: <People />, path: "/manager/staff" },
  { text: "Appointments", icon: <Event />, path: "/manager/appointments" },
  { text: "Departments", icon: <Apartment />, path: "/manager/departments" },
  { text: "Accounts", icon: <AccountBalance />, path: "/manager/accounts" },
  { text: "Human Resources", icon: <AccountBox />, path: "/manager/hr" },
  { text: "Salaries", icon: <MonetizationOn />, path: "/manager/salaries" },
  { text: "Rooms", icon: <Hotel />, path: "/manager/rooms" },
  { text: "Ambulance", icon: <LocalShipping />, path: "/manager/ambulance" },
  { text: "Event Management", icon: <Event />, path: "/manager/events" },
  { text: "Gallery", icon: <PhotoLibrary />, path: "/manager/gallery" },
  { text: "News & Updates", icon: <Newspaper />, path: "/manager/news" },
  { text: "UI Elements", icon: <Widgets />, path: "/manager/ui" },
];

const ManagerSidebar = () => {
  return (
    <div className="w-64 h-screen bg-white border-r shadow-sm flex flex-col">
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

      <nav className="flex-1 overflow-y-auto">
        {sidebarItems.map((item) => (
          <NavLink
            key={item.text}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center p-3 text-gray-700 hover:bg-teal-50 rounded-lg transition-colors ${
                isActive ? "bg-teal-100 text-teal-600 font-medium" : ""
              }`
            }
          >
            <span className="mr-3 text-lg">{item.icon}</span>
            <span className="text-sm">{item.text}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default ManagerSidebar;
