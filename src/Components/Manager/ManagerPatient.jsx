import React, { useState, useEffect } from "react";
import patientManagerService from "../../Services/ManagerService/patientManagerService";
import ManagerDetailPatient from "./ManagerDetailPatient";

const PatientList = () => {
  const [patients, setPatients] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [loading, setLoading] = useState(true);
  const pageSize = 10;

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await patientManagerService.getAllPatients(token);
        if (Array.isArray(res.data.data)) {
          setPatients(res.data.data);
        } else {
          console.error("Dữ liệu bệnh nhân không hợp lệ.");
        }
      } catch (error) {
        console.error("Lỗi khi lấy danh sách bệnh nhân:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  const totalPages = Math.ceil(patients.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const currentPatients = patients.slice(startIndex, startIndex + pageSize);

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handleView = (id) => {
    setSelectedPatientId(id);
  };

  return (
    <div className="p-6 min-h-screen w-full bg-white">
      <h2 className="text-2xl font-bold mb-4">Danh sách bệnh nhân</h2>

      {loading ? (
        <p className="text-center py-10 text-gray-500">Đang tải dữ liệu...</p>
      ) : patients.length === 0 ? (
        <p className="text-center text-gray-500">Không có bệnh nhân nào.</p>
      ) : (
        <>
          <div className="overflow-x-auto border rounded-lg shadow-sm">
            <table className="min-w-full table-auto text-sm text-gray-800">
              <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
                <tr>
                  <th className="px-4 py-2 border">STT</th>
                  <th className="px-4 py-2 border">Họ tên</th>
                  <th className="px-4 py-2 border">CMND/CCCD</th>
                  <th className="px-4 py-2 border">Giới tính</th>
                  <th className="px-4 py-2 border">Ngày sinh</th>
                  <th className="px-4 py-2 border">SĐT</th>
                  <th className="px-4 py-2 border">Email</th>
                  <th className="px-4 py-2 border">Đăng ký?</th>
                  <th className="px-4 py-2 border">Số hồ sơ</th>
                  <th className="px-4 py-2 border">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {currentPatients.map((p, index) => (
                  <tr key={p._id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border text-center">
                      {startIndex + index + 1}
                    </td>
                    <td className="px-4 py-2 border">
                      {p.userID?.name || p.name || "—"}
                    </td>
                    <td className="px-4 py-2 border text-center">
                      {p.personalID || "—"}
                    </td>
                    <td className="px-4 py-2 border text-center">
                      {p.gender === "Male"
                        ? "Nam"
                        : p.gender === "Female"
                        ? "Nữ"
                        : "—"}
                    </td>
                    <td className="px-4 py-2 border text-center">
                      {p.dob
                        ? new Date(p.dob).toLocaleDateString("vi-VN")
                        : "—"}
                    </td>
                    <td className="px-4 py-2 border text-center">
                      {p.userID?.phone || p.contactPhones?.[0] || "—"}
                    </td>
                    <td className="px-4 py-2 border text-center">
                      {p.contactEmails?.[0] || "—"}
                    </td>
                    <td className="px-4 py-2 border text-center">
                      <span
                        className={`px-2 py-1 text-xs rounded-full font-medium ${
                          p.isRegistered
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {p.isRegistered ? "Đã đăng ký" : "Khách vãng lai"}
                      </span>
                    </td>
                    <td className="px-4 py-2 border text-center">
                      {p.medicalRecordID?.length || 0}
                    </td>
                    <td className="px-4 py-2 border text-center">
                      <button
                        onClick={() => handleView(p._id)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs"
                      >
                        Xem
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center mt-6 gap-6">
            <button
              onClick={handlePrev}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded transition ${
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
              className={`px-4 py-2 rounded transition ${
                currentPage === totalPages
                  ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                  : "bg-teal-500 text-white hover:bg-teal-600"
              }`}
            >
              Trang sau →
            </button>
          </div>
        </>
      )}

      {/* Modal chi tiết */}
      {selectedPatientId && (
        <ManagerDetailPatient
          patientId={selectedPatientId}
          onClose={() => setSelectedPatientId(null)}
        />
      )}
    </div>
  );
};

export default PatientList;
