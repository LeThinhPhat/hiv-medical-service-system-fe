import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import doctorAppointmentService from "../../Services/DoctorService/doctorAppointmentService";
import checkoutService from "../../Services/DoctorService/checkoutService"; // ✅ import hàm checkout

const DoctorAppointments = () => {
  const navigate = useNavigate();
  const todayVN = new Date().toLocaleDateString("en-CA", {
    timeZone: "Asia/Ho_Chi_Minh",
  });

  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchName, setSearchName] = useState("");
  const [filterDate, setFilterDate] = useState(todayVN);
  const [currentPage, setCurrentPage] = useState(1);

  const appointmentsPerPage = 10;

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const data = await doctorAppointmentService.getAppointmentsByToken();
        setAppointments(data);
      } catch (err) {
        toast.error("Không thể tải danh sách cuộc hẹn");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  useEffect(() => {
    let filtered = [...appointments];

    if (searchName.trim()) {
      filtered = filtered.filter((appt) =>
        appt.patientID?.name
          ?.toLowerCase()
          .includes(searchName.trim().toLowerCase())
      );
    }

    if (filterDate) {
      filtered = filtered.filter((appt) => {
        const apptDate = new Date(appt.startTime).toISOString().split("T")[0];
        return apptDate === filterDate;
      });
    }

    filtered.sort((a, b) => new Date(b.startTime) - new Date(a.startTime));
    setFilteredAppointments(filtered.reverse());
    setCurrentPage(1);
  }, [searchName, filterDate, appointments]);

  const indexOfLastAppointment = currentPage * appointmentsPerPage;
  const indexOfFirstAppointment = indexOfLastAppointment - appointmentsPerPage;
  const currentAppointments = filteredAppointments.slice(
    indexOfFirstAppointment,
    indexOfLastAppointment
  );
  const totalPages = Math.ceil(
    filteredAppointments.length / appointmentsPerPage
  );

  const handlePageChange = (page) => {
    const lastPage = Math.max(1, totalPages);
    const newPage = Math.min(Math.max(page, 1), lastPage);
    setCurrentPage(newPage);
  };

  const clearFilters = () => {
    setSearchName("");
    setFilterDate(todayVN);
  };

  const getPaginationRange = () => {
    const maxPagesToShow = 5;
    const startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
    return Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i
    );
  };

  const handleCheckout = async (appointmentId) => {
    try {
      const token = localStorage.getItem("token"); // Hoặc dùng từ context
      await checkoutService.checkoutAppointment(appointmentId, token);
      toast.success("Checkout thành công!");

      // Cập nhật local state
      const updatedAppointments = appointments.map((appt) =>
        appt._id === appointmentId ? { ...appt, status: "Đã checkout" } : appt
      );
      setAppointments(updatedAppointments);
    } catch (error) {
      toast.error("Lỗi khi checkout cuộc hẹn!");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="container mx-auto">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-400 p-6">
            <h2 className="text-2xl font-bold text-white">
              Danh sách cuộc hẹn
            </h2>
          </div>
          <div className="p-6 space-y-6">
            {/* Search & Filter */}
            <div className="flex flex-col md:flex-row gap-4 bg-gray-50 p-4 rounded-lg shadow-sm">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Tìm theo tên bệnh nhân..."
                  className="pl-10 w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                />
              </div>
              <div className="relative flex-1">
                <input
                  type="date"
                  className="pl-10 w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                />
              </div>
              <button
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
                onClick={clearFilters}
              >
                Xóa bộ lọc
              </button>
            </div>

            {filteredAppointments.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                  Không tìm thấy cuộc hẹn nào phù hợp.
                </p>
                <button
                  className="mt-4 text-blue-600 hover:underline"
                  onClick={clearFilters}
                >
                  Xóa bộ lọc để xem tất cả
                </button>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead className="bg-gray-100 text-gray-700 sticky top-0 z-10">
                      <tr>
                        <th className="p-3 border-b text-left text-sm font-semibold">
                          #
                        </th>
                        <th className="p-3 border-b text-left text-sm font-semibold">
                          Ngày tạo
                        </th>
                        <th className="p-3 border-b text-left text-sm font-semibold">
                          Bệnh nhân
                        </th>
                        <th className="p-3 border-b text-left text-sm font-semibold">
                          CMND/CCCD
                        </th>
                        <th className="p-3 border-b text-left text-sm font-semibold">
                          Dịch vụ
                        </th>
                        <th className="p-3 border-b text-left text-sm font-semibold">
                          Giờ bắt đầu
                        </th>
                        <th className="p-3 border-b text-left text-sm font-semibold">
                          Trạng thái
                        </th>
                        <th className="p-3 border-b text-left text-sm font-semibold">
                          Hành động
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentAppointments.map((appt, index) => (
                        <tr
                          key={appt._id}
                          className="border-b hover:bg-gray-50 transition"
                        >
                          <td className="p-3 text-sm text-gray-700">
                            {indexOfFirstAppointment + index + 1}
                          </td>
                          <td className="p-3 text-sm text-gray-700">
                            {new Date(appt.createdAt).toLocaleString("vi-VN", {
                              timeZone: "UTC", // Giữ nguyên giờ UTC
                              hour12: false,
                              year: "numeric",
                              month: "2-digit",
                              day: "2-digit",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </td>
                          <td className="p-3 text-sm text-gray-700">
                            {appt.patientID?.name || "Không có tên"}
                          </td>
                          <td className="p-3 text-sm text-gray-700">
                            {appt.patientID?.personalID || "Không có"}
                          </td>
                          <td className="p-3 text-sm text-gray-700">
                            {appt.serviceID?.name || "Không có dịch vụ"}
                          </td>
                          <td className="p-3 text-sm text-gray-700">
                            {new Date(appt.startTime).toLocaleString("vi-VN", {
                              timeZone: "UTC", // Giữ nguyên giờ UTC
                              hour12: false,
                              year: "numeric",
                              month: "2-digit",
                              day: "2-digit",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </td>
                          <td className="p-3 text-sm text-gray-700">
                            {appt.status || "Không rõ"}
                          </td>
                          <td className="p-3 flex flex-col gap-2 sm:flex-row sm:space-x-2">
                            <button
                              className="bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700 transition"
                              onClick={() =>
                                navigate(
                                  `medical-records/personal-id/${appt.patientID?.personalID}`,
                                  {
                                    state: {
                                      serviceId: appt.serviceID._id,
                                      serviceName: appt.serviceID.name,
                                      appointmentId: appt._id,
                                    },
                                  }
                                )
                              }
                            >
                              Xem hồ sơ
                            </button>
                            {/* {appt.status !== "Đã checkout" && (
                              <button
                                className="bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition"
                                onClick={() => handleCheckout(appt._id)}
                              >
                                Checkout
                              </button>
                            )} */}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="mt-6 flex justify-between items-center">
                  <div className="text-sm text-gray-600">
                    Hiển thị {indexOfFirstAppointment + 1} -{" "}
                    {Math.min(
                      indexOfLastAppointment,
                      filteredAppointments.length
                    )}{" "}
                    trong {filteredAppointments.length} cuộc hẹn
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      className="px-4 py-2 border rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 transition"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage <= 1}
                    >
                      Trước
                    </button>
                    {getPaginationRange().map((page) => (
                      <button
                        key={page}
                        className={`px-4 py-2 border rounded-lg ${
                          currentPage === page
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 hover:bg-gray-200"
                        } transition`}
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      className="px-4 py-2 border rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 transition"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage >= totalPages}
                    >
                      Sau
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorAppointments;
