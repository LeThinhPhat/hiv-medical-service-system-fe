import React from "react";
import { Link } from "react-router-dom";

const user = {
  name: "Nguyễn Văn Nam",
  email: "nam.nguyen@example.com",
  phone: "0905 123 456",
  address: "123 Đường Láng, Hà Nội",
};

const appointmentHistory = [
  {
    id: 1,
    doctor: "Dr. Nguyễn Văn A",
    specialty: "Khoa Nội Tổng Quát",
    date: "2025-06-01",
    time: "08:00",
    status: "Sắp tới",
  },
  {
    id: 2,
    doctor: "Dr. Trần Thị B",
    specialty: "Khoa Nhi",
    date: "2025-05-30",
    time: "09:30",
    status: "Đã hoàn thành",
  },
  {
    id: 3,
    doctor: "Dr. Lê Văn C",
    specialty: "Khoa Da Liễu",
    date: "2025-06-02",
    time: "11:00",
    status: "Sắp tới",
  },
  {
    id: 4,
    doctor: "Dr. Phạm Thị D",
    specialty: "Khoa Chấn Thương",
    date: "2025-05-28",
    time: "14:30",
    status: "Đã hoàn thành",
  },
];

const Profile = () => {
  return (
    <div className="w-full max-w-4xl mx-auto px-6 py-10">
      <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
        Hồ Sơ Cá Nhân
      </h2>

      {/* User Information */}
      <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Thông Tin Cá Nhân
        </h3>
        <div className="space-y-2 text-gray-700">
          <p>
            <span className="font-medium">Họ Tên:</span> {user.name}
          </p>
          <p>
            <span className="font-medium">Email:</span> {user.email}
          </p>
          <p>
            <span className="font-medium">Số Điện Thoại:</span> {user.phone}
          </p>
          <p>
            <span className="font-medium">Địa Chỉ:</span> {user.address}
          </p>
        </div>
        <Link
          to="/edit-profile"
          className="inline-block mt-4 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-all"
        >
          Chỉnh Sửa Thông Tin
        </Link>
      </div>

      {/* Appointment History */}
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Lịch Sử Đặt Lịch
        </h3>
        {appointmentHistory.length > 0 ? (
          <div className="space-y-4">
            {appointmentHistory.map((appointment) => (
              <div
                key={appointment.id}
                className="border-b pb-4 last:border-b-0"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-lg font-medium text-gray-800">
                      {appointment.doctor}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {appointment.specialty}
                    </p>
                    <p className="text-sm text-gray-500">
                      Ngày: {appointment.date} | Giờ: {appointment.time}
                    </p>
                  </div>
                  <span
                    className={`text-sm font-medium ${
                      appointment.status === "Sắp tới"
                        ? "text-green-500"
                        : "text-gray-500"
                    }`}
                  >
                    {appointment.status}
                  </span>
                </div>
                {appointment.status === "Sắp tới" && (
                  <Link
                    to={`/doctors/${appointment.id}`}
                    className="inline-block mt-2 text-sm text-yellow-500 hover:text-yellow-600"
                  >
                    Xem chi tiết bác sĩ
                  </Link>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">Chưa có lịch hẹn nào.</p>
        )}
      </div>

      <Link
        to="/booking"
        className="inline-block mt-6 px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all"
      >
        Đặt Lịch Khám Mới
      </Link>
    </div>
  );
};

export default Profile;
