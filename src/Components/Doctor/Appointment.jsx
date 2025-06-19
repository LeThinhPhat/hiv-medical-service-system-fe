import React, { useState } from "react";
import {
  FaPhone,
  FaEnvelope,
  FaVideo,
  FaCalendarAlt,
  FaCheck,
  FaTimes,
  FaComments,
} from "react-icons/fa";
import { AiOutlineSearch } from "react-icons/ai";
import { FiGrid, FiList } from "react-icons/fi";

const appointmentsData = [
  {
    id: "APT009",
    name: "Mcdowell",
    method: "Direct Visit",
    time: "10:30AM",
    email: "mcdowell@test.com",
    phone: "9876543210",
    status: "Paid",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    id: "APT242",
    name: "Johana",
    method: "Video Consultation",
    time: "11:00AM",
    email: "johana@test.com",
    phone: "9876543210",
    status: "Paid",
    image: "https://randomuser.me/api/portraits/women/65.jpg",
  },
  {
    id: "APT037",
    name: "Braun",
    method: "Direct Visit",
    time: "11:30AM",
    email: "braun@test.com",
    phone: "9876543210",
    status: "Paid",
    image: "https://randomuser.me/api/portraits/men/45.jpg",
  },
  {
    id: "APT028",
    name: "Raymon",
    method: "Video Consultation",
    time: "12:00PM",
    email: "raymon@test.com",
    phone: "9876543210",
    status: "Paid",
    image: "https://randomuser.me/api/portraits/men/52.jpg",
  },
  {
    id: "APT024",
    name: "Jerald",
    method: "Video Consultation",
    time: "12:30PM",
    email: "jerald@test.com",
    phone: "9876543210",
    status: "Pending",
    image: "https://randomuser.me/api/portraits/men/60.jpg",
  },
];

const Appointment = () => {
  const [search, setSearch] = useState("");

  const filteredAppointments = appointmentsData.filter((a) =>
    a.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="text-sm text-gray-500 flex items-center gap-2">
        <FaCalendarAlt /> <span>/ Appointments</span>
      </div>

      {/* Doctor Info */}
      <div className="bg-white p-6 rounded-xl shadow flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-4">
          <img
            src="https://images.pexels.com/photos/6749779/pexels-photo-6749779.jpeg"
            className="w-32 h-32 rounded-lg object-cover"
            alt="doctor"
          />
          <div>
            <span className="text-xs text-green-600 font-semibold bg-green-100 px-2 py-1 rounded">
              Available
            </span>
            <h2 className="text-xl font-bold text-gray-800 mt-1">
              Dr. Ashley Henson
            </h2>
            <p className="text-gray-600 text-sm">
              MBBS, MS - General Physician
            </p>
            <p className="text-gray-500 text-sm">
              Speaks: English, French, and Spanish <br />
              Location: 9 E 2nd St, New York, NY 30003, USA
            </p>
          </div>
        </div>
        <div className="flex flex-col items-center space-y-2">
          <span className="text-sm text-gray-600">
            Online Consultation Available
          </span>
          <div className="flex gap-2 text-sm">
            <button className="px-3 py-1 bg-slate-100 rounded">
              <FaComments /> Chat
            </button>
            <button className="px-3 py-1 bg-slate-100 rounded">
              <FaPhone /> Audio
            </button>
            <button className="px-3 py-1 bg-slate-100 rounded">
              <FaVideo /> Video
            </button>
          </div>
          <button className="px-4 py-1 bg-teal-500 text-white text-sm rounded">
            My Patient List
          </button>
        </div>
      </div>

      {/* Filter + Search */}
      <div className="flex justify-between items-center">
        <div className="space-x-2">
          <button className="bg-blue-100 text-blue-700 px-3 py-1 rounded">
            Upcoming 9
          </button>
          <button className="bg-red-100 text-red-600 px-3 py-1 rounded">
            Cancelled 2
          </button>
          <button className="bg-green-100 text-green-600 px-3 py-1 rounded">
            Completed 21
          </button>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <AiOutlineSearch className="absolute top-2.5 left-2 text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              className="pl-8 pr-3 py-1 border rounded"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <FiList className="text-gray-600 text-xl cursor-pointer" />
          <FiGrid className="text-gray-600 text-xl cursor-pointer" />
        </div>
      </div>

      {/* Appointments List */}
      <div className="space-y-4">
        {filteredAppointments.map((appt) => (
          <div
            key={appt.id}
            className="bg-white shadow rounded-lg p-4 flex justify-between items-center"
          >
            <div className="flex items-center gap-4">
              <img
                src={appt.image}
                alt={appt.name}
                className="w-12 h-12 rounded-full"
              />
              <div>
                <p className="font-semibold text-gray-700">#{appt.id}</p>
                <p className="text-sm text-gray-600">{appt.name}</p>
                <p className="text-xs text-gray-500">{appt.method}</p>
              </div>
            </div>
            <div className="text-sm text-gray-600">{appt.time}</div>
            <div className="text-sm text-blue-600">
              <p>{appt.email}</p>
              <p>{appt.phone}</p>
            </div>
            <div className="text-sm">
              <span
                className={
                  appt.status === "Paid" ? "text-green-600" : "text-yellow-600"
                }
              >
                Payment {appt.status}
              </span>
            </div>
            <div className="flex gap-2 text-gray-500">
              <FaCheck className="cursor-pointer hover:text-green-600" />
              <FaTimes className="cursor-pointer hover:text-red-500" />
              <button className="bg-teal-100 px-3 py-1 rounded text-teal-700 text-sm hover:bg-teal-200">
                Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Appointment;
