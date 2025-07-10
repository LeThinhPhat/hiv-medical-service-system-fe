import React, { useEffect, useState } from "react";
import { FaCheckCircle, FaTimesCircle, FaEdit } from "react-icons/fa";
import appointmentlistService from "../../Services/StaffService/appointmentlistService";

const AppointmentList = () => {
  const [appointments, setAppointments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(10); // Số bản ghi mỗi trang

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await appointmentlistService.getAllAppointments();
        setAppointments(res.data);
        console.log("Appointments fetched:", res.data);
      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu lịch hẹn:", err);
      }
    };

    fetchAppointments();
  }, []);

  // Hàm hiển thị giờ UTC dạng HH:mm
  const extractTimeFromUTC = (utcString) => {
    const date = new Date(utcString);
    const hours = String(date.getUTCHours()).padStart(2, "0");
    const minutes = String(date.getUTCMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`; // Ví dụ: "13:00"
  };

  // Tính toán dữ liệu hiển thị cho trang hiện tại
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = appointments.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(appointments.length / recordsPerPage);

  // Hàm chuyển trang
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

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white p-4 rounded-md shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-700">Appointments List</h2>
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Book Appointment
          </button>
        </div>

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
                const doctorEmail = item?.createdBy?.email || "N/A";
                const patientID = item?.patientID?.userID?.name || "----";
                const date = new Date(item.date).toLocaleDateString("vi-VN");
                const startTime = extractTimeFromUTC(item.startTime);
                const status = item.doctorSlotID?.[0]?.status || item.status || "N/A";
                const service = item?.serviceID?.name || "N/A";

                return (
                  <tr key={item._id} className="hover:bg-gray-50">
                    <td className="p-2 border">{indexOfFirstRecord + index + 1}</td>
                    <td className="p-2 border">{patientID}</td>
                    <td className="p-2 border">{doctorEmail}</td>
                    <td className="p-2 border">{date}</td>
                    <td className="p-2 border">{startTime}</td>
                    <td className="p-2 border">{service}</td>
                    <td className="p-2 border capitalize">
                      {status.replace(/_/g, " ")}
                    </td>
                    <td className="p-2 border flex justify-center gap-2">
                      <button className="text-green-600 hover:text-green-800 border border-green-500 p-1 rounded">
                        <FaCheckCircle />
                      </button>
                      <button className="text-red-600 hover:text-red-800 border border-red-500 p-1 rounded">
                        <FaTimesCircle />
                      </button>
                      <button className="text-blue-600 hover:text-blue-800 border border-blue-500 p-1 rounded">
                        <FaEdit />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Phân trang */}
        <div className="mt-4 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Showing {indexOfFirstRecord + 1} to{" "}
            {Math.min(indexOfLastRecord, appointments.length)} of{" "}
            {appointments.length} records
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
    </div>
  );
};

export default AppointmentList;
