import React, { useEffect, useState, useMemo } from "react";
import {
  FaSearch,
  FaTimes,
  FaCalendar,
  FaUser,
  FaFilter,
} from "react-icons/fa";
import dayjs from "dayjs";
import appointmentlistService from "../../Services/StaffService/appointmentlistService";

const STATUS_OPTIONS = [
  { value: "", label: "Tất Cả" },
  { value: "Chờ thanh toán", label: "Chờ thanh toán" },
  { value: "Hoàn tất đặt lịch", label: "Hoàn tất đặt lịch" },
  { value: "cancelled", label: "Đã Hủy" },
  { value: "Khách hàng đã checkin", label: "Khách hàng đã checkin" },
  { value: "Khách hàng đã checkout", label: "Khách hàng đã checkout" },
  { value: "Thanh toán thất bại", label: "Thanh toán thất bại" },
];

const NON_CANCELLABLE_STATUSES = [
  "khách hàng đã checkout",
  "khách hàng đã checkin",
  "thanh toán thất bại",
];

const PENDING_STATUS = "đang xét duyệt";

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
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchAppointments();
  }, []);

  useEffect(() => {
    // Prevent body scrolling when modal is open
    if (showModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showModal]);

  const fetchAppointments = async () => {
    setIsLoading(true);
    try {
      const res = await appointmentlistService.getAllAppointments();
      setAppointments(res.data || []);
    } catch (err) {
      console.error("Lỗi khi lấy dữ liệu lịch hẹn:", err);
      showToast("Không thể tải danh sách lịch hẹn", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const extractTimeFromUTC = (utcString) => {
    try {
      const date = new Date(utcString);
      if (isNaN(date.getTime())) return "----";
      const hours = String(date.getUTCHours()).padStart(2, "0");
      const minutes = String(date.getUTCMinutes()).padStart(2, "0");
      return `${hours}:${minutes}`;
    } catch {
      return "----";
    }
  };

  const filteredAppointments = useMemo(() => {
    return appointments.filter((item) => {
      const patientName = item?.patientID?.userID?.name?.toLowerCase() || "";
      const appointmentDate = dayjs(item.startTime).format("YYYY-MM-DD");
      const status = item.status?.toLowerCase() || "";
      const matchesDate = !searchDate || appointmentDate === searchDate;
      const matchesPatient =
        !searchPatient || patientName.includes(searchPatient.toLowerCase());
      const matchesStatus =
        !filterStatus || status === filterStatus.toLowerCase();
      const isNotPending = status !== PENDING_STATUS;
      return matchesDate && matchesPatient && matchesStatus && isNotPending;
    });
  }, [appointments, searchDate, searchPatient, filterStatus]);

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = [...filteredAppointments].slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );
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
    if (!appointment) return;
    setSelectedAppointment(appointment);
    setCancelReason("");
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedAppointment(null);
    setShowModal(false);
  };

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(
      () => setToast({ show: false, message: "", type: "success" }),
      3000
    );
  };

  const handleSubmitCancel = async () => {
    if (!cancelReason.trim()) {
      showToast("Vui lòng nhập lý do hủy!", "error");
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
      showToast("Hủy lịch thất bại!", "error");
    }
  };

  const clearSearchPatient = () => {
    setSearchPatient("");
    setCurrentPage(1);
  };

  const canCancelAppointment = (status) => {
    const lowerCaseStatus = status?.toLowerCase() || "";
    return !NON_CANCELLABLE_STATUSES.includes(lowerCaseStatus);
  };

  return (
    <div className="Container bg-gradient-to-b px-4 py-8 sm:px-6 lg:px-8">
      {/* Toast Notification */}
      {toast.show && (
        <div
          className={`fixed top-6 right-6 z-50 px-4 py-3 rounded-xl shadow-lg border transition-all duration-300 animate-in zoom-in-95 fade-in ${
            toast.type === "success"
              ? "bg-white/90 text-green-600 border-green-200/50"
              : "bg-red-50 text-red-600 border-red-200/50"
          }`}
        >
          {toast.message}
          <button
            onClick={() =>
              setToast({ show: false, message: "", type: "success" })
            }
            className="ml-2 text-sm font-semibold"
          >
            ×
          </button>
        </div>
      )}

      <div className="bg-white rounded-3xl shadow-xl p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Danh Sách Lịch Hẹn
          </h2>
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
                <button
                  onClick={clearSearchPatient}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  aria-label="Xóa tìm kiếm"
                >
                  <FaTimes />
                </button>
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
                aria-label="Lọc theo trạng thái"
              >
                {STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Loading and No Data State */}
        {isLoading ? (
          <div className="text-center py-8 text-gray-600">
            Đang tải dữ liệu...
          </div>
        ) : currentRecords.length === 0 ? (
          <div className="text-center py-8 text-gray-600">
            Không tìm thấy lịch hẹn nào.
          </div>
        ) : (
          <>
            {/* Table */}
            <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
              <table
                className="min-w-full text-sm text-left"
                aria-label="Danh sách lịch hẹn"
              >
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
                    const date = dayjs(item.startTime).format("DD/MM/YYYY");
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
                          {canCancelAppointment(status) && (
                            <button
                              className="text-red-600 border border-red-400 px-3 py-1.5 rounded-full hover:bg-red-50 hover:text-red-700 hover:border-red-500 transition-all duration-200 font-medium"
                              onClick={() => openModal(item)}
                              aria-label={`Hủy lịch hẹn cho ${patientID}`}
                            >
                              Hủy Hẹn
                            </button>
                          )}
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
                  aria-label="Trang trước"
                >
                  ←
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .slice(
                    Math.max(0, currentPage - 3),
                    Math.min(totalPages, currentPage + 2)
                  )
                  .map((number) => (
                    <button
                      key={number}
                      onClick={() => paginate(number)}
                      className={`w-10 h-10 flex items-center justify-center rounded-full transition-all duration-200 ${
                        currentPage === number
                          ? "bg-blue-600 text-white shadow-md"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                      aria-label={`Trang ${number}`}
                    >
                      {number}
                    </button>
                  ))}
                <button
                  onClick={nextPage}
                  disabled={currentPage === totalPages}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition-all duration-200"
                  aria-label="Trang tiếp theo"
                >
                  →
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Cancel Appointment Modal */}
      {showModal && selectedAppointment && (
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
              aria-label="Lý do hủy lịch hẹn"
            />
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition-all duration-200 font-medium"
                aria-label="Hủy thao tác"
              >
                Hủy
              </button>
              <button
                onClick={handleSubmitCancel}
                className="px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-all duration-200 font-medium"
                aria-label="Xác nhận hủy lịch hẹn"
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
