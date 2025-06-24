import React, { useEffect, useState } from "react";
import { FaUserMd, FaStar, FaLungs, FaStarHalfAlt } from "react-icons/fa";
import doctorprofileService from "../../Services/DoctorService/doctorprofileService";

const DoctorProfile = () => {
  const [doctor, setDoctor] = useState(null);
  const [error, setError] = useState(null);

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

    fetchDoctor();
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
        <div className="col-span-1 lg:col-span-1 bg-blue-500 text-white rounded-lg flex p-4 items-center">
          <img
            src="https://randomuser.me/api/portraits/women/44.jpg"
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
            <div className="flex items-center text-yellow-400 mt-1">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} className="mr-1" />
              ))}
            </div>
            <p className="text-sm">2896 đánh giá</p>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-white p-6 rounded-lg flex flex-col items-center justify-center">
          <FaUserMd className="text-4xl text-blue-500 mb-2" />
          <h2 className="text-2xl font-bold text-blue-600">3605</h2>
          <p className="text-sm text-gray-600">Bệnh nhân</p>
          <span className="text-xs mt-1 text-blue-500">68% cao</span>
        </div>

        <div className="bg-white p-6 rounded-lg flex flex-col items-center justify-center">
          <FaLungs className="text-4xl text-red-400 mb-2" />
          <h2 className="text-2xl font-bold text-red-500">507</h2>
          <p className="text-sm text-gray-600">Ca phẫu thuật</p>
          <span className="text-xs mt-1 text-red-500">26% cao</span>
        </div>

        <div className="bg-white p-6 rounded-lg flex flex-col items-center justify-center">
          <FaStarHalfAlt className="text-4xl text-green-400 mb-2" />
          <h2 className="text-2xl font-bold text-green-600">2896</h2>
          <p className="text-sm text-gray-600">Đánh giá</p>
          <span className="text-xs mt-1 text-green-600">30% cao</span>
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
          <h3 className="text-lg font-semibold mb-4">Lịch làm việc</h3>
          <div className="space-y-2 mb-4">
            {[
              "Thứ 2 - 9:00 - 14:00",
              "Thứ 3 - 9:00 - 14:00",
              "Thứ 4 - 9:00 - 14:00",
              "Thứ 5 - 9:00 - 14:00",
              "Thứ 6 - 9:00 - 14:00",
              "Thứ 7 - 9:00 - 14:00",
              "Chủ nhật - Nghỉ",
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
            Đặt lịch hẹn
          </button>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;
