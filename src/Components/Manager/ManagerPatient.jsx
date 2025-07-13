import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import patientManagerService from "../../Services/ManagerService/patientManagerService";
import VisibilityIcon from "@mui/icons-material/Visibility";

const ManagerPatient = ({ token }) => {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGender, setSelectedGender] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [patientsPerPage] = useState(10);
  const [selectedPatient, setSelectedPatient] = useState(null);

  useEffect(() => {
    const fetchPatients = async () => {
      setLoading(true);
      try {
        const res = await patientManagerService.getAllPatients(token);
        const patientList = Array.isArray(res.data)
          ? res.data
          : res.data.data || [];
        const validPatients = patientList.filter(
          (patient) => patient && typeof patient === "object" && patient._id
        );
        setPatients(validPatients);
        setFilteredPatients(validPatients);
      } catch (err) {
        console.error("Không thể tải danh sách bệnh nhân:", err);
        toast.error(`Không thể tải danh sách bệnh nhân: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchPatients();
  }, [token]);

  useEffect(() => {
    let results = patients;

    if (searchTerm) {
      results = results.filter((patient) =>
        patient?.name && typeof patient.name === "string"
          ? patient.name.toLowerCase().includes(searchTerm.toLowerCase())
          : false
      );
    }

    if (selectedGender) {
      results = results.filter((patient) => patient?.gender === selectedGender);
    }

    if (selectedStatus) {
      results = results.filter((patient) =>
        selectedStatus === "Đã đăng ký"
          ? patient.isRegistered
          : selectedStatus === "Chưa xóa"
          ? !patient.isDeleted
          : patient.isDeleted
      );
    }

    setFilteredPatients(results);
    setCurrentPage(1);
  }, [searchTerm, selectedGender, selectedStatus, patients]);

  const handleViewDetails = (patient) => {
    setSelectedPatient(patient);
  };

  const handleCloseDetails = () => {
    setSelectedPatient(null);
  };

  // Pagination
  const indexOfLastPatient = currentPage * patientsPerPage;
  const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;
  const currentPatients = filteredPatients.slice(
    indexOfFirstPatient,
    indexOfLastPatient
  );
  const totalPages = Math.ceil(filteredPatients.length / patientsPerPage);
  /*************  ✨ Windsurf Command 🌟  *************/
  /**
   * Handle page change event.
   * @param {number} pageNumber - The page number to switch to.
   */

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  /**
   * Handle previous page button click event.
   */
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  /**
   * Handle next page button click event.
   */
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="Container mx-auto mt-10 mb-10">
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-teal-600">
            Danh Sách Bệnh Nhân
          </h1>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative w-full sm:w-1/3">
            <input
              type="text"
              placeholder="Tìm kiếm theo tên..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-teal-100 rounded-lg px-3 py-2 pl-10 text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600"
            />
            <svg
              className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
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
          <select
            value={selectedGender}
            onChange={(e) => setSelectedGender(e.target.value)}
            className="w-full sm:w-1/4 bg-white border border-teal-100 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600"
          >
            <option value="">Tất cả giới tính</option>
            <option value="Nam">Nam</option>
            <option value="Nữ">Nữ</option>
            <option value="Khác">Khác</option>
          </select>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full sm:w-1/4 bg-white border border-teal-100 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="Đã đăng ký">Đã đăng ký</option>
            <option value="Chưa xóa">Chưa xóa</option>
            <option value="Đã xóa">Đã xóa</option>
          </select>
        </div>

        {loading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-teal-600"></div>
          </div>
        ) : filteredPatients.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-lg text-gray-500">
              Không tìm thấy bệnh nhân nào.
            </p>
          </div>
        ) : (
          <div className="bg-teal-50 border border-teal-100 rounded-xl shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-teal-600 text-white">
                <tr>
                  <th className="py-3 px-4 text-left font-medium">Họ Tên</th>
                  <th className="py-3 px-4 text-left font-medium">Ngày Sinh</th>
                  <th className="py-3 px-4 text-left font-medium">Giới Tính</th>
                  <th className="py-3 px-4 text-left font-medium">Email</th>
                  <th className="py-3 px-4 text-left font-medium">
                    Điện Thoại
                  </th>
                  <th className="py-3 px-4 text-left font-medium">CMND/CCCD</th>
                  <th className="py-3 px-4 text-left font-medium">Ví (VNĐ)</th>
                  <th className="py-3 px-4 text-left font-medium">
                    Trạng Thái
                  </th>
                  <th className="py-3 px-4 text-center font-medium">
                    Hành Động
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentPatients.map((patient) => (
                  <tr
                    key={patient._id}
                    className="hover:bg-teal-100 transition-colors"
                  >
                    <td className="py-3 px-4 text-gray-700">
                      {patient.name || "N/A"}
                    </td>
                    <td className="py-3 px-4 text-gray-700">
                      {patient.dob
                        ? new Date(patient.dob).toLocaleDateString("vi-VN")
                        : "N/A"}
                    </td>
                    <td className="py-3 px-4 text-gray-700">
                      {patient.gender || "N/A"}
                    </td>
                    <td className="py-3 px-4 text-gray-700">
                      {patient.contactEmails?.[0] || "N/A"}
                    </td>
                    <td className="py-3 px-4 text-gray-700">
                      {patient.contactPhones?.[0] || "N/A"}
                    </td>
                    <td className="py-3 px-4 text-gray-700">
                      {patient.personalID || "N/A"}
                    </td>
                    <td className="py-3 px-4 text-gray-700">
                      {patient.wallet?.toLocaleString("vi-VN") || 0}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                          patient.isRegistered
                            ? "bg-green-500 text-white"
                            : "bg-red-500 text-white"
                        }`}
                      >
                        {patient.isRegistered ? "Đã đăng ký" : "Chưa đăng ký"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleViewDetails(patient)}
                          className="text-teal-600 hover:text-teal-700 transition-colors"
                          title="Xem chi tiết"
                        >
                          <VisibilityIcon fontSize="small" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-4">
            <div className="text-gray-600">
              Hiển thị {indexOfFirstPatient + 1} -{" "}
              {Math.min(indexOfLastPatient, filteredPatients.length)} /{" "}
              {filteredPatients.length} bệnh nhân
            </div>
            <div className="flex gap-2">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded-lg ${
                  currentPage === 1
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-teal-600 text-white hover:bg-teal-700"
                }`}
              >
                Trước
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-1 rounded-lg ${
                      currentPage === page
                        ? "bg-teal-600 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded-lg ${
                  currentPage === totalPages
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-teal-600 text-white hover:bg-teal-700"
                }`}
              >
                Sau
              </button>
            </div>
          </div>
        )}

        {/* Details Dialog */}
        {selectedPatient && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            <div className="bg-teal-50 rounded-xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
              <h2 className="text-xl font-bold text-teal-600 mb-4">
                Chi Tiết Bệnh Nhân
              </h2>
              <div className="space-y-4 text-gray-700">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <p>
                    <span className="font-medium">Họ tên:</span>{" "}
                    {selectedPatient.name || "N/A"}
                  </p>
                  <p>
                    <span className="font-medium">ID Bệnh nhân:</span>{" "}
                    {selectedPatient._id || "N/A"}
                  </p>
                  <p>
                    <span className="font-medium">Ngày sinh:</span>{" "}
                    {selectedPatient.dob
                      ? new Date(selectedPatient.dob).toLocaleDateString(
                          "vi-VN"
                        )
                      : "N/A"}
                  </p>
                  <p>
                    <span className="font-medium">Giới tính:</span>{" "}
                    {selectedPatient.gender || "N/A"}
                  </p>
                  <p>
                    <span className="font-medium">Email:</span>{" "}
                    {selectedPatient.contactEmails?.[0] || "N/A"}
                  </p>
                  <p>
                    <span className="font-medium">Điện thoại:</span>{" "}
                    {selectedPatient.contactPhones?.[0] || "N/A"}
                  </p>
                  <p>
                    <span className="font-medium">CMND/CCCD:</span>{" "}
                    {selectedPatient.personalID || "N/A"}
                  </p>
                  <p>
                    <span className="font-medium">Ví (VNĐ):</span>{" "}
                    {selectedPatient.wallet?.toLocaleString("vi-VN") || 0}
                  </p>
                  <p>
                    <span className="font-medium">Đã đăng ký:</span>{" "}
                    {selectedPatient.isRegistered ? "Có" : "Không"}
                  </p>
                  <p>
                    <span className="font-medium">Trạng thái xóa:</span>{" "}
                    {selectedPatient.isDeleted ? "Đã xóa" : "Chưa xóa"}
                  </p>
                  <p>
                    <span className="font-medium">Ngày tạo:</span>{" "}
                    {selectedPatient.createdAt
                      ? new Date(selectedPatient.createdAt).toLocaleString(
                          "vi-VN"
                        )
                      : "N/A"}
                  </p>
                  <p>
                    <span className="font-medium">Ngày cập nhật:</span>{" "}
                    {selectedPatient.updatedAt
                      ? new Date(selectedPatient.updatedAt).toLocaleString(
                          "vi-VN"
                        )
                      : "N/A"}
                  </p>
                  <p>
                    <span className="font-medium">User ID:</span>{" "}
                    {selectedPatient.userID?._id || "N/A"}
                  </p>
                  <p>
                    <span className="font-medium">Tên User:</span>{" "}
                    {selectedPatient.userID?.name || "N/A"}
                  </p>
                  <p>
                    <span className="font-medium">SĐT User:</span>{" "}
                    {selectedPatient.userID?.phone || "N/A"}
                  </p>
                </div>
                <div className="mt-4">
                  <p className="font-medium">Hồ sơ y tế:</p>
                  {selectedPatient.medicalRecordID?.length > 0 ? (
                    <div className="mt-2 space-y-2">
                      {selectedPatient.medicalRecordID.map((record, index) => (
                        <div
                          key={record._id}
                          className="p-4 bg-teal-100 rounded-lg"
                        >
                          <p>
                            <span className="font-medium">
                              Hồ sơ {index + 1}:
                            </span>{" "}
                            ID {record._id}
                          </p>
                          <p>
                            <span className="font-medium">Chẩn đoán:</span>{" "}
                            {record.diagnosis || "N/A"}
                          </p>
                          <p>
                            <span className="font-medium">Triệu chứng:</span>{" "}
                            {record.symptoms || "N/A"}
                          </p>
                          <p>
                            <span className="font-medium">
                              Ghi chú lâm sàng:
                            </span>{" "}
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
              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleCloseDetails}
                  className="bg-gray-200 text-gray-700 rounded-lg px-4 py-2 hover:bg-gray-300 transition-colors"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManagerPatient;
