import React, { useEffect, useState } from "react";
import appointmentlistService from "../../Services/StaffService/appointmentlistService";

const AppointmentList = () => {
  const [appointments, setAppointments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(10);

  // Bộ lọc
  const [searchDate, setSearchDate] = useState("");
  const [searchPatient, setSearchPatient] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  // Modal
  const [showModal, setShowModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [cancelReason, setCancelReason] = useState("");

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await appointmentlistService.getAllAppointments();
      setAppointments(res.data);
    } catch (err) {
      console.error("Lỗi khi lấy dữ liệu lịch hẹn:", err);
    }
  };
  console.log("Appointments:", appointments);

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
    const matchesStatus = !filterStatus || status === filterStatus.toLowerCase();

    return matchesDate && matchesPatient && matchesStatus;
  });

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredAppointments.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredAppointments.length / recordsPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const openModal = (appointment) => {
    setSelectedAppointment(appointment);
    setCancelReason("");
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedAppointment(null);
    setShowModal(false);
  };

  const handleSubmitCancel = async () => {
    if (!cancelReason.trim()) return alert("Vui lòng nhập lý do hủy!");

    try {
      await appointmentlistService.cancelAppointment({appointmentId: selectedAppointment._id}, {
        reason: cancelReason,
      });

      await fetchAppointments(); // reload lại danh sách
      closeModal();
    } catch (error) {
      console.error("Lỗi khi hủy lịch:", error);
      alert("Hủy lịch thất bại!");
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white p-4 rounded-md shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-700">Lịch Hẹn</h2>
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Book Appointment
          </button>
        </div>

        {/* Bộ lọc */}
        <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
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
            placeholder="Search by patient name"
            className="border rounded px-3 py-2"
            value={searchPatient}
            onChange={(e) => {
              setSearchPatient(e.target.value);
              setCurrentPage(1);
            }}
          />
          <select
            className="border rounded px-3 py-2"
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="">Tất Cả</option>
            <option value="Chờ thanh toán">Chờ thanh toán</option>
            <option value="Đang xét duyệt">Đang xét duyệt</option>
            <option value="Hoàn tất đặt lịch">Hoàn tất đặt lịch</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left border border-gray-200">
            <thead className="bg-gray-100 text-gray-600 font-semibold">
              <tr>
                <th className="p-2 border">#</th>
                <th className="p-2 border">Patient</th>
                <th className="p-2 border">Doctor</th>
                <th className="p-2 border">Date</th>
                <th className="p-2 border">Start</th>
                <th className="p-2 border">Service</th>
                <th className="p-2 border">Status</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentRecords.map((item, index) => {
                const doctorEmail = item?.doctorSlotID[0]?.doctorID?.userID?.name;
                const patientID = item?.patientID?.userID?.name || "----";
                const date = new Date(item.date).toLocaleDateString("vi-VN");
                const startTime = extractTimeFromUTC(item.startTime);
                const status = item.status || "N/A";
                const service = item?.serviceID?.name || "N/A";

                return (
                  <tr key={item._id} className="hover:bg-gray-50">
                    <td className="p-2 border">{indexOfFirstRecord + index + 1}</td>
                    <td className="p-2 border">{patientID}</td>
                    <td className="p-2 border">{doctorEmail}</td>
                    <td className="p-2 border">{date}</td>
                    <td className="p-2 border">{startTime}</td>
                    <td className="p-2 border">{service}</td>
                    <td className="p-2 border capitalize">{status.replace(/_/g, " ")}</td>
                    <td className="p-2 border text-center">
                      <button
                        className="text-red-600 hover:text-red-800 border border-red-500 px-2 py-1 rounded"
                        onClick={() => openModal(item)}
                      >
                        Hủy hẹn
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
            Showing {indexOfFirstRecord + 1} to{" "}
            {Math.min(indexOfLastRecord, filteredAppointments.length)} of{" "}
            {filteredAppointments.length} records
          </div>
          <div className="flex gap-2">
            <button
              onClick={prevPage}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded ${
                currentPage === 1
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
              <button
                key={number}
                onClick={() => paginate(number)}
                className={`px-3 py-1 rounded ${
                  currentPage === number
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {number}
              </button>
            ))}
            <button
              onClick={nextPage}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded ${
                currentPage === totalPages
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Modal hủy lịch */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-md shadow-md w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">Nhập lý do hủy</h3>
            <textarea
              className="w-full border px-3 py-2 rounded mb-4"
              rows={4}
              placeholder="Nhập lý do hủy..."
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded"
              >
                Hủy
              </button>
              <button
                onClick={handleSubmitCancel}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
              >
                Xác nhận hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentList;