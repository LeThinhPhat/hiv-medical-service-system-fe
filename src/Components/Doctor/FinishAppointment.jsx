import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import appointmentFinishService from "../../Services/DoctorService/appointmentFinishService";
import { DateTime } from "luxon";

const FinishAppointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState({});
  const navigate = useNavigate();

  // Format UTC date to Vietnam date (Asia/Ho_Chi_Minh, UTC+7), only date
  const formatVietnamDate = (utcDateString) => {
    try {
      if (!utcDateString) return "N/A";
      const dateTime = DateTime.fromISO(utcDateString, { zone: "utc" }).setZone(
        "Asia/Ho_Chi_Minh"
      );
      if (!dateTime.isValid) {
        console.error("Invalid date:", utcDateString);
        return "Ngày không hợp lệ";
      }
      console.debug(
        `Converted ${utcDateString} to ${dateTime.toFormat("dd/MM/yyyy")}`
      );
      return dateTime.toFormat("dd/MM/yyyy");
    } catch (error) {
      console.error("Error formatting date:", utcDateString, error);
      return "Ngày không hợp lệ";
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
      console.debug("API response:", res.data); // Log API response for debugging
      if (res.data && Array.isArray(res.data)) {
        const sortedAppointments = res.data.sort(
          (a, b) => new Date(b.startTime) - new Date(a.startTime)
        );
        setAppointments(sortedAppointments);
        const initialExpanded = sortedAppointments.reduce((acc, appt) => {
          acc[appt._id] = false;
          return acc;
        }, {});
        setExpanded(initialExpanded);
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

  useEffect(() => {
    fetchAppointments();
  }, [navigate]);

  const handleToggleExpand = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

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
    <div className="container mx-auto my-8 px-4 ">
      <h1 className="text-3xl font-bold text-center text-indigo-600 mb-8">
        Danh Sách Lịch Hẹn Đã Hoàn Tất
      </h1>

      {appointments.length === 0 && (
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

      <div className="grid gap-6">
        {appointments.map((appointment) => (
          <div
            key={appointment._id}
            className="bg-white shadow-md rounded-xl hover:shadow-xl transition-shadow duration-300"
            role="region"
            aria-label={`Lịch hẹn với ${appointment.patientID?.name || "N/A"}`}
          >
            <div className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold text-indigo-600">
                    {appointment.patientID?.name || "N/A"}
                  </h2>
                  <p className="text-gray-600 font-medium">
                    {appointment.serviceID?.name || "N/A"}
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatVietnamDate(appointment.startTime)}
                  </p>
                </div>
                <button
                  onClick={() => handleToggleExpand(appointment._id)}
                  className="w-8 h-8 flex items-center justify-center bg-indigo-100 text-indigo-600 hover:bg-indigo-200 hover:text-indigo-800 rounded-full transition-colors duration-200 text-lg font-semibold"
                  aria-label={expanded[appointment._id] ? "Thu gọn" : "Mở rộng"}
                >
                  {expanded[appointment._id] ? "−" : "+"}
                </button>
              </div>
              {expanded[appointment._id] && (
                <>
                  <hr className="my-4 border-gray-200" />
                  <ul className="space-y-3 text-gray-700">
                    <li>
                      <strong>Bệnh nhân:</strong>{" "}
                      {appointment.patientID?.name || "N/A"}
                    </li>
                    <li>
                      <strong>CMND/CCCD:</strong>{" "}
                      {appointment.patientID?.personalID || "N/A"}
                    </li>
                    <li>
                      <strong>Bác sĩ:</strong>{" "}
                      {appointment.updatedBy?.email || "N/A"}
                    </li>
                    <li>
                      <strong>Dịch vụ:</strong>{" "}
                      {appointment.serviceID?.name || "N/A"}
                    </li>
                    <li>
                      <strong>Giá:</strong>{" "}
                      {appointment.serviceID?.price
                        ? `${appointment.serviceID.price.toLocaleString(
                            "vi-VN"
                          )} VND`
                        : "N/A"}
                    </li>
                    <li>
                      <strong>Thời lượng:</strong>{" "}
                      {appointment.serviceID?.durationMinutes
                        ? `${appointment.serviceID.durationMinutes} phút`
                        : "N/A"}
                    </li>
                    <li>
                      <strong>Ngày bắt đầu:</strong>{" "}
                      {formatVietnamDate(appointment.startTime)}
                    </li>
                    <li>
                      <strong>Ngày tạo:</strong>{" "}
                      {formatVietnamDate(appointment.createdAt)}
                    </li>
                    <li>
                      <strong>Trạng thái:</strong>{" "}
                      <span className="text-green-600 font-medium">
                        {appointment.status || "N/A"}
                      </span>
                    </li>
                    <li>
                      <strong>Raw startTime:</strong>{" "}
                      {appointment.startTime || "N/A"} {/* Debugging */}
                    </li>
                  </ul>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
      <Toaster />
    </div>
  );
};

export default FinishAppointment;
