import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import userManagerService from "../../Services/ManagerService/userManagerService";

const ManagerUser = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await userManagerService.getAllUsers(token);
        if (Array.isArray(res.data.data)) {
          const sortedUsers = res.data.data.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
          setUsers(sortedUsers);
        } else {
          console.error("Dữ liệu người dùng không hợp lệ.");
        }
      } catch (err) {
        console.error("Lỗi khi lấy danh sách người dùng:", err);
      }
    };

    fetchUsers();
  }, []);

  const totalPages = Math.ceil(users.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const currentUsers = users.slice(startIndex, startIndex + pageSize);

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  return (
    <div className="p-6 bg-white min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Danh sách người dùng</h2>

      <div className="overflow-x-auto border rounded shadow-sm">
        <table className="min-w-full table-auto text-sm text-gray-800">
          <thead className="bg-gray-100 text-gray-700 text-xs uppercase">
            <tr>
              <th className="border px-4 py-2">STT</th>
              <th className="border px-4 py-2">Tên</th>
              <th className="border px-4 py-2">Email</th>
              <th className="border px-4 py-2">Giới tính</th>
              <th className="border px-4 py-2">Ngày sinh</th>
              <th className="border px-4 py-2">SĐT</th>
              <th className="border px-4 py-2">Địa chỉ</th>
              <th className="border px-4 py-2">Vai trò</th>
              <th className="border px-4 py-2">Ngày tạo</th>
              <th className="border px-4 py-2">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((u, index) => (
              <tr key={u._id} className="hover:bg-gray-50">
                <td className="border px-4 py-2 text-center">
                  {startIndex + index + 1}
                </td>
                <td className="border px-4 py-2">{u.name}</td>
                <td className="border px-4 py-2">{u.email}</td>
                <td className="border px-4 py-2 text-center">
                  {u.gender === "string" ? "—" : u.gender}
                </td>
                <td className="border px-4 py-2 text-center">
                  {u.dob ? new Date(u.dob).toLocaleDateString("vi-VN") : "—"}
                </td>
                <td className="border px-4 py-2 text-center">{u.phone}</td>
                <td className="border px-4 py-2">{u.address}</td>
                <td className="border px-4 py-2 text-center">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      u.role?.name === "DOCTOR_ROLE"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-teal-100 text-teal-700"
                    }`}
                  >
                    {u.role?.name === "DOCTOR_ROLE"
                      ? "Bác sĩ"
                      : u.role?.name === "CUSTOMER_ROLE"
                      ? "Khách hàng"
                      : "—"}
                  </span>
                </td>
                <td className="border px-4 py-2 text-center">
                  {new Date(u.createdAt).toLocaleString("vi-VN")}
                </td>
                <td className="border px-4 py-2 text-center">
                  <Link
                    to={`/manager/user/${u._id}`}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 text-xs rounded"
                  >
                    Xem
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination controls */}
      <div className="flex justify-center items-center gap-6 mt-6">
        <button
          onClick={handlePrev}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded ${
            currentPage === 1
              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
              : "bg-teal-500 text-white hover:bg-teal-600"
          }`}
        >
          ← Trang trước
        </button>
        <span className="text-sm text-gray-600">
          Trang <strong>{currentPage}</strong> / {totalPages}
        </span>
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 rounded ${
            currentPage === totalPages
              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
              : "bg-teal-500 text-white hover:bg-teal-600"
          }`}
        >
          Trang sau →
        </button>
      </div>
    </div>
  );
};

export default ManagerUser;
