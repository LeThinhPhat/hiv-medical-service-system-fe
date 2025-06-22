import React from "react";
import { FaUserMd, FaStar, FaLungs, FaStarHalfAlt } from "react-icons/fa";

const DoctorProfile = () => {
  return (
    <div className="p-6 bg-gray-100 min-h-screen space-y-6">
      {/* Top Info Section */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Doctor Info */}
        <div className="col-span-1 lg:col-span-1 bg-blue-500 text-white rounded-lg flex p-4 items-center">
          <img
            src="https://randomuser.me/api/portraits/women/44.jpg"
            alt="Dr. Jessika Linda"
            className="w-24 h-24 rounded-full object-cover border-4 border-white"
          />
          <div className="ml-4">
            <p className="text-sm">Hello I am,</p>
            <h2 className="text-lg font-bold">Dr. Jessika Linda</h2>
            <p className="text-sm font-semibold mt-1">
              MBBS, MS - General Surgery, General Physician
            </p>
            <p className="text-sm mt-1">16 Years Experience Overall</p>
            <div className="flex items-center text-yellow-400 mt-1">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} className="mr-1" />
              ))}
            </div>
            <p className="text-sm">2896 Reviews</p>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-white p-6 rounded-lg flex flex-col items-center justify-center">
          <FaUserMd className="text-4xl text-blue-500 mb-2" />
          <h2 className="text-2xl font-bold text-blue-600">3605</h2>
          <p className="text-sm text-gray-600">Patients</p>
          <span className="text-xs mt-1 text-blue-500">68% High</span>
        </div>

        <div className="bg-white p-6 rounded-lg flex flex-col items-center justify-center">
          <FaLungs className="text-4xl text-red-400 mb-2" />
          <h2 className="text-2xl font-bold text-red-500">507</h2>
          <p className="text-sm text-gray-600">Surgeries</p>
          <span className="text-xs mt-1 text-red-500">26% High</span>
        </div>

        <div className="bg-white p-6 rounded-lg flex flex-col items-center justify-center">
          <FaStarHalfAlt className="text-4xl text-green-400 mb-2" />
          <h2 className="text-2xl font-bold text-green-600">2896</h2>
          <p className="text-sm text-gray-600">Reviews</p>
          <span className="text-xs mt-1 text-green-600">30% High</span>
        </div>
      </div>

      {/* About & Availability */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* About */}
        <div className="col-span-2 bg-white p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">About</h3>
          <p className="text-sm text-gray-700 mb-4">
            Dr. Jessika Linda is an eminent Endocrinologist associated with med
            hospitals who is specially trained to diagnose diseases related to
            glands. She specialises in treating people who suffer from hormonal
            imbalances, typically from glands in the endocrine system. The most
            common conditions treated by Dr. Linda are Diabetes, Metabolic
            disorders, Lack of growth, Osteoporosis, Thyroid diseases, Cancers
            of the endocrine glands, Over- or under-production of hormones,
            Cholesterol disorders, Hypertension and Infertility. Also available
            for consultation at Med hospital. Dr. Linda's approach lies in
            understanding patients diseases and the procedure recommended along
            with care.
          </p>
          <h4 className="font-medium mb-1">Specialized in</h4>
          <div className="flex flex-wrap gap-2">
            {["Diabetes", "Thyroid", "Osteoporosis", "Surgeon", "General"].map(
              (spec, i) => (
                <span
                  key={i}
                  className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full"
                >
                  {spec}
                </span>
              )
            )}
          </div>
        </div>

        {/* Availability */}
        <div className="bg-white p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Availability</h3>
          <div className="space-y-2 mb-4">
            {[
              "Mon - 9:AM - 2:PM",
              "Tue - 9:AM - 2:PM",
              "Wed - 9:AM - 2:PM",
              "Thu - 9:AM - 2:PM",
              "Fri - 9:AM - 2:PM",
              "Sat - 9:AM - 2:PM",
              "Sun - NA",
            ].map((slot, i) => (
              <span
                key={i}
                className="inline-block bg-gray-100 px-3 py-1 text-sm text-gray-800 rounded"
              >
                {slot}
              </span>
            ))}
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Book Appointment
          </button>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;
