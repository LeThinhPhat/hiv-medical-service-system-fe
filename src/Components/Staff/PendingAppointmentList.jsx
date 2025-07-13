import React, { useEffect, useState } from "react";
import appointmentlistService from "../../Services/StaffService/appointmentlistService";
import { FaCheck } from "react-icons/fa";

const PendingAppointmentList = () => {
  const [appointments, setAppointments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(10);
  const [searchDate, setSearchDate] = useState("");
  const [searchPatient, setSearchPatient] = useState("");
  const [showModal, setShowModal] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await appointmentlistService.getAllAppointments();
      setAppointments(res.data);
    } catch (err) {
      console.error("Lỗi khi lấy dữ liệu lịch hẹn:", err);
      showToast("Lỗi khi lấy dữ liệu lịch hẹn", "error");
    }
  };

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
  };

  const extractTimeFromUTC = (utcString) => {
    const date = new Date(utcString);
    const hours = String(date.getUTCHours()).padStart(2, "0");
    const minutes = String(date.getUTCMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const filteredAppointments = appointments.filter((item) => {
    const patientName = item?.patientID?.userID?.name?.toLowerCase() || "";
    const appointmentDate = new Date(item.date).toISOString().split("T")[0];
    const status = item.status?.toLowerCase() || "";
    const matchesDate = !searchDate || appointmentDate === searchDate;
    const matchesPatient = !searchPatient || patientName.includes(searchPatient.toLowerCase());
    const isPending = status === "đang xét duyệt";
    return matchesDate && matchesPatient && isPending;
  });

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
const currentRecords = filteredAppointments.reverse().slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredAppointments.length / recordsPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const openModal = (appointment) => {
    setSelectedAppointment(appointment);
    setShowModal("approve");
  };

  const closeModal = () => {
    setSelectedAppointment(null);
    setShowModal(null);
    setLoading(false);
  };

  const handleApprove = async () => {
    setLoading(true);
    try {
      await appointmentlistService.confirmAppointment(selectedAppointment._id);
      await fetchAppointments();
      closeModal();
      showToast("Duyệt lịch hẹn thành công!", "success");
    } catch (error) {
      console.error("Lỗi khi duyệt lịch:", error);
      showToast("Duyệt lịch thất bại!", "error");
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white p-4 rounded-md shadow-md">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Lịch Hẹn Đang Xét Duyệt</h2>

        <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="date"
            className="border rounded px-3 py-2"
            value={searchDate}
            onChange={(e) => {
              setSearchDate(e.target.value);
              setCurrentPage(1);
            }}
          />
          <input
            type="text"
            placeholder="Tìm theo tên bệnh nhân"
            className="border rounded px-3 py-2"
            value={searchPatient}
            onChange={(e) => {
              setSearchPatient(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left border border-gray-200">
            <thead className="bg-gray-100 text-gray-600 font-semibold">
              <tr>
                <th className="p-2 border">#</th>
                <th className="p-2 border">Bệnh nhân</th>
                <th className="p-2 border">Bác sĩ</th>
                <th className="p-2 border">Ngày</th>
                <th className="p-2 border">Giờ</th>
                <th className="p-2 border">Dịch vụ</th>
                <th className="p-2 border text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {currentRecords.map((item, index) => {
                const doctorName = item?.doctorSlotID[0]?.doctorID?.userID?.name || "----";
                const patientName = item?.patientID?.userID?.name || "----";
                const date = new Date(item.startTime).toLocaleDateString("vi-VN");
                const startTime = extractTimeFromUTC(item.startTime);
                const service = item?.serviceID?.name || "N/A";

                return (
                  <tr key={item._id} className="hover:bg-gray-50">
                    <td className="p-2 border">{indexOfFirstRecord + index + 1}</td>
                    <td className="p-2 border">{patientName}</td>
                    <td className="p-2 border">{doctorName}</td>
                    <td className="p-2 border">{date}</td>
                    <td className="p-2 border">{startTime}</td>
                    <td className="p-2 border">{service}</td>
                    <td className="p-2 border text-center">
                      <button
                        className="text-sky-500 hover:text-sky-700 border border-sky-400 px-2 py-1 rounded text-sm flex items-center gap-1 justify-center mx-auto"
                        onClick={() => openModal(item)}
                      >
                        <FaCheck /> Duyệt
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-4 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Hiển thị từ {indexOfFirstRecord + 1} đến{" "}
            {Math.min(indexOfLastRecord, filteredAppointments.length)} trong tổng{" "}
            {filteredAppointments.length} lịch hẹn
          </div>
          <div className="flex gap-2">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => paginate(i + 1)}
                className={`px-3 py-1 rounded ${
                  currentPage === i + 1
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Approval Modal */}
      {showModal === "approve" && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-md shadow-md w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">
              Bạn có chắc chắn muốn duyệt lịch hẹn này?
            </h3>
            <div className="flex justify-end gap-2">
              <button
                onClick={handleApprove}
                disabled={loading}
                className={`px-4 py-2 rounded text-white ${
                  loading
                    ? "bg-sky-400 opacity-50 cursor-not-allowed"
                    : "bg-sky-400 hover:bg-sky-500"
                }`}
              >
                {loading ? "Đang xử lý..." : "Xác nhận"}
              </button>
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast.show && (
        <div
          className={`fixed top-4 right-4 p-4 rounded-md shadow-md text-white transition-opacity duration-300 ${
            toast.type === "success" ? "bg-sky-400" : "bg-red-600"
          }`}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
};

export default PendingAppointmentList;
