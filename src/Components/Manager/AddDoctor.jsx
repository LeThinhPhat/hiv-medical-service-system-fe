import React, { useState } from "react";

const AddDoctor = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    age: "",
    gender: "",
    createId: "",
    email: "",
    mobile: "",
    maritalStatus: "",
    qualification: "",
    designation: "",
    bloodGroup: "",
    address: "",
    country: "",
    state: "",
    city: "",
    postalCode: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="bg-white rounded shadow p-6">
        {/* Tab Header */}
        <div className="flex space-x-8 border-b mb-6">
          <div className="text-teal-600 font-medium pb-2 border-b-2 border-teal-500">
            Personal Details
          </div>
          <div className="text-gray-500 font-medium pb-2">Profile and Bio</div>
          <div className="text-gray-500 font-medium pb-2">Availability</div>
          <div className="text-gray-500 font-medium pb-2">Account Details</div>
        </div>

        {/* Form */}
        <form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
          <div>
            <label className="block mb-1 font-medium">First Name *</label>
            <input
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              type="text"
              placeholder="Enter First Name"
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Last Name *</label>
            <input
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              type="text"
              placeholder="Enter Last Name"
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Age *</label>
            <select
              name="age"
              value={form.age}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            >
              <option value="">Select Age</option>
              {[...Array(83)].map((_, i) => (
                <option key={i + 18}>{i + 18}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium">Gender *</label>
            <div className="flex space-x-4 mt-2">
              <label className="flex items-center space-x-1">
                <input
                  type="radio"
                  name="gender"
                  value="Male"
                  checked={form.gender === "Male"}
                  onChange={handleChange}
                />
                <span>Male</span>
              </label>
              <label className="flex items-center space-x-1">
                <input
                  type="radio"
                  name="gender"
                  value="Female"
                  checked={form.gender === "Female"}
                  onChange={handleChange}
                />
                <span>Female</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block mb-1 font-medium">Create ID *</label>
            <input
              name="createId"
              value={form.createId}
              onChange={handleChange}
              type="text"
              placeholder="Create Unique ID"
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Email ID *</label>
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              type="email"
              placeholder="Enter Email ID"
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Mobile Number *</label>
            <input
              name="mobile"
              value={form.mobile}
              onChange={handleChange}
              type="tel"
              placeholder="Enter Mobile Number"
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Marital Status</label>
            <select
              name="maritalStatus"
              value={form.maritalStatus}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            >
              <option>Select</option>
              <option>Single</option>
              <option>Married</option>
              <option>Divorced</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium">Qualification</label>
            <select
              name="qualification"
              value={form.qualification}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            >
              <option>Select</option>
              <option>MBBS</option>
              <option>MD</option>
              <option>PhD</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium">Designation</label>
            <select
              name="designation"
              value={form.designation}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            >
              <option>Select</option>
              <option>General Physician</option>
              <option>Cardiologist</option>
              <option>Neurologist</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium">Blood Group *</label>
            <select
              name="bloodGroup"
              value={form.bloodGroup}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            >
              <option>Select</option>
              <option>O+</option>
              <option>O-</option>
              <option>A+</option>
              <option>A-</option>
              <option>B+</option>
              <option>B-</option>
              <option>AB+</option>
              <option>AB-</option>
            </select>
          </div>

          <div className="lg:col-span-2">
            <label className="block mb-1 font-medium">Address</label>
            <input
              name="address"
              value={form.address}
              onChange={handleChange}
              type="text"
              placeholder="Enter Address"
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Country</label>
            <select
              name="country"
              value={form.country}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            >
              <option>Select</option>
              <option>Vietnam</option>
              <option>USA</option>
              <option>UK</option>
              <option>India</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium">State</label>
            <input
              name="state"
              value={form.state}
              onChange={handleChange}
              type="text"
              placeholder="Enter State"
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">City</label>
            <input
              name="city"
              value={form.city}
              onChange={handleChange}
              type="text"
              placeholder="Enter City"
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Postal Code</label>
            <input
              name="postalCode"
              value={form.postalCode}
              onChange={handleChange}
              type="text"
              placeholder="Enter Postal Code"
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
        </form>

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <button className="px-4 py-2 border rounded hover:bg-gray-100">
            Cancel
          </button>
          <button className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700">
            Create Doctor Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddDoctor;
