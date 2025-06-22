import React, { useState } from "react";
import { FiSearch } from "react-icons/fi";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import Overview from "./Overview";
import ProfileDoctor from "./ProfileDoctor";
const appointments = [
  {
    id: "APT009",
    name: "Mcdowell",
    type: "Direct Visit",
    time: "10:30AM",
    email: "mcdowell@test.com",
    phone: "9876543210",
    payment: "Paid",
    avatar: "https://randomuser.me/api/portraits/men/10.jpg",
  },
  {
    id: "APT242",
    name: "Johana",
    type: "Video Consultation",
    time: "11:00AM",
    email: "johana@test.com",
    phone: "9876543210",
    payment: "Paid",
    avatar: "https://randomuser.me/api/portraits/women/10.jpg",
  },
  {
    id: "APT037",
    name: "Braun",
    type: "Direct Visit",
    time: "11:30AM",
    email: "braun@test.com",
    phone: "9876543210",
    payment: "Paid",
    avatar: "https://randomuser.me/api/portraits/men/20.jpg",
  },
  {
    id: "APT028",
    name: "Raymon",
    type: "Video Consultation",
    time: "12:00PM",
    email: "raymon@test.com",
    phone: "9876543210",
    payment: "Paid",
    avatar: "https://randomuser.me/api/portraits/men/30.jpg",
  },
  {
    id: "APT024",
    name: "Jerald",
    type: "Video Consultation",
    time: "12:30PM",
    email: "jerald@test.com",
    phone: "9876543210",
    payment: "Pending",
    avatar: "https://randomuser.me/api/portraits/men/40.jpg",
  },
];

const AppointmentPage = () => {
  const [search, setSearch] = useState("");

  const filteredAppointments = appointments.filter((appt) =>
    appt.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* <Overview /> */}
      <ProfileDoctor />
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Appointments</h2>

          <div className="flex items-center gap-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 pr-4 py-2 border rounded-md text-sm outline-none"
              />
              <FiSearch className="absolute left-2 top-2.5 text-gray-400" />
            </div>
            <button className="bg-teal-500 text-white px-3 py-2 rounded-md text-sm">
              ≡
            </button>
            <button className="border border-gray-300 px-3 py-2 rounded-md text-sm">
              📅
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {filteredAppointments.map((appt) => (
            <div
              key={appt.id}
              className="flex items-center justify-between border rounded-lg p-4 hover:shadow-sm bg-white"
            >
              {/* Avatar + Info */}
              <div className="flex items-center gap-3">
                <img
                  src={appt.avatar}
                  alt={appt.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm text-teal-600 font-semibold">
                    #{appt.id}
                  </p>
                  <p className="font-semibold text-gray-800">{appt.name}</p>
                  <p className="text-sm text-gray-500">{appt.type}</p>
                </div>
              </div>

              {/* Time */}
              <div className="text-sm text-center text-gray-600">
                <p className="font-medium">Today</p>
                <p className="text-teal-600">{appt.time}</p>
              </div>

              {/* Contact */}
              <div className="text-sm text-center text-gray-600">
                <p>{appt.email}</p>
                <p className="flex items-center justify-center gap-1">
                  📞 {appt.phone}
                </p>
              </div>

              {/* Payment */}
              <div className="text-sm text-center">
                <p className="text-gray-600 font-medium">Payment</p>
                <p
                  className={
                    appt.payment === "Paid"
                      ? "text-green-600 font-bold"
                      : "text-yellow-500 font-bold"
                  }
                >
                  {appt.payment}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <FaCheckCircle className="text-green-500 text-lg cursor-pointer" />
                <FaTimesCircle className="text-red-400 text-lg cursor-pointer" />
              </div>

              {/* Details Button */}
              <button className="bg-teal-100 hover:bg-teal-200 text-teal-700 px-4 py-1.5 rounded-full text-sm font-medium transition">
                Details
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AppointmentPage;
