import React, { useState } from "react";
import { FaTrash, FaEdit } from "react-icons/fa";

const mockStaff = [
  {
    id: "001",
    name: "Willian Mathews",
    role: "Supervisor",
    phone: "0987654321",
    email: "test@testing.com",
    doj: "20/10/2020",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
  },
  {
    id: "002",
    name: "Adam Bradley",
    role: "Nurse",
    phone: "0987654321",
    email: "test@testing.com",
    doj: "12/03/2018",
    avatar: "https://randomuser.me/api/portraits/men/2.jpg",
  },
  {
    id: "003",
    name: "Merle Daniel",
    role: "Receptionist",
    phone: "0987654321",
    email: "test@testing.com",
    doj: "03/09/2022",
    avatar: "https://randomuser.me/api/portraits/men/3.jpg",
  },
  {
    id: "004",
    name: "Nicole Sellers",
    role: "Pharmacist",
    phone: "0987654321",
    email: "test@testing.com",
    doj: "18/12/2013",
    avatar: "https://randomuser.me/api/portraits/women/4.jpg",
  },
  {
    id: "005",
    name: "Kathy Atkinson",
    role: "Admin",
    phone: "0987654321",
    email: "test@testing.com",
    doj: "23/10/2016",
    avatar: "https://randomuser.me/api/portraits/women/5.jpg",
  },
  // Add more entries if needed
];

const StaffList = () => {
  const [search, setSearch] = useState("");
  const [staffList, setStaffList] = useState(mockStaff);

  const filteredList = staffList.filter((staff) =>
    staff.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id) => {
    const confirm = window.confirm("Are you sure to delete?");
    if (confirm) {
      setStaffList(staffList.filter((item) => item.id !== id));
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Staff List</h2>
        <button className="bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600">
          Add Staff Member
        </button>
      </div>

      <div className="mb-4">
        <label className="text-sm mr-2">Search:</label>
        <input
          type="text"
          placeholder="Search by name..."
          className="border border-gray-300 rounded px-3 py-1"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-teal-600 text-white text-sm">
              <th className="px-4 py-2">#</th>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Designation</th>
              <th className="px-4 py-2">Mobile</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">DOJ</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredList.map((staff, index) => (
              <tr key={staff.id} className="border-b text-sm hover:bg-gray-100">
                <td className="text-center py-2">{staff.id}</td>
                <td className="flex items-center gap-2 py-2 px-4">
                  <img
                    src={staff.avatar}
                    alt={staff.name}
                    className="w-8 h-8 rounded-full"
                  />
                  <span>{staff.name}</span>
                </td>
                <td className="px-4">{staff.role}</td>
                <td className="text-center">{staff.phone}</td>
                <td className="text-center">{staff.email}</td>
                <td className="text-center">{staff.doj}</td>
                <td className="flex justify-center gap-2 py-2">
                  <button
                    onClick={() => handleDelete(staff.id)}
                    className="p-1 border border-red-500 text-red-500 rounded hover:bg-red-100"
                  >
                    <FaTrash />
                  </button>
                  <button className="p-1 border border-green-500 text-green-500 rounded hover:bg-green-100">
                    <FaEdit />
                  </button>
                </td>
              </tr>
            ))}
            {filteredList.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center py-4 text-gray-500">
                  No staff found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StaffList;
