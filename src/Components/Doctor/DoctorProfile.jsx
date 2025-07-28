import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserMd, FaStar, FaLungs, FaStarHalfAlt } from "react-icons/fa";
import doctorprofileService from "../../Services/DoctorService/doctorprofileService";
import doctorScheduleService from "../../Services/DoctorService/doctorScheduleService";
import { formatInTimeZone } from "date-fns-tz";

const DoctorProfile = () => {
  const [doctor, setDoctor] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const data = await doctorprofileService.getDoctorProfile();
        setDoctor(data);
      } catch (err) {
        console.error("Lỗi khi lấy thông tin bác sĩ:", err);
        setError("Không thể tải thông tin bác sĩ.");
      }
    };

    const fetchSchedules = async () => {
      try {
        const token = localStorage.getItem("token");
        const today = new Date();
        const dayOfWeek = today.getDay(); // CN = 0, T2 = 1, ...
        const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

        const startDate = new Date(today);
        startDate.setDate(today.getDate() + mondayOffset);

        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 6);

        const response = await doctorScheduleService.getScheduleByWeek(
          token,
          startDate.toISOString().slice(0, 10),
          endDate.toISOString().slice(0, 10)
        );
        setSchedules(response.data);
      } catch (err) {
        console.error("Lỗi khi lấy lịch làm việc:", err);
      }
    };

    fetchDoctor();
    fetchSchedules();
  }, []);

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>;
  }

  if (!doctor) {
    return <div className="p-6">Đang tải thông tin bác sĩ...</div>;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen space-y-6">
      {/* Top Info Section */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Doctor Info */}
        <div className="col-span-1 bg-blue-500 text-white rounded-lg flex p-4 items-center">
          <img
            src="https://www.shutterstock.com/image-vector/male-doctor-smiling-happy-face-600nw-2481032615.jpg"
            alt={`Dr. ${doctor?.userID?.name}`}
            className="w-24 h-24 rounded-full object-cover border-4 border-white"
          />
          <div className="ml-4">
            <p className="text-sm">Xin chào, tôi là</p>
            <h2 className="text-lg font-bold">Dr. {doctor?.userID?.name}</h2>
            <p className="text-sm font-semibold mt-1">
              {doctor?.degrees}, {doctor?.specializations}
            </p>
            <p className="text-sm mt-1">Phòng: {doctor?.room}</p>
            <p className="text-sm mt-1">Email: {doctor?.userID?.email}</p>
            {/* <div className="flex items-center text-yellow-400 mt-1">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} className="mr-1" />
              ))}
            </div>
            <p className="text-sm">2896 đánh giá</p> */}
          </div>
        </div>

        {/* Stats */}
        <div className="bg-white p-6 rounded-lg flex flex-col items-center justify-center">
          <FaUserMd className="text-4xl text-blue-500 mb-2" />
          <h2 className="text-2xl font-bold text-blue-600">000</h2>
          <p className="text-sm text-gray-600">Bệnh nhân</p>
          <span className="text-xs mt-1 text-blue-500">00% cao</span>
        </div>

        <div className="bg-white p-6 rounded-lg flex flex-col items-center justify-center">
          <FaLungs className="text-4xl text-red-400 mb-2" />
          <h2 className="text-2xl font-bold text-red-500">000</h2>
          <p className="text-sm text-gray-600">Ca phẫu thuật</p>
          <span className="text-xs mt-1 text-red-500">00% cao</span>
        </div>

        <div className="bg-white p-6 rounded-lg flex flex-col items-center justify-center">
          <FaStarHalfAlt className="text-4xl text-green-400 mb-2" />
          <h2 className="text-2xl font-bold text-green-600">0000</h2>
          <p className="text-sm text-gray-600">Đánh giá</p>
          <span className="text-xs mt-1 text-green-600">00% cao</span>
        </div>
      </div>

      {/* About & Availability */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* About */}
        <div className="col-span-2 bg-white p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Giới thiệu</h3>
          {doctor?.experiences?.length > 0 ? (
            <ul className="list-disc list-inside text-sm text-gray-700 mb-4">
              {doctor.experiences.map((exp, i) => (
                <li key={i}>{exp}</li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-600">
              Chưa có thông tin kinh nghiệm.
            </p>
          )}
          <h4 className="font-medium mb-1">Chuyên môn</h4>
          <div className="flex flex-wrap gap-2 mt-2">
            <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
              {doctor?.specializations}
            </span>
          </div>
        </div>

        {/* Availability */}
        <div className="bg-white p-6 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-black">Lịch làm việc</h3>
            <button
              onClick={() => navigate("/doctor/calendar")}
              className="flex items-center gap-2 text-sm text-white bg-blue-500 px-4 py-2 rounded-md shadow-sm hover:bg-blue-700 transition-colors duration-200"
            >
              <span className="text-base">📅</span>
              <span>Xem chi tiết</span>
            </button>
          </div>

          <div className="space-y-2">
            {Array.from({ length: 7 }).map((_, i) => {
              const today = new Date();
              const dayOfWeek = today.getDay(); // 0 = CN, 1 = T2, ...
              const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

              const current = new Date();
              current.setDate(today.getDate() + mondayOffset + i);
              current.setHours(0, 0, 0, 0);

              // ✅ Lấy ngày theo giờ Việt Nam
              const formatted = formatInTimeZone(
                current,
                "Asia/Ho_Chi_Minh",
                "yyyy-MM-dd"
              );

              const weekday = current.toLocaleDateString("vi-VN", {
                timeZone: "Asia/Ho_Chi_Minh",
                weekday: "long",
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              });

              const scheduleForDay = schedules.filter(
                (s) => s.date.slice(0, 10) === formatted
              );

              return (
                <div
                  key={i}
                  className={`px-3 py-2 rounded ${
                    scheduleForDay.length > 0
                      ? "bg-gray-100 text-gray-800"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  <div className="font-semibold">📅 {weekday}</div>
                  {scheduleForDay.length > 0 ? (
                    <ul className="list-disc list-inside text-sm mt-1">
                      {scheduleForDay.map((shift, idx) => {
                        const shiftLabel =
                          shift.shiftName === "morning"
                            ? "Ca sáng (8:00)"
                            : shift.shiftName === "afternoon"
                            ? "Ca chiều (13:00)"
                            : "Cả ngày";

                        return (
                          <li key={idx}>
                            {shiftLabel} |{" "}
                            <span
                              className={`font-medium ${
                                shift.isConfirmed
                                  ? "text-green-600"
                                  : "text-yellow-600"
                              }`}
                            >
                              {shift.isConfirmed
                                ? "Đã xác nhận"
                                : "Chưa xác nhận"}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <div className="text-sm mt-1">OFF</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;
