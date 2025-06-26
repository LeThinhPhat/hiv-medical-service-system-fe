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
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Danh sách Bác sĩ
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Array.isArray(doctors) &&
          doctors
            .filter((doctor) => doctor.userID)
            .map((doctor) => (
              <div
                key={doctor._id}
                className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <h3 className="text-lg font-semibold text-teal-600 mb-2">
                  {doctor.userID?.name || "Không rõ tên"}
                </h3>
                <p className="text-gray-600 mb-1">
                  Email: {doctor.userID?.email || "Không có email"}
                </p>
                <p className="text-gray-600 mb-1">
                  Điện thoại: {doctor.userID?.phone || "Không có số"}
                </p>
                <p className="text-gray-600 mb-1">Phòng: {doctor.room}</p>
                <p className="text-gray-600 mb-1">
                  Chuyên môn: {doctor.specializations || "Không rõ"}
                </p>
                <p className="text-gray-600 mb-1">
                  Bằng cấp: {doctor.degrees || "Không rõ"}
                </p>

                <div className="mt-2">
                  <p className="text-sm font-medium text-gray-700 mb-1">
                    Kinh nghiệm:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {Array.isArray(doctor.experiences) &&
                      doctor.experiences.map((exp, index) => (
                        <span
                          key={index}
                          className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded"
                        >
                          {exp}
                        </span>
                      ))}
                  </div>
                </div>

                <div className="mt-4 border-t pt-2">
                  <p className="text-sm text-gray-500">
                    Tạo bởi: {doctor.createdBy?.email || "Không rõ"}
                  </p>
                </div>
              </div>
            ))}
      </div>
      {doctors.length === 0 && (
        <div className="text-center p-4 bg-white rounded-lg shadow-sm">
          <p className="text-gray-500">Không có bác sĩ nào.</p>
        </div>
      )}
    </div>
  );
};

export default ManagerDoctorList;
