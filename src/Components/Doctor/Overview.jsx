import React from "react";
import { FaStar, FaVideo, FaHeadphones, FaComments } from "react-icons/fa";
import { IoIosLink } from "react-icons/io";
import { FiShare2 } from "react-icons/fi";
import { MdStars } from "react-icons/md";
import { BiUser } from "react-icons/bi";
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";
import { LuLocate } from "react-icons/lu";

const DoctorOverview = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <div className="flex flex-col lg:flex-row justify-between gap-4">
        {/* Left Section */}
        <div className="flex gap-4">
          <img
            src="https://images.pexels.com/photos/6749771/pexels-photo-6749771.jpeg"
            alt="Doctor"
            className="w-40 h-32 rounded object-cover"
          />
          <div>
            <span className="bg-teal-100 text-teal-700 text-xs font-medium px-2 py-1 rounded-full inline-block mb-1">
              Available
            </span>
            <p className="text-sm text-gray-600">Good Morning,</p>
            <h2 className="text-xl font-semibold text-gray-800">
              Dr. Ashley Henson
            </h2>
            <p className="text-gray-600 text-sm">
              MBBS, MS - General Physician
            </p>
            <p className="text-gray-600 text-sm">
              Speaks: English, French, and Spanish
            </p>
            <p className="text-gray-600 text-sm">
              Location: 9 E 2nd St, New York, NY 30003, USA
            </p>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex flex-col justify-between">
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-700">
            <span className="flex items-center gap-1">
              <LuLocate className="text-teal-500" />
              Online Consultation Available
            </span>
            <span className="flex items-center gap-1">
              <HiOutlineBuildingOffice2 className="text-teal-500" />
              Clinix Medicals & Hospital
            </span>
            <span className="flex items-center gap-1">
              <BiUser className="text-teal-500" />
              96% Recommended
            </span>
            <div className="flex gap-2 ml-auto text-gray-400 text-lg">
              <MdStars />
              <IoIosLink />
              <FiShare2 />
            </div>
          </div>

          <div className="flex items-center gap-2 mt-3">
            <div className="flex items-center text-yellow-500 text-sm">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} />
              ))}
              <span className="ml-2 font-semibold text-gray-800">3690</span>{" "}
              <span className="text-gray-600 ml-1">Reviews</span>
            </div>
            <div className="flex gap-2 ml-4">
              <button className="bg-slate-500 text-white text-sm px-3 py-1 rounded flex items-center gap-1">
                <FaComments />
                Chat
              </button>
              <button className="bg-slate-500 text-white text-sm px-3 py-1 rounded flex items-center gap-1">
                <FaHeadphones />
                Audio Call
              </button>
              <button className="bg-slate-500 text-white text-sm px-3 py-1 rounded flex items-center gap-1">
                <FaVideo />
                Video Call
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom filter and button */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t">
        <div className="flex gap-3 text-sm">
          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
            Upcoming <span className="ml-1 font-semibold">9</span>
          </span>
          <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full font-medium">
            Cancelled <span className="ml-1 font-semibold">2</span>
          </span>
          <span className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full font-medium">
            Completed <span className="ml-1 font-semibold">21</span>
          </span>
        </div>
        <button className="bg-teal-500 text-white px-4 py-2 text-sm rounded-md">
          My Patient List
        </button>
      </div>
    </div>
  );
};

export default DoctorOverview;
