import React, { useEffect, useState } from "react";
import appointmentManagerService from "../../Services/ManagerService/appointmentManagerService";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

const ManagerAppointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [appointmentsPerPage] = useState(10);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const data = await appointmentManagerService.getAllAppointments();
        setAppointments(data);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu cuộc hẹn:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  const indexOfLast = currentPage * appointmentsPerPage;
  const indexOfFirst = indexOfLast - appointmentsPerPage;
  const currentAppointments = appointments.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(appointments.length / appointmentsPerPage);

  const handleNextPage = () =>
    currentPage < totalPages && setCurrentPage((prev) => prev + 1);
  const handlePreviousPage = () =>
    currentPage > 1 && setCurrentPage((prev) => prev - 1);

  if (loading) {
    return (
      <div className="text-center py-10 text-gray-500 text-lg animate-pulse">
        Đang tải dữ liệu cuộc hẹn...
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen w-full bg-white">
      <h2 className="text-2xl font-bold mb-4 border-b pb-2">
        Danh sách cuộc hẹn (Quản lý)
      </h2>

      {appointments.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">
          Không có cuộc hẹn nào.
        </p>
      ) : (
        <>
          <div className="overflow-x-auto border rounded-lg shadow-sm">
            <table className="min-w-full table-auto text-sm text-gray-800">
              <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
                <tr>
                  <th className="px-4 py-2 border">#</th>
                  <th className="px-4 py-2 border">Bác sĩ</th>
                  <th className="px-4 py-2 border">Dịch vụ</th>
                  <th className="px-4 py-2 border">Thời gian bắt đầu</th>
                  <th className="px-4 py-2 border">Trạng thái</th>
                  <th className="px-4 py-2 border">Ngày tạo</th>
                  <th className="px-4 py-2 border">Chi tiết Slot</th>
                </tr>
              </thead>
              <tbody>
                {currentAppointments.map((appt, index) => (
                  <tr key={appt._id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border text-center font-medium">
                      {indexOfFirst + index + 1}
                    </td>
                    <td className="px-4 py-2 border text-center">
                      {appt.doctorSlotID?.[0]?.doctorID?.userID?.name ||
                        "Không rõ bác sĩ"}
                    </td>
                    <td className="px-4 py-2 border text-center">
                      {appt.serviceID?.name || "Không có dịch vụ"}
                    </td>
                    <td className="px-4 py-2 border text-center">
                      {new Date(appt.startTime).toLocaleString("vi-VN")}
                    </td>
                    <td className="px-4 py-2 border text-center">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          statusColors[appt.status?.toLowerCase()] ||
                          "bg-gray-200 text-gray-700"
                        }`}
                      >
                        {appt.status}
                      </span>
                    </td>
                    <td className="px-4 py-2 border text-center">
                      {new Date(appt.createdAt).toLocaleDateString("vi-VN")}{" "}
                      {new Date(appt.createdAt).toLocaleTimeString("vi-VN")}
                    </td>
                    <td className="px-4 py-2 border text-center">
                      {appt.doctorSlotID?.length > 0 ? (
                        <div className="flex flex-col items-center gap-1">
                          {appt.doctorSlotID.map((slot) => (
                            <div
                              key={slot._id}
                              className="bg-gray-100 px-2 py-1 rounded text-xs"
                            >
                              {new Date(slot.startTime).toLocaleTimeString(
                                "vi-VN"
                              )}{" "}
                              -{" "}
                              {new Date(slot.endTime).toLocaleTimeString(
                                "vi-VN"
                              )}{" "}
                              ({new Date(slot.date).toLocaleDateString("vi-VN")}
                              )
                            </div>
                          ))}
                        </div>
                      ) : (
                        "Không có slot"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center mt-6 gap-6">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded transition ${
                currentPage === 1
                  ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                  : "bg-teal-500 text-white hover:bg-teal-600"
              }`}
            >
              ← Trang trước
            </button>
            <span className="text-sm text-gray-600">
              Trang <strong>{currentPage}</strong> / {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded transition ${
                currentPage === totalPages
                  ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                  : "bg-teal-500 text-white hover:bg-teal-600"
              }`}
            >
              Trang sau →
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ManagerAppointment;
