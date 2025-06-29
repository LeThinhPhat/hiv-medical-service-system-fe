import React, { useEffect, useState } from "react";
import doctorService from "../../Services/ManagerService/doctorService";

const ManagerDoctorList = () => {
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const data = await doctorService.getAllDoctors();
        console.log("Doctors data:", data);
        setDoctors(data);
      } catch (error) {
        console.error("Không thể tải danh sách bác sĩ:", error);
      }
    };

    fetchDoctors();
  }, []);

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-2">
        Danh sách Bác sĩ
      </h2>

      {doctors.length === 0 ? (
        <div className="text-center p-6 bg-white rounded-lg shadow-sm text-gray-500 text-lg">
          Không có bác sĩ nào.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors
            .filter((doctor) => doctor.userID)
            .map((doctor) => (
              <div
                key={doctor._id}
                className="bg-white p-5 rounded-xl border border-gray-200 shadow-md hover:shadow-lg transition-shadow duration-200"
              >
                <h3 className="text-xl font-semibold text-teal-600 mb-2">
                  {doctor.userID?.name || "Không rõ tên"}
                </h3>
                <div className="space-y-1 text-sm text-gray-700">
                  <p>
                    <span className="font-medium">Email:</span>{" "}
                    {doctor.userID?.email || "Không có email"}
                  </p>
                  <p>
                    <span className="font-medium">Điện thoại:</span>{" "}
                    {doctor.userID?.phone || "Không có số"}
                  </p>
                  <p>
                    <span className="font-medium">Phòng:</span>{" "}
                    {doctor.room || "Không rõ"}
                  </p>
                  <p>
                    <span className="font-medium">Chuyên môn:</span>{" "}
                    {doctor.specializations || "Không rõ"}
                  </p>
                  <p>
                    <span className="font-medium">Bằng cấp:</span>{" "}
                    {doctor.degrees || "Không rõ"}
                  </p>
                </div>

                <div className="mt-4">
                  <p className="text-sm font-semibold text-gray-600 mb-1">
                    Kinh nghiệm:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {Array.isArray(doctor.experiences) &&
                    doctor.experiences.length > 0 ? (
                      doctor.experiences.map((exp, index) => (
                        <span
                          key={index}
                          className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full"
                        >
                          {exp}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-gray-400">Không có</span>
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
  );
};

export default ManagerDoctorList;
