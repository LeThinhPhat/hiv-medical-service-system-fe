import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import appointmentFinishService from "../../Services/DoctorService/appointmentFinishService";
import { DateTime } from "luxon";

const FinishAppointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchName, setSearchName] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const navigate = useNavigate();

  // Format UTC date into separate date and time components
  const formatRawDate = (utcDateString) => {
    try {
      if (!utcDateString) return { date: "N/A", time: "N/A" };
      const dateTime = DateTime.fromISO(utcDateString, { zone: "utc" });
      if (!dateTime.isValid) {
        console.error("Invalid date:", utcDateString);
        return { date: "Ngày không hợp lệ", time: "N/A" };
      }
      return {
        date: dateTime.toFormat("yyyy-MM-dd"),
        time: dateTime.toFormat("HH:mm"),
      };
    } catch (error) {
      console.error("Error formatting date:", utcDateString, error);
      return { date: "Ngày không hợp lệ", time: "N/A" };
    }
  };

  // Format date for date input (YYYY-MM-DD)
  const formatDateForInput = (utcDateString) => {
    try {
      if (!utcDateString) return "";
      const dateTime = DateTime.fromISO(utcDateString, { zone: "utc" });
      if (!dateTime.isValid) return "";
      return dateTime.toFormat("yyyy-MM-dd");
    } catch (error) {
      console.error("Error formatting date for input:", utcDateString, error);
      return "";
    }
  };

  // Fetch appointments
  const fetchAppointments = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Không tìm thấy token. Vui lòng đăng nhập lại.");
        navigate("/login");
        return;
      }

      const res = await appointmentFinishService(token);
      console.debug("API response:", res.data);
      if (res.data && Array.isArray(res.data)) {
        const sortedAppointments = res.data.sort(
          (a, b) => new Date(b.startTime) - new Date(a.startTime)
        );
        setAppointments(sortedAppointments);
        setFilteredAppointments(sortedAppointments);
      } else {
        setError("Không tìm thấy lịch hẹn đã hoàn tất.");
      }
    } catch (err) {
      console.error("Lỗi khi lấy dữ liệu lịch hẹn:", err);
      if (err.response?.status === 401) {
        setError("Token không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập lại.");
        navigate("/login");
      } else {
        setError("Không thể lấy thông tin lịch hẹn. Vui lòng thử lại sau.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Filter appointments based on search name and date
  useEffect(() => {
    const filtered = appointments.filter((appointment) => {
      const patientName = appointment.patientID?.userID?.name || "";
      const appointmentDate = formatDateForInput(appointment.startTime);
      const matchesName = patientName
        .toLowerCase()
        .includes(searchName.toLowerCase());
      const matchesDate = filterDate
        ? appointmentDate.startsWith(filterDate)
        : true;
      return matchesName && matchesDate;
    });
    setFilteredAppointments(filtered);
  }, [searchName, filterDate, appointments]);

  useEffect(() => {
    fetchAppointments();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] bg-gray-50">
        <svg
          className="animate-spin h-8 w-8 text-indigo-600 mr-3"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        <span className="text-lg text-gray-600 font-medium">
          Đang tải dữ liệu lịch hẹn...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto mt-8 p-6 bg-red-50 rounded-xl shadow-lg">
        <p className="text-center text-red-600 text-lg font-semibold">
          {error}
        </p>
        <button
          onClick={fetchAppointments}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
        >
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto my-8 px-4">
      <h1 className="text-3xl font-bold text-center text-indigo-600 mb-8">
        Danh Sách Bệnh Nhân Đã Khám
      </h1>

      {/* Search and Filter Controls */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          placeholder="Tìm kiếm theo tên bệnh nhân..."
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          className="w-full sm:w-1/2 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
        />
        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className="w-full sm:w-1/2 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
        />
      </div>

      {filteredAppointments.length === 0 && (
        <div className="text-center bg-gray-50 p-6 rounded-xl shadow-lg">
          <p className="text-gray-500 text-lg font-medium">
            Không tìm thấy lịch hẹn đã hoàn tất.
          </p>
          <button
            onClick={fetchAppointments}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
          >
            Thử lại
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAppointments.map((appointment) => {
          const startTime = formatRawDate(appointment.startTime);
          const createdAt = formatRawDate(appointment.createdAt);
          return (
            <div
              key={appointment._id}
              className="bg-white rounded-xl shadow-md p-4 flex flex-col items-center text-center"
            >
              <h2 className="text-lg font-semibold text-indigo-600">
                {appointment.patientID?.userID?.name || "Không có bệnh nhân"}
              </h2>
              <p className="text-gray-600 font-medium">
                Dịch vụ: {appointment.serviceID?.name || "N/A"}
              </p>
              <p className="text-gray-600">
                Giá:{" "}
                {appointment.serviceID?.price?.toLocaleString("vi-VN") || "N/A"}{" "}
                VND
              </p>
              <p className="text-gray-600">
                Thời lượng: {appointment.serviceID?.durationMinutes || "N/A"}{" "}
                phút
              </p>
              <p className="text-sm font-bold text-indigo-600 bg-indigo-100 px-2 py-1 rounded mt-2">
                Thời gian bắt đầu: {startTime.date} {startTime.time}
              </p>
              <p className="text-sm text-gray-500">
                Trạng thái: {appointment.status || "N/A"}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Ngày đặt lịch: {createdAt.date} {createdAt.time}
              </p>
              <p className="text-xs text-gray-400">
                Cập nhật bởi: {appointment.updatedBy?.email || "N/A"}
              </p>
            </div>
          );
        })}
      </div>
      <Toaster />
    </div>
  );
};

export default FinishAppointment;
