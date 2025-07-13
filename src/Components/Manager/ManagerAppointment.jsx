import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import moment from "moment";
import appointmentManagerService from "../../Services/ManagerService/appointmentManagerService";
import EditIcon from "@mui/icons-material/Edit";

const ManagerAppointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    moment().format("YYYY-MM-DD")
  );
  const [selectedStatus, setSelectedStatus] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const data = await appointmentManagerService.getAllAppointments(token);
      setAppointments(data);
      setFilteredAppointments(data);
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu appointments:", error);
      toast.error(`Lỗi khi tải dữ liệu appointments: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = appointments;

    if (searchTerm) {
      filtered = filtered.filter(
        (appt) =>
          appt.patientID?.name
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          appt.doctorSlotID?.[0]?.doctorID?.userID?.name
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    if (selectedDate) {
      filtered = filtered.filter((appt) =>
        moment(appt.date).isSame(moment(selectedDate), "day")
      );
    }

    if (selectedStatus) {
      filtered = filtered.filter((appt) => appt.status === selectedStatus);
    }

    setFilteredAppointments(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchTerm, selectedDate, selectedStatus, appointments]);

  const renderStatusColor = (status) => {
    switch (status) {
      case "Hoàn tất đặt lịch":
        return "bg-green-500 text-white";
      case "Thanh toán thất bại":
        return "bg-red-500 text-white";
      case "Đã đặt":
      case "Sẵn sàng khám":
      case "Đang xét duyệt":
        return "bg-yellow-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const handleOpenDialog = (appointment) => {
    setSelectedAppointment(appointment);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setSelectedAppointment(null);
    setOpenDialog(false);
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAppointments = filteredAppointments.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="Container mx-auto mt-10 mb-10">
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-teal-600">Quản Lý Cuộc Hẹn</h1>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Tìm kiếm theo tên bệnh nhân hoặc bác sĩ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-1/3 bg-white border border-teal-100 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600"
          />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full sm:w-1/4 bg-white border border-teal-100 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600"
          />
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full sm:w-1/4 bg-white border border-teal-100 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="Hoàn tất đặt lịch">Hoàn tất đặt lịch</option>
            <option value="Thanh toán thất bại">Thanh toán thất bại</option>
            <option value="Đã đặt">Đã đặt</option>
            <option value="Sẵn sàng khám">Sẵn sàng khám</option>
            <option value="Đang xét duyệt">Đang xét duyệt</option>
          </select>
        </div>

        {loading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-teal-600"></div>
          </div>
        ) : filteredAppointments.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-lg text-gray-500">Không có cuộc hẹn nào.</p>
          </div>
        ) : (
          <div className="bg-teal-50 border border-teal-100 rounded-xl shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-teal-600 text-white">
                <tr>
                  <th className="py-3 px-4 text-left font-medium">Bác Sĩ</th>
                  <th className="py-3 px-4 text-left font-medium">Phòng</th>
                  <th className="py-3 px-4 text-left font-medium">Dịch Vụ</th>
                  <th className="py-3 px-4 text-left font-medium">Bệnh Nhân</th>
                  <th className="py-3 px-4 text-left font-medium">
                    Thời Gian Bắt Đầu
                  </th>
                  <th className="py-3 px-4 text-left font-medium">
                    Trạng Thái
                  </th>
                  <th className="py-3 px-4 text-center font-medium">
                    Hành Động
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentAppointments.map((appt) => (
                  <tr
                    key={appt._id}
                    className="hover:bg-teal-100 transition-colors"
                  >
                    <td className="py-3 px-4 text-gray-700">
                      {appt.doctorSlotID?.[0]?.doctorID?.userID?.name || "N/A"}
                    </td>
                    <td className="py-3 px-4 text-gray-700">
                      {appt.doctorSlotID?.[0]?.doctorID?.room || "N/A"}
                    </td>
                    <td className="py-3 px-4 text-gray-700">
                      {appt.serviceID?.name || "N/A"}
                    </td>
                    <td className="py-3 px-4 text-gray-700">
                      {appt.patientID?.name ||
                        appt.patientID?.userID?.name ||
                        "Chưa có bệnh nhân"}
                    </td>
                    <td className="py-3 px-4 text-gray-700">
                      {moment(appt.startTime).format("HH:mm DD/MM/YYYY")}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${renderStatusColor(
                          appt.status
                        )}`}
                      >
                        {appt.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => handleOpenDialog(appt)}
                        className="text-teal-600 hover:text-teal-700 transition-colors"
                        title="Xem chi tiết"
                      >
                        <EditIcon fontSize="small" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {filteredAppointments.length > 0 && (
          <div className="flex justify-between items-center mt-4">
            <div className="text-gray-600">
              Hiển thị {indexOfFirstItem + 1} -{" "}
              {Math.min(indexOfLastItem, filteredAppointments.length)} /{" "}
              {filteredAppointments.length} cuộc hẹn
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

        {/* Dialog chi tiết cuộc hẹn */}
        {openDialog && selectedAppointment && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            <div className="bg-teal-50 rounded-xl p-6 w-full max-w-md">
              <h2 className="text-xl font-bold text-teal-600 mb-4">
                Chi Tiết Cuộc Hẹn
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Bác Sĩ
                  </label>
                  <p className="text-gray-700">
                    {selectedAppointment.doctorSlotID?.[0]?.doctorID?.userID
                      ?.name || "N/A"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Phòng
                  </label>
                  <p className="text-gray-700">
                    {selectedAppointment.doctorSlotID?.[0]?.doctorID?.room ||
                      "N/A"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Dịch Vụ
                  </label>
                  <p className="text-gray-700">
                    {selectedAppointment.serviceID?.name || "N/A"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Bệnh Nhân
                  </label>
                  <p className="text-gray-700">
                    {selectedAppointment.patientID?.name ||
                      selectedAppointment.patientID?.userID?.name ||
                      "Chưa có bệnh nhân"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    CCCD
                  </label>
                  <p className="text-gray-700">
                    {selectedAppointment.patientID?.personalID || "N/A"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Thời Gian
                  </label>
                  <p className="text-gray-700">
                    {moment(selectedAppointment.startTime).format(
                      "HH:mm DD/MM/YYYY"
                    )}{" "}
                    -{" "}
                    {moment(
                      selectedAppointment.doctorSlotID?.[0]?.endTime
                    ).format("HH:mm")}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Trạng Thái
                  </label>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${renderStatusColor(
                      selectedAppointment.status
                    )}`}
                  >
                    {selectedAppointment.status}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Giá
                  </label>
                  <p className="text-gray-700">
                    {selectedAppointment.serviceID?.price?.toLocaleString() ||
                      "N/A"}{" "}
                    VNĐ
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Ngày Tạo
                  </label>
                  <p className="text-gray-700">
                    {moment(selectedAppointment.createdAt).format(
                      "HH:mm DD/MM/YYYY"
                    )}
                  </p>
                </div>
                {selectedAppointment.updatedBy && (
                  <div>
                    <hr className="border-teal-100 my-4" />
                    <p className="text-sm text-gray-500">
                      Được cập nhật bởi: {selectedAppointment.updatedBy.email}
                    </p>
                  </div>
                )}
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={handleCloseDialog}
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

export default ManagerAppointment;
