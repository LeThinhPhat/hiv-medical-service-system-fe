import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import docService from "../Services/CusService/docterListService"; // Assuming same service as TestAPI

const TestAPI2 = () => {
  const { id } = useParams(); // Get doctor ID from URL
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDoctorDetails = async () => {
      try {
        setLoading(true);
        const data = await docService.getDoctorById(id); // Assuming service has getDoctorById method
        setDoctor({
          id: data._id,
          name: data.userID.name,
          phone: data.userID.phone,
          room: data.room,
          experiences: data.experiences,
          degrees: data.degrees,
          specializations: data.specializations,
          isActive: data.isActive,
          createdAt: new Date(data.createdAt).toLocaleDateString(),
        });
      } catch (err) {
        setError("Không thể tải thông tin bác sĩ. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };
    fetchDoctorDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Đang tải...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Không tìm thấy thông tin bác sĩ.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="container mx-auto py-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Thông tin chi tiết bác sĩ
        </h1>
        <p className="text-gray-600 mt-2">
          <Link to="/" className="text-gray-600 hover:underline">
            Trang chủ
          </Link>{" "}
          /{" "}
          <Link to="/doctors" className="text-gray-600 hover:underline">
            Danh sách bác sĩ
          </Link>{" "}
          / <span className="text-gray-800">{doctor.name}</span>
        </p>
      </header>

      {/* Main Content */}
      <main className="container mx-auto py-8">
        <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
          <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6">
            {/* Doctor Image */}
            <div className="md:w-1/3">
              <img
                src="https://nguoinoitieng.tv/images/nnt/107/0/bjur.jpg" // Placeholder avatar
                alt={doctor.name}
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>

            {/* Doctor Details */}
            <div className="md:w-2/3">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Bác sĩ {doctor.name}
              </h2>
              <div className="space-y-4">
                <p className="text-gray-600">
                  <span className="font-semibold">Chuyên khoa: </span>
                  {doctor.specializations}
                </p>
                <p className="text-gray-600">
                  <span className="font-semibold">Số điện thoại: </span>
                  {doctor.phone}
                </p>
                <p className="text-gray-600">
                  <span className="font-semibold">Phòng: </span>
                  {doctor.room}
                </p>
                <p className="text-gray-600">
                  <span className="font-semibold">Kinh nghiệm: </span>
                  {doctor.experiences.join(", ")}
                </p>
                <p className="text-gray-600">
                  <span className="font-semibold">Bằng cấp: </span>
                  {doctor.degrees}
                </p>
                <p className="text-gray-600">
                  <span className="font-semibold">Trạng thái: </span>
                  {doctor.isActive ? "Đang hoạt động" : "Không hoạt động"}
                </p>
                <p className="text-gray-600">
                  <span className="font-semibold">Ngày tham gia: </span>
                  {doctor.createdAt}
                </p>
              </div>
              <Link
                to="/test"
                className="mt-6 inline-block px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all"
              >
                Quay lại danh sách bác sĩ
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TestAPI2;
