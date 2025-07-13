import React, { useEffect, useState } from "react";
import patientManagerService from "../../Services/ManagerService/patientManagerService";
import toast from "react-hot-toast";

const ManagerPatient = ({ token }) => {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [patientsPerPage] = useState(10);
  const [selectedPatient, setSelectedPatient] = useState(null);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await patientManagerService.getAllPatients(token);
        const patientList = Array.isArray(res.data)
          ? res.data
          : res.data.data || [];
        // Validate patient data
        const validPatients = patientList.filter(
          (patient) => patient && typeof patient === "object" && patient._id
        );
        setPatients(validPatients);
        setFilteredPatients(validPatients);
      } catch (err) {
        setError("Không thể tải danh sách bệnh nhân.");
        toast.error("Không thể tải danh sách bệnh nhân.");
      } finally {
        setLoading(false);
      }
    };
    fetchPatients();
  }, [token]);

  // Search functionality
  useEffect(() => {
    const results = patients.filter((patient) =>
      patient?.name && typeof patient.name === "string"
        ? patient.name.toLowerCase().includes(searchTerm.toLowerCase())
        : false
    );
    setFilteredPatients(results);
    setCurrentPage(1);
  }, [searchTerm, patients]);

  // Pagination
  const indexOfLastPatient = currentPage * patientsPerPage;
  const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;
  const currentPatients = filteredPatients.slice(
    indexOfFirstPatient,
    indexOfLastPatient
  );
  const totalPages = Math.ceil(filteredPatients.length / patientsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleViewDetails = (patient) => {
    setSelectedPatient(patient);
  };

  const closeModal = () => {
    setSelectedPatient(null);
  };

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
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl mb-6">
          <div className="bg-gradient-to-r from-teal-700 to-teal-500 p-6 rounded-t-2xl">
            <h2 className="text-3xl font-bold text-white">
              Danh sách bệnh nhân
            </h2>
          </div>

          {/* Search Bar */}
          <div className="p-6">
            <div className="relative max-w-md mb-6">
              <input
                type="text"
                placeholder="Tìm kiếm theo tên..."
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

            {/* Table */}
            {filteredPatients.length === 0 ? (
              <div className="text-center p-8 bg-gray-50 rounded-lg shadow-sm text-gray-500 text-lg">
                Không tìm thấy bệnh nhân nào.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead className="bg-gray-100 text-gray-700">
                    <tr>
                      <th className="p-4 text-left font-semibold">Họ tên</th>
                      <th className="p-4 text-left font-semibold">Ngày sinh</th>
                      <th className="p-4 text-left font-semibold">Giới tính</th>
                      <th className="p-4 text-left font-semibold">Email</th>
                      <th className="p-4 text-left font-semibold">
                        Điện thoại
                      </th>
                      <th className="p-4 text-left font-semibold">CMND/CCCD</th>
                      <th className="p-4 text-left font-semibold">Ví (VNĐ)</th>
                      <th className="p-4 text-left font-semibold">Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentPatients.map((patient) => (
                      <tr
                        key={patient._id}
                        className="border-b hover:bg-gray-50 transition-colors"
                      >
                        <td className="p-4 text-gray-700">
                          {patient.name || "N/A"}
                        </td>
                        <td className="p-4 text-gray-700">
                          {patient.dob
                            ? new Date(patient.dob).toLocaleDateString("vi-VN")
                            : "N/A"}
                        </td>
                        <td className="p-4 text-gray-700">
                          {patient.gender || "N/A"}
                        </td>
                        <td className="p-4 text-gray-700">
                          {patient.contactEmails?.[0] || "N/A"}
                        </td>
                        <td className="p-4 text-gray-700">
                          {patient.contactPhones?.[0] || "N/A"}
                        </td>
                        <td className="p-4 text-gray-700">
                          {patient.personalID || "N/A"}
                        </td>
                        <td className="p-4 text-gray-700">
                          {patient.wallet?.toLocaleString("vi-VN") || 0}
                        </td>
                        <td className="p-4">
                          <button
                            onClick={() => handleViewDetails(patient)}
                            className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition"
                          >
                            Xem chi tiết
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center space-x-2 p-6">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50 hover:bg-gray-300"
              >
                Trước
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => paginate(i + 1)}
                  className={`px-4 py-2 rounded-lg ${
                    currentPage === i + 1
                      ? "bg-teal-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50 hover:bg-gray-300"
              >
                Sau
              </button>
            </div>
          )}
        </div>

        {/* Modal for Patient Details */}
        {selectedPatient && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <h3 className="text-2xl font-bold mb-6 text-gray-800">
                Chi tiết bệnh nhân
              </h3>
              <div className="space-y-4 text-gray-700">
                <div className="grid grid-cols-2 gap-4">
                  <p>
                    <strong>Họ tên:</strong> {selectedPatient.name || "N/A"}
                  </p>
                  <p>
                    <strong>ID Bệnh nhân:</strong>{" "}
                    {selectedPatient._id || "N/A"}
                  </p>
                  <p>
                    <strong>Ngày sinh:</strong>{" "}
                    {selectedPatient.dob
                      ? new Date(selectedPatient.dob).toLocaleDateString(
                          "vi-VN"
                        )
                      : "N/A"}
                  </p>
                  <p>
                    <strong>Giới tính:</strong>{" "}
                    {selectedPatient.gender || "N/A"}
                  </p>
                  <p>
                    <strong>Email:</strong>{" "}
                    {selectedPatient.contactEmails?.[0] || "N/A"}
                  </p>
                  <p>
                    <strong>Điện thoại:</strong>{" "}
                    {selectedPatient.contactPhones?.[0] || "N/A"}
                  </p>
                  <p>
                    <strong>CMND/CCCD:</strong>{" "}
                    {selectedPatient.personalID || "N/A"}
                  </p>
                  <p>
                    <strong>Ví (VNĐ):</strong>{" "}
                    {selectedPatient.wallet?.toLocaleString("vi-VN") || 0}
                  </p>
                  <p>
                    <strong>Đã đăng ký:</strong>{" "}
                    {selectedPatient.isRegistered ? "Có" : "Không"}
                  </p>
                  <p>
                    <strong>Trạng thái xóa:</strong>{" "}
                    {selectedPatient.isDeleted ? "Đã xóa" : "Chưa xóa"}
                  </p>
                  <p>
                    <strong>Ngày tạo:</strong>{" "}
                    {selectedPatient.createdAt
                      ? new Date(selectedPatient.createdAt).toLocaleString(
                          "vi-VN"
                        )
                      : "N/A"}
                  </p>
                  <p>
                    <strong>Ngày cập nhật:</strong>{" "}
                    {selectedPatient.updatedAt
                      ? new Date(selectedPatient.updatedAt).toLocaleString(
                          "vi-VN"
                        )
                      : "N/A"}
                  </p>
                  <p>
                    <strong>User ID:</strong>{" "}
                    {selectedPatient.userID?._id || "N/A"}
                  </p>
                  <p>
                    <strong>Tên User:</strong>{" "}
                    {selectedPatient.userID?.name || "N/A"}
                  </p>
                  <p>
                    <strong>SĐT User:</strong>{" "}
                    {selectedPatient.userID?.phone || "N/A"}
                  </p>
                </div>
                <div className="mt-4">
                  <strong>Hồ sơ y tế:</strong>
                  {selectedPatient.medicalRecordID?.length > 0 ? (
                    <div className="mt-2 space-y-2">
                      {selectedPatient.medicalRecordID.map((record, index) => (
                        <div
                          key={record._id}
                          className="p-4 bg-gray-50 rounded-lg"
                        >
                          <p>
                            <strong>Hồ sơ {index + 1}:</strong> ID {record._id}
                          </p>
                          <p>
                            <strong>Chẩn đoán:</strong>{" "}
                            {record.diagnosis || "N/A"}
                          </p>
                          <p>
                            <strong>Triệu chứng:</strong>{" "}
                            {record.symptoms || "N/A"}
                          </p>
                          <p>
                            <strong>Ghi chú lâm sàng:</strong>{" "}
                            {record.clinicalNotes || "N/A"}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">Không có hồ sơ y tế.</p>
                  )}
                </div>
              </div>
              <button
                onClick={closeModal}
                className="mt-6 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition"
              >
                Đóng
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManagerPatient;
