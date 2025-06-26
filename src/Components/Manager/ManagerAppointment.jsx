import React, { useEffect, useState } from "react";
import appointmentManagerService from "../../Services/ManagerService/appointmentManagerService";

const ManagerAppointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [appointmentsPerPage] = useState(10); // Số cuộc hẹn mỗi trang

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

  if (loading)
    return <p className="text-center text-gray-500">Đang tải dữ liệu...</p>;

  // Logic phân trang
  const indexOfLastAppointment = currentPage * appointmentsPerPage;
  const indexOfFirstAppointment = indexOfLastAppointment - appointmentsPerPage;
  const currentAppointments = appointments.slice(
    indexOfFirstAppointment,
    indexOfLastAppointment
  );
  const totalPages = Math.ceil(appointments.length / appointmentsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Danh sách cuộc hẹn (Quản lý)
      </h2>
      {appointments.length === 0 ? (
        <p className="text-center text-gray-500">Không có cuộc hẹn nào.</p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-100 text-left text-gray-600 uppercase text-sm font-semibold">
                  <th className="p-3 border-b">#</th>
                  <th className="p-3 border-b">Bác sĩ</th>
                  <th className="p-3 border-b">Dịch vụ</th>
                  <th className="p-3 border-b">Thời gian bắt đầu</th>
                  <th className="p-3 border-b">Trạng thái</th>
                  <th className="p-3 border-b">Ngày tạo</th>
                  <th className="p-3 border-b">Chi tiết Slot</th>
                </tr>
              </thead>
              <tbody>
                {currentAppointments.map((appt, index) => (
                  <tr
                    key={appt._id}
                    className="border-b hover:bg-gray-50 transition-colors"
                  >
                    <td className="p-3 text-gray-700">
                      {indexOfFirstAppointment + index + 1}
                    </td>
                    <td className="p-3 text-gray-700">
                      {appt.doctorSlotID?.[0]?.doctorID?.userID?.name ||
                        "Không rõ bác sĩ"}
                    </td>
                    <td className="p-3 text-gray-700">
                      {appt.serviceID?.name || "Không có dịch vụ"}
                    </td>
                    <td className="p-3 text-gray-700">
                      {new Date(appt.startTime).toLocaleString()}
                    </td>
                    <td className="p-3 text-gray-700">{appt.status}</td>
                    <td className="p-3 text-gray-700">
                      {new Date(appt.createdAt).toLocaleString()}
                    </td>
                    <td className="p-3 text-gray-700">
                      {appt.doctorSlotID?.map((slot, idx) => (
                        <div key={slot._id} className="mb-1">
                          {new Date(slot.startTime).toLocaleTimeString()} -{" "}
                          {new Date(slot.endTime).toLocaleTimeString()} (
                          {new Date(slot.date).toLocaleDateString()})
                        </div>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Trước
            </button>
            <span className="text-sm text-gray-600">
              Trang {currentPage} / {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Sau
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ManagerAppointment;
