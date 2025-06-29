import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import userManagerService from "../../Services/ManagerService/userManagerService";

const UserDetail = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await userManagerService.getUserById(id, token);
        setUser(res.data.data);
      } catch (error) {
        console.error("Lỗi khi lấy chi tiết người dùng:", error);
      }
    };

    fetchUser();
  }, [id]);

  if (!user) {
    return (
      <div className="p-6 text-center text-gray-500 animate-pulse text-lg">
        Đang tải thông tin người dùng...
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen bg-gray-50 flex justify-center items-center">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-2">
          Chi tiết người dùng
        </h2>

        <div className="space-y-4 text-gray-700 text-sm">
          <p>
            <span className="font-medium">👤 Họ tên:</span> {user.name}
          </p>
          <p>
            <span className="font-medium">📧 Email:</span> {user.email}
          </p>
          <p>
            <span className="font-medium">📞 SĐT:</span> {user.phone}
          </p>
          <p>
            <span className="font-medium">⚧ Giới tính:</span>{" "}
            {user.gender === "Male"
              ? "Nam"
              : user.gender === "Female"
              ? "Nữ"
              : "Khác"}
          </p>
          <p>
            <span className="font-medium">🎂 Ngày sinh:</span>{" "}
            {user.dob ? new Date(user.dob).toLocaleDateString("vi-VN") : "—"}
          </p>
          <p>
            <span className="font-medium">🏠 Địa chỉ:</span>{" "}
            {user.address || "—"}
          </p>
          <p>
            <span className="font-medium">🛡️ Vai trò:</span>{" "}
            {user.role?.name || "—"}
          </p>
          <p>
            <span className="font-medium">📅 Ngày tạo:</span>{" "}
            {new Date(user.createdAt).toLocaleString("vi-VN")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserDetail;
