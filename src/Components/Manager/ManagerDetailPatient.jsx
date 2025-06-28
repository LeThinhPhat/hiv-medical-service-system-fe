import React, { useEffect, useState } from "react";
import patientManagerService from "../../Services/ManagerService/patientManagerService";

const ManagerDetailPatient = ({ patientId, onClose }) => {
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const res = await patientManagerService.getPatientById(
          patientId,
          token
        );
        setPatient(res.data.data);
      } catch (error) {
        console.error("Lỗi khi lấy chi tiết bệnh nhân:", error);
      } finally {
        setLoading(false);
      }
    };

    if (patientId) fetchPatient();
  }, [patientId]);

  if (!patientId) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-2xl w-[420px] max-h-[90vh] overflow-y-auto shadow-lg relative">
        <h3 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">
          Chi tiết bệnh nhân
        </h3>

        {loading ? (
          <div className="text-center text-gray-500 animate-pulse">
            Đang tải dữ liệu...
          </div>
        ) : !patient ? (
          <div className="text-center text-red-500">
            Không tìm thấy bệnh nhân.
          </div>
        ) : (
          <div className="space-y-3 text-sm text-gray-700">
            <p>
              <span className="font-medium">👤 Họ tên:</span> {patient.name}
            </p>
            <p>
              <span className="font-medium">🆔 CMND/CCCD:</span>{" "}
              {patient.personalID}
            </p>
            <p>
              <span className="font-medium">⚧ Giới tính:</span>{" "}
              {patient.gender === "Male" ? "Nam" : "Nữ"}
            </p>
            <p>
              <span className="font-medium">🎂 Ngày sinh:</span>{" "}
              {new Date(patient.dob).toLocaleDateString("vi-VN")}
            </p>
            <p>
              <span className="font-medium">📧 Email:</span>{" "}
              {patient.contactEmails?.[0] || "—"}
            </p>
            <p>
              <span className="font-medium">📞 SĐT:</span>{" "}
              {patient.contactPhones?.[0] || "—"}
            </p>
            <p>
              <span className="font-medium">📝 Trạng thái:</span>{" "}
              <span
                className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${
                  patient.isRegistered
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {patient.isRegistered ? "Đã đăng ký" : "Khách vãng lai"}
              </span>
            </p>
            <p>
              <span className="font-medium">📂 Số hồ sơ:</span>{" "}
              {patient.medicalRecordID?.length || 0}
            </p>
          </div>
        )}

        <div className="mt-6 text-right">
          <button
            onClick={onClose}
            className="bg-red-500 hover:bg-red-600 text-white text-sm px-4 py-2 rounded-lg transition"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManagerDetailPatient;
