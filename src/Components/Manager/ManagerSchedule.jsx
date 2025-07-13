import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import moment from "moment";
import scheduleManagerService from "../../Services/ManagerService/scheduleManagerService";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const ManagerSchedule = () => {
  const [schedules, setSchedules] = useState([]);
  const [filteredSchedules, setFilteredSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    moment().utcOffset("+07:00").format("YYYY-MM-DD")
  );
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await scheduleManagerService.getAllSchedules(token);
      setSchedules(Array.isArray(data) ? data : []);
      setFilteredSchedules(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch schedules", error);
      toast.error(`Lỗi khi tải dữ liệu lịch: ${error.message}`);
      setSchedules([]);
      setFilteredSchedules([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  useEffect(() => {
    let filtered = schedules;

    if (searchTerm) {
      filtered = filtered.filter((item) =>
        item.doctorID?.userID?.name
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
    }

    if (selectedDate) {
      filtered = filtered.filter((item) =>
        moment(item.date)
          .utcOffset("+07:00")
          .isSame(moment(selectedDate), "day")
      );
    }

    if (selectedStatus) {
      filtered = filtered.filter((item) => item.status === selectedStatus);
    }

    setFilteredSchedules(filtered);
    setCurrentPage(1);
  }, [searchTerm, selectedDate, selectedStatus, schedules]);

  const handleDelete = async () => {
    try {
      await scheduleManagerService.deleteScheduleById(selectedId, token);
      toast.success("Xóa lịch thành công!");
      fetchData();
    } catch (error) {
      console.error("Lỗi khi xóa lịch:", error);
      toast.error(
        `Lỗi khi xóa lịch: ${error.response?.data?.message || error.message}`
      );
    } finally {
      setOpenConfirm(false);
      setSelectedId(null);
    }
  };

  const confirmDelete = (id) => {
    setSelectedId(id);
    setOpenConfirm(true);
  };

  const renderStatusColor = (status) => {
    switch (status) {
      case "Đang xét duyệt":
        return "bg-yellow-500 text-white";
      case "Hoàn tất":
        return "bg-green-500 text-white";
      case "Đã hủy":
        return "bg-red-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentSchedules = filteredSchedules.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredSchedules.length / itemsPerPage);

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
      <Toaster />
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-teal-600">
            Lịch Làm Việc Của Bác Sĩ
          </h1>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Tìm kiếm theo tên bác sĩ..."
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
            <option value="Đang xét duyệt">Đang xét duyệt</option>
            <option value="Hoàn tất">Hoàn tất</option>
            <option value="Đã hủy">Đã hủy</option>
          </select>
        </div>

        {loading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-teal-600"></div>
          </div>
        ) : filteredSchedules.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-lg text-gray-500">Không có lịch làm việc nào.</p>
          </div>
        ) : (
          <div className="bg-teal-50 border border-teal-100 rounded-xl shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-teal-600 text-white">
                <tr>
                  <th className="py-3 px-4 text-left font-medium">STT</th>
                  <th className="py-3 px-4 text-left font-medium">
                    Tên Bác Sĩ
                  </th>
                  <th className="py-3 px-4 text-left font-medium">Ngày</th>
                  <th className="py-3 px-4 text-left font-medium">Ca Làm</th>
                  <th className="py-3 px-4 text-left font-medium">Phòng</th>
                  <th className="py-3 px-4 text-left font-medium">
                    Trạng Thái
                  </th>
                  <th className="py-3 px-4 text-left font-medium">Người Tạo</th>
                  <th className="py-3 px-4 text-center font-medium">
                    Hành Động
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentSchedules.map((item, index) => (
                  <tr
                    key={item._id}
                    className="hover:bg-teal-100 transition-colors"
                  >
                    <td className="py-3 px-4 text-gray-700">
                      {indexOfFirstItem + index + 1}
                    </td>
                    <td className="py-3 px-4 text-gray-700">
                      {item.doctorID?.userID?.name || "Không rõ"}
                    </td>
                    <td className="py-3 px-4 text-gray-700">
                      {moment(item.date)
                        .utcOffset("+07:00")
                        .format("DD/MM/YYYY")}
                    </td>
                    <td className="py-3 px-4 text-gray-700">
                      {item.shiftName || "N/A"}
                    </td>
                    <td className="py-3 px-4 text-gray-700">
                      {item.doctorID?.room || "N/A"}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${renderStatusColor(
                          item.status
                        )}`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-700">
                      {item.createdBy?.email || "Không rõ"}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() =>
                            navigate(`/manager/schedule/${item._id}`)
                          }
                          className="text-teal-600 hover:text-teal-700 transition-colors"
                          title="Xem chi tiết"
                        >
                          <EditIcon fontSize="small" />
                        </button>
                        <button
                          onClick={() => confirmDelete(item._id)}
                          className="text-red-600 hover:text-red-700 transition-colors"
                          title="Xóa lịch"
                        >
                          <DeleteIcon fontSize="small" />
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
        {filteredSchedules.length > 0 && (
          <div className="flex justify-between items-center mt-4">
            <div className="text-gray-600">
              Hiển thị {indexOfFirstItem + 1} -{" "}
              {Math.min(indexOfLastItem, filteredSchedules.length)} /{" "}
              {filteredSchedules.length} lịch làm việc
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

        {/* Confirm Delete Dialog */}
        {openConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            <div className="bg-teal-50 rounded-xl p-6 w-full max-w-sm">
              <h2 className="text-xl font-bold text-teal-600 mb-4">
                Xác Nhận Xóa
              </h2>
              <p className="text-gray-700 mb-6">
                Bạn có chắc chắn muốn xóa lịch này?
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setOpenConfirm(false)}
                  className="bg-gray-200 text-gray-700 rounded-lg px-4 py-2 hover:bg-gray-300 transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={handleDelete}
                  className="bg-red-600 text-white rounded-lg px-4 py-2 hover:bg-red-700 transition-colors"
                >
                  Xóa
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManagerSchedule;
