import React, { useEffect, useState } from "react";
import doctorService from "../../Services/ManagerService/doctorService";

const ManagerDoctorList = () => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const data = await doctorService.getAllDoctors();
        console.log("Doctors data:", data);
        const validDoctors = Array.isArray(data)
          ? data.filter(
              (doctor) => doctor && typeof doctor === "object" && doctor._id
            )
          : [];
        setDoctors(validDoctors);
        setFilteredDoctors(validDoctors);
      } catch (error) {
        console.error("Không thể tải danh sách bác sĩ:", error);
        setError("Không thể tải danh sách bác sĩ.");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  // Search functionality
  useEffect(() => {
    const results = doctors.filter((doctor) =>
      doctor?.userID?.name && typeof doctor.userID.name === "string"
        ? doctor.userID.name.toLowerCase().includes(searchTerm.toLowerCase())
        : false
    );
    setFilteredDoctors(results);
  }, [searchTerm, doctors]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-600 text-center p-4 text-lg font-medium">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen  py-10 px-6">
      <div className="container mx-auto ">
        <div className="bg-white rounded-2xl shadow-xl">
          <div className="bg-gradient-to-r from-teal-700 to-teal-500 p-6 rounded-t-2xl">
            <h2 className="text-3xl font-bold text-white">Danh sách Bác sĩ</h2>
          </div>
          <div className="p-6">
            {/* Search Bar */}
            <div className="relative max-w-md mb-6">
              <input
                type="text"
                placeholder="Tìm kiếm theo tên bác sĩ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-3 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <svg
                className="absolute left-3 top-3.5 h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            {/* Doctor List */}
            {filteredDoctors.length === 0 ? (
              <div className="text-center p-8 bg-gray-50 rounded-lg shadow-sm text-gray-500 text-lg">
                Không tìm thấy bác sĩ nào.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDoctors
                  .filter((doctor) => doctor.userID)
                  .map((doctor) => (
                    <div
                      key={doctor._id}
                      className="bg-white p-5 rounded-xl border border-gray-200 shadow-md hover:shadow-lg transition-shadow duration-200"
                    >
                      <h3 className="text-xl font-semibold text-teal-600 mb-2">
                        {doctor.userID?.name || "Không rõ tên"}
                      </h3>
                      <div className="space-y-2 text-sm text-gray-700">
                        <p>
                          <span className="font-medium text-gray-900">
                            Email:
                          </span>{" "}
                          {doctor.userID?.email || "Không có email"}
                        </p>
                        <p>
                          <span className="font-medium text-gray-900">
                            Điện thoại:
                          </span>{" "}
                          {doctor.userID?.phone || "Không có số"}
                        </p>
                        <p>
                          <span className="font-medium text-gray-900">
                            Phòng:
                          </span>{" "}
                          {doctor.room || "Không rõ"}
                        </p>
                        <p>
                          <span className="font-medium text-gray-900">
                            Chuyên môn:
                          </span>{" "}
                          {doctor.specializations || "Không rõ"}
                        </p>
                        <p>
                          <span className="font-medium text-gray-900">
                            Bằng cấp:
                          </span>{" "}
                          {doctor.degrees || "Không rõ"}
                        </p>
                      </div>

                      <div className="mt-4">
                        <p className="text-sm font-semibold text-gray-800 mb-1">
                          Kinh nghiệm:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {Array.isArray(doctor.experiences) &&
                          doctor.experiences.length > 0 ? (
                            doctor.experiences.map((exp, index) => (
                              <span
                                key={index}
                                className="bg-teal-100 text-teal-800 text-xs font-medium px-2.5 py-1 rounded-full"
                              >
                                {exp}
                              </span>
                            ))
                          ) : (
                            <span className="text-xs text-gray-400">
                              Không có
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="mt-4 border-t pt-3 text-xs text-gray-500">
                        Tạo bởi: {doctor.createdBy?.email || "Không rõ"}
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerDoctorList;
