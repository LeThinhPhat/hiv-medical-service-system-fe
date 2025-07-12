import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MagnifyingGlassIcon, CalendarIcon } from "@heroicons/react/24/outline";
import doctorAppointmentService from "../../Services/DoctorService/doctorAppointmentService";

const DoctorAppointments = () => {
  const navigate = useNavigate();
  const today = new Date().toISOString().split("T")[0];

  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchName, setSearchName] = useState("");
  const [filterDate, setFilterDate] = useState(today);
  const [currentPage, setCurrentPage] = useState(1);

  const appointmentsPerPage = 10;

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const data = await doctorAppointmentService.getAppointmentsByToken();
        setAppointments(data);
      } catch (err) {
        console.error("Không thể tải danh sách cuộc hẹn:", err);
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
        const apptDate = new Date(appt.createdAt).toISOString().split("T")[0];
        return apptDate === filterDate;
      });
    }

    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
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
    setFilterDate(today);
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container p-6 bg-white shadow-lg rounded-xl mx-auto">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Danh sách cuộc hẹn
      </h2>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 bg-gray-50 p-4 rounded-lg shadow-sm">
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm theo tên bệnh nhân..."
            className="pl-10 w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            aria-label="Tìm kiếm bệnh nhân"
          />
        </div>
        <div className="relative flex-1">
          <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="date"
            className="pl-10 w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            aria-label="Lọc theo ngày tạo"
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
                      {new Date(appt.createdAt).toLocaleString("vi-VN")}
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
                      {new Date(appt.startTime).toLocaleString("vi-VN")}
                    </td>
                    <td className="p-3 text-sm text-gray-700">
                      {appt.status || "Không rõ"}
                    </td>
                    <td className="p-3 flex space-x-2">
                      <button
                        className="bg-green-600 text-white px-4 py-1.5 rounded-lg hover:bg-green-700 transition focus:ring-2 focus:ring-green-500"
                        onClick={() =>
                          navigate(
                            `medical-records/personal-id/${appt.patientID?.personalID}`,
                            {
                              state: {
                                serviceId: appt.serviceID._id,
                                serviceName: appt.serviceID.name,
                              },
                            }
                          )
                        }
                      >
                        Xem hồ sơ
                      </button>
                      <button
                        className="bg-yellow-500 text-white px-4 py-1.5 rounded-lg hover:bg-yellow-600 transition focus:ring-2 focus:ring-yellow-500"
                        onClick={() =>
                          navigate(
                            `medical-records/create/${appt.patientID?._id}`
                          )
                        }
                      >
                        Tạo bệnh án
                      </button>
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
              {Math.min(indexOfLastAppointment, filteredAppointments.length)}{" "}
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
              {totalPages > 5 && currentPage < totalPages - 2 && (
                <span className="text-gray-500">...</span>
              )}
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
  );
};

export default DoctorAppointments;
