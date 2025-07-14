import React, { useEffect, useState } from "react";
import {
  FaCheckCircle,
  FaSpinner,
  FaCalendar,
  FaUser,
  FaFilter,
  FaTimes,
} from "react-icons/fa";
import dayjs from "dayjs";
import AnonymousService from "../../Services/CusService/AnonymousService";

const AnonymousAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [confirmDialog, setConfirmDialog] = useState({ open: false, id: null });
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });
  const [searchDate, setSearchDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [searchEmail, setSearchEmail] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [currentPagePending, setCurrentPagePending] = useState(1);
  const [currentPageOther, setCurrentPageOther] = useState(1);
  const recordsPerPage = 10;

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await AnonymousService.getAllAnonymousAppointments();
      if (response && response.data) {
        setAppointments(response.data);
      } else {
        setError("Dữ liệu trả về không hợp lệ");
      }
    } catch (err) {
      setError(err.message || "Đã xảy ra lỗi khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateStr, rawDate, rawTime) => {
    if (rawDate && rawTime) return `${rawDate} ${rawTime}`;
    const date = new Date(dateStr);
    return date.toLocaleString("vi-VN", {
      dateStyle: "short",
      timeStyle: "short",
    });
  };

  const handleApproveClick = (id) => {
    setConfirmDialog({ open: true, id });
  };

  const handleConfirm = async () => {
    try {
      await AnonymousService.confirmAnonymousAppointment(confirmDialog.id);
      setToast({
        show: true,
        message: "Duyệt lịch hẹn thành công!",
        type: "success",
      });
      setConfirmDialog({ open: false, id: null });
      fetchAppointments();
    } catch (err) {
      setToast({
        show: true,
        message: `Duyệt lịch hẹn thất bại: ${
          err.message || "Lỗi không xác định"
        }`,
        type: "error",
      });
    }
    setTimeout(
      () => setToast({ show: false, message: "", type: "success" }),
      3000
    );
  };

  const handleCancel = () => {
    setConfirmDialog({ open: false, id: null });
  };

  const clearSearchEmail = () => {
    setSearchEmail("");
    setCurrentPagePending(1);
    setCurrentPageOther(1);
  };

const filteredAppointments = appointments.filter((item) => {
  const appointmentDate = item.rawDate || dayjs(item.date).format("YYYY-MM-DD"); // Ưu tiên dùng rawDate
  const email = item.createdBy?.email?.toLowerCase() || "";
  const status = item.status?.toLowerCase() || "";

  const matchesDate = !searchDate || appointmentDate === searchDate;
  const matchesEmail =
    !searchEmail || email.includes(searchEmail.toLowerCase());
  const matchesStatus =
    !filterStatus || status === filterStatus.toLowerCase();

  return matchesDate && matchesEmail && matchesStatus;
});

  const pendingAppointments = filteredAppointments.filter(
    (item) => item.status === "Đang xét duyệt"
  );
  const otherAppointments = filteredAppointments.filter(
    (item) => item.status !== "Đang xét duyệt"
  );

  const indexOfLastPending = currentPagePending * recordsPerPage;
  const indexOfFirstPending = indexOfLastPending - recordsPerPage;
  const currentPendingRecords = pendingAppointments.slice(
    indexOfFirstPending,
    indexOfLastPending
  );
  const totalPagesPending = Math.ceil(
    pendingAppointments.length / recordsPerPage
  );

  const indexOfLastOther = currentPageOther * recordsPerPage;
  const indexOfFirstOther = indexOfLastOther - recordsPerPage;
  const currentOtherRecords = otherAppointments.slice(
    indexOfFirstOther,
    indexOfLastOther
  );
  const totalPagesOther = Math.ceil(otherAppointments.length / recordsPerPage);

  const paginatePending = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPagesPending) {
      setCurrentPagePending(pageNumber);
    }
  };

  const paginateOther = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPagesOther) {
      setCurrentPageOther(pageNumber);
    }
  };

  const prevPagePending = () => {
    if (currentPagePending > 1) setCurrentPagePending(currentPagePending - 1);
  };

  const nextPagePending = () => {
    if (currentPagePending < totalPagesPending)
      setCurrentPagePending(currentPagePending + 1);
  };

  const prevPageOther = () => {
    if (currentPageOther > 1) setCurrentPageOther(currentPageOther - 1);
  };

  const nextPageOther = () => {
    if (currentPageOther < totalPagesOther)
      setCurrentPageOther(currentPageOther + 1);
  };

  const renderTable = (
    data,
    includeApproveButton = false,
    currentPage,
    totalPages,
    prevPage,
    nextPage,
    paginate
  ) => (
    <>
      <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gradient-to-r from-gray-100 to-gray-50 text-gray-700 font-semibold">
            <tr>
              <th className="p-4 border-b">STT</th>
              <th className="p-4 border-b">Ngày Giờ Hẹn</th>
              <th className="p-4 border-b">Email Người Tạo</th>
              <th className="p-4 border-b">Trạng Thái</th>
              <th className="p-4 border-b">ID Dịch Vụ</th>
              {includeApproveButton && (
                <th className="p-4 border-b">Thao Tác</th>
              )}
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr
                key={item._id}
                className={`transition-colors duration-200 ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                } hover:bg-blue-50/50`}
              >
                <td className="p-4 border-b font-medium">
                  {indexOfFirstPending + index + 1}
                </td>
                <td className="p-4 border-b">
                  {formatDateTime(item.date, item.rawDate, item.rawTime)}
                </td>
                <td className="p-4 border-b">
                  {item.createdBy?.email || "Không có"}
                </td>
                <td className="p-4 border-b">{item.status}</td>
                <td className="p-4 border-b">{item.serviceID}</td>
                {includeApproveButton && (
                  <td className="p-4 border-b text-center">
                    <button
                      className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-1.5 rounded-full hover:from-green-600 hover:to-green-700 transition-all duration-200 font-medium shadow-sm"
                      onClick={() => handleApproveClick(item._id)}
                    >
                      Duyệt
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {data.length > 0 && (
        <div className="mt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="text-sm text-gray-600 font-medium">
            Hiển thị {indexOfFirstPending + 1} đến{" "}
            {Math.min(indexOfLastPending, data.length)} trong tổng số{" "}
            {data.length} bản ghi
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
      )}
    </>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b  px-4 py-8 sm:px-6 lg:px-8">
      {/* Toast Notification */}
      {toast.show && (
        <div
          className={`fixed top-6 right-6 z-50 bg-white/90 backdrop-blur-sm px-4 py-3 rounded-xl shadow-lg border transition-all duration-300 animate-in zoom-in-95 fade-in ${
            toast.type === "success"
              ? "text-green-600 border-green-200/50"
              : "text-red-600 border-red-200/50"
          }`}
        >
          {toast.type === "success" ? (
            <div className="flex items-center gap-2">
              <FaCheckCircle />
              {toast.message}
            </div>
          ) : (
            toast.message
          )}
        </div>
      )}

      <div className="Containermx-auto">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-8">
          Danh Sách Cuộc Hẹn Ẩn Danh
        </h1>

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
                  setCurrentPagePending(1);
                  setCurrentPageOther(1);
                }}
              />
            </div>
          </div>
          <div className="relative group">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email Người Tạo
            </label>
            <div className="relative">
              <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-blue-500 transition-colors duration-200" />
              <input
                type="text"
                placeholder="Tìm theo email người tạo"
                className="w-full pl-10 pr-10 py-3 bg-white border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-gray-700 placeholder-gray-400"
                value={searchEmail}
                onChange={(e) => {
                  setSearchEmail(e.target.value);
                  setCurrentPagePending(1);
                  setCurrentPageOther(1);
                }}
              />
              {searchEmail && (
                <FaTimes
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer hover:text-gray-600 transition-colors duration-200"
                  onClick={clearSearchEmail}
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
                  setCurrentPagePending(1);
                  setCurrentPageOther(1);
                }}
              >
                <option value="">Tất Cả</option>
                <option value="Đang xét duyệt">Đang xét duyệt</option>
                <option value="Hoàn tất đặt lịch">Hoàn tất đặt lịch</option>
                <option value="Đã hủy">Đã hủy</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-10">
            <FaSpinner className="text-4xl text-blue-500 animate-spin" />
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl shadow-sm border border-red-200">
            {error}
          </div>
        ) : (
          <>
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span className="text-blue-500">⏳</span> Cuộc Hẹn Đang Chờ Xét
              Duyệt
            </h2>
            {pendingAppointments.length > 0 ? (
              renderTable(
                currentPendingRecords,
                true,
                currentPagePending,
                totalPagesPending,
                prevPagePending,
                nextPagePending,
                paginatePending
              )
            ) : (
              <p className="text-gray-600 text-sm">
                Không có cuộc hẹn đang chờ.
              </p>
            )}

            <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-4 flex items-center gap-2">
              <span className="text-blue-500">📋</span> Các Cuộc Hẹn Khác
            </h2>
            {otherAppointments.length > 0 ? (
              renderTable(
                currentOtherRecords,
                false,
                currentPageOther,
                totalPagesOther,
                prevPageOther,
                nextPageOther,
                paginateOther
              )
            ) : (
              <p className="text-gray-600 text-sm">
                Không có cuộc hẹn nào khác.
              </p>
            )}
          </>
        )}

        {/* Confirm Dialog */}
        {confirmDialog.open && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50 transition-opacity duration-300 animate-in fade-in">
            <div className="bg-white/95 backdrop-blur-md p-6 rounded-2xl shadow-2xl w-full max-w-md border border-gray-100/50">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Xác Nhận Duyệt Lịch Hẹn
              </h3>
              <p className="text-gray-600 mb-6">
                Bạn có chắc muốn duyệt lịch hẹn này?
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition-all duration-200 font-medium"
                >
                  Hủy
                </button>
                <button
                  onClick={handleConfirm}
                  className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full hover:from-green-600 hover:to-green-700 transition-all duration-200 font-medium"
                >
                  Duyệt
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnonymousAppointments;
