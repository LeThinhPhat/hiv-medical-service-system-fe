import React, { useEffect, useState } from "react";
import {
  FaSearch,
  FaTimes,
  FaCalendar,
  FaUser,
  FaFilter,
} from "react-icons/fa";
import dayjs from "dayjs";
import appointmentlistService from "../../Services/StaffService/appointmentlistService";

const AppointmentList = () => {
  const [appointments, setAppointments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(10);
  const [searchDate, setSearchDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [searchPatient, setSearchPatient] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [cancelReason, setCancelReason] = useState("");
  const [toast, setToast] = useState({ show: false, message: "" });

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

  const extractTimeFromUTC = (utcString) => {
    const date = new Date(utcString);
    const hours = String(date.getUTCHours()).padStart(2, "0");
    const minutes = String(date.getUTCMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  };

const filteredAppointments = appointments.filter((item) => {
  const patientName = item?.patientID?.userID?.name?.toLowerCase() || "";
  const appointmentDate = item.rawDate || dayjs(item.date).format("YYYY-MM-DD");
  const status = item.status?.toLowerCase() || "";

  const matchesDate = !searchDate || appointmentDate === searchDate;
  const matchesPatient =
    !searchPatient || patientName.includes(searchPatient.toLowerCase());
  const matchesStatus =
    !filterStatus || status === filterStatus.toLowerCase();

  return matchesDate && matchesPatient && matchesStatus;
});


  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredAppointments
    .reverse()
    .slice(indexOfFirstRecord, indexOfLastRecord);
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

  const showToast = (message) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: "" }), 3000);
  };

  const handleSubmitCancel = async () => {
    if (!cancelReason.trim()) {
      alert("Vui lòng nhập lý do hủy!");
      return;
    }

    try {
      await appointmentlistService.cancelAppointment(
        selectedAppointment._id,
        cancelReason
      );
      await fetchAppointments();
      closeModal();
      showToast("Đã hủy thành công");
    } catch (error) {
      console.error("Lỗi khi hủy lịch:", error);
      alert("Hủy lịch thất bại!");
    }
  };

  const clearSearchPatient = () => {
    setSearchPatient("");
    setCurrentPage(1);
  };

  return (
    <div className=" Container bg-gradient-to-b  px-4 py-8 sm:px-6 lg:px-8">
      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed top-6 right-6 z-50 bg-white/90 backdrop-blur-sm text-green-600 px-4 py-3 rounded-xl shadow-lg border border-green-200/50 transition-all duration-300 animate-in zoom-in-95 fade-in">
          {toast.message}
        </div>
      )}

      <div className="bg-white rounded-3xl shadow-xl p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Danh Sách Lịch Hẹn
          </h2>
          {/* <button className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-5 py-2.5 rounded-full hover:from-blue-700 hover:to-blue-600 transition-all duration-300 font-medium shadow-sm">
            Đặt Lịch Hẹn
          </button> */}
        </div>

        {/* Filter and Search Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="relative group">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Ngày Hẹn
            </label>
            <div className="relative">
              <FaCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-blue-500 transition-colors duration-200" />
              <input
                type="date"
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-gray-700 placeholder-gray-400"
                value={searchDate}
                onChange={(e) => {
                  setSearchDate(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>
          <div className="relative group">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Tên Bệnh Nhân
            </label>
            <div className="relative">
              <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-blue-500 transition-colors duration-200" />
              <input
                type="text"
                placeholder="Tìm theo tên bệnh nhân"
                className="w-full pl-10 pr-10 py-3 bg-white border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-gray-700 placeholder-gray-400"
                value={searchPatient}
                onChange={(e) => {
                  setSearchPatient(e.target.value);
                  setCurrentPage(1);
                }}
              />
              {searchPatient && (
                <FaTimes
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer hover:text-gray-600 transition-colors duration-200"
                  onClick={clearSearchPatient}
                />
              )}
            </div>
          </div>
          <div className="relative group">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Trạng Thái
            </label>
            <div className="relative">
              <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-blue-500 transition-colors duration-200" />
              <select
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-gray-700 appearance-none"
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
                <option value="cancelled">Đã Hủy</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gradient-to-r from-gray-100 to-gray-50 text-gray-700 font-semibold">
              <tr>
                <th className="p-4 border-b">STT</th>
                <th className="p-4 border-b">Bệnh Nhân</th>
                <th className="p-4 border-b">Bác Sĩ</th>
                <th className="p-4 border-b">Ngày</th>
                <th className="p-4 border-b">Giờ Bắt Đầu</th>
                <th className="p-4 border-b">Dịch Vụ</th>
                <th className="p-4 border-b">Trạng Thái</th>
                <th className="p-4 border-b">Hành Động</th>
              </tr>
            </thead>
            <tbody>
              {currentRecords.map((item, index) => {
                const doctorEmail =
                  item?.doctorSlotID[0]?.doctorID?.userID?.name || "----";
                const patientID = item?.patientID?.userID?.name || "----";
                const date = new Date(item.date).toLocaleDateString("vi-VN");
                const startTime = extractTimeFromUTC(item.startTime);
                const status = item.status || "N/A";
                const service = item?.serviceID?.name || "N/A";

                return (
                  <tr
                    key={item._id}
                    className={`transition-colors duration-200 ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    } hover:bg-blue-50/50`}
                  >
                    <td className="p-4 border-b font-medium">
                      {indexOfFirstRecord + index + 1}
                    </td>
                    <td className="p-4 border-b">{patientID}</td>
                    <td className="p-4 border-b">{doctorEmail}</td>
                    <td className="p-4 border-b">{date}</td>
                    <td className="p-4 border-b">{startTime}</td>
                    <td className="p-4 border-b">{service}</td>
                    <td className="p-4 border-b capitalize">
                      {status.replace(/_/g, " ")}
                    </td>
                    <td className="p-4 border-b text-center">
                      <button
                        className="text-red-600 border border-red-400 px-3 py-1.5 rounded-full hover:bg-red-50 hover:text-red-700 hover:border-red-500 transition-all duration-200 font-medium"
                        onClick={() => openModal(item)}
                      >
                        Hủy Hẹn
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="text-sm text-gray-600 font-medium">
            Hiển thị {indexOfFirstRecord + 1} đến{" "}
            {Math.min(indexOfLastRecord, filteredAppointments.length)} trong
            tổng số {filteredAppointments.length} bản ghi
          </div>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={prevPage}
              disabled={currentPage === 1}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition-all duration-200"
            >
              ←
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (number) => (
                <button
                  key={number}
                  onClick={() => paginate(number)}
                  className={`w-10 h-10 flex items-center justify-center rounded-full transition-all duration-200 ${
                    currentPage === number
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {number}
                </button>
              )
            )}
            <button
              onClick={nextPage}
              disabled={currentPage === totalPages}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition-all duration-200"
            >
              →
            </button>
          </div>
        </div>
      </div>

      {/* Cancel Appointment Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50 transition-opacity duration-300 animate-in fade-in">
          <div className="bg-white/95 backdrop-blur-md p-6 rounded-2xl shadow-2xl w-full max-w-md border border-gray-100/50">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Nhập Lý Do Hủy
            </h3>
            <textarea
              className="w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300 bg-white/80 text-gray-700 placeholder-gray-400 resize-none"
              rows={4}
              placeholder="Nhập lý do hủy..."
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
            />
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition-all duration-200 font-medium"
              >
                Hủy
              </button>
              <button
                onClick={handleSubmitCancel}
                className="px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-all duration-200 font-medium"
              >
                Xác Nhận Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentList;
