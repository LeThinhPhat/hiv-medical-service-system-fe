import React, { useState } from "react";
import { FaCheckCircle, FaSearch, FaTimes, FaSpinner } from "react-icons/fa";
import appointmentListService from "../../Services/StaffService/appointmentlistService";

const CheckIn = () => {
  const [personalId, setPersonalId] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [checkInStatus, setCheckInStatus] = useState({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const token = localStorage.getItem("token");

  const handleSearch = async () => {
    if (!personalId || !token) {
      setToast({
        show: true,
        message: "Vui lòng nhập Personal ID và kiểm tra token!",
        type: "error",
      });
      setTimeout(
        () => setToast({ show: false, message: "", type: "success" }),
        3000
      );
      return;
    }

    try {
      setLoading(true);
      const res = await appointmentListService.getAppointmentByPersonalID(
        personalId,
        token
      );
      const transformed = res.data.map((appt) => ({
        id: appt._id,
        personalId: appt.patientID?.personalID,
        patientName: appt.patientID?.name || "Không rõ tên",
        appointmentDate: appt.date,
        serviceName: appt.serviceID?.name || "Không rõ dịch vụ",
        startTime: appt.startTime,
      }));
      setAppointments(transformed);
    } catch (err) {
      setToast({
        show: true,
        message: "Không tìm thấy lịch hẹn hoặc token không hợp lệ.",
        type: "error",
      });
      setTimeout(
        () => setToast({ show: false, message: "", type: "success" }),
        3000
      );
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async (appointmentId) => {
    try {
      await appointmentListService.checkInAppointment(appointmentId);
      setCheckInStatus((prev) => ({ ...prev, [appointmentId]: true }));
      setToast({
        show: true,
        message: "Check-in thành công!",
        type: "success",
      });
      setTimeout(
        () => setToast({ show: false, message: "", type: "success" }),
        3000
      );
    } catch (error) {
      console.error("Check-in thất bại:", error);
      setToast({ show: true, message: "Check-in thất bại!", type: "error" });
      setTimeout(
        () => setToast({ show: false, message: "", type: "success" }),
        3000
      );
    }
  };

  const clearPersonalId = () => {
    setPersonalId("");
    setAppointments([]);
  };

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

      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl p-6 lg:p-8 border border-gray-200/50">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-8 text-center">
          Check-in Lịch Hẹn
        </h1>

        {/* Search Input */}
        <div className="flex items-center gap-4 mb-8">
          <div className="relative group flex-1">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-blue-500 transition-colors duration-200" />
            <input
              type="text"
              placeholder="Nhập Personal ID"
              value={personalId}
              onChange={(e) => setPersonalId(e.target.value)}
              className="w-full pl-10 pr-10 py-3 bg-white border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-gray-700 placeholder-gray-400"
            />
            {personalId && (
              <FaTimes
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer hover:text-gray-600 transition-colors duration-200"
                onClick={clearPersonalId}
              />
            )}
          </div>
          <button
            onClick={handleSearch}
            disabled={loading}
            className={`px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 flex items-center gap-2 font-medium shadow-sm ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? <FaSpinner className="animate-spin" /> : <FaSearch />}
            {loading ? "Đang tìm..." : "Tìm lịch hẹn"}
          </button>
        </div>

        {/* Appointment Cards */}
        {appointments.length > 0 ? (
          <div className="space-y-4">
            {appointments.map((appt) => (
              <div
                key={appt.id}
                className="p-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-md border border-gray-200/50 hover:shadow-lg hover:border-blue-200 transition-all duration-300 animate-in fade-in"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <span className="font-semibold text-blue-500 w-36">
                        Bệnh nhân:
                      </span>
                      <span className="text-gray-800">{appt.patientName}</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="font-semibold text-blue-500 w-36">
                        Thời Gian Khám:
                      </span>
                      <span className="text-gray-700">
                        {appt.startTime
                          ? new Date(appt.startTime).toLocaleString("vi-VN", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: false,
                              timeZone: "UTC",
                            })
                          : "Không có thời gian"}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <span className="font-semibold text-blue-500 w-36">
                        Dịch vụ:
                      </span>
                      <span className="text-gray-700">{appt.serviceName}</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="font-semibold text-blue-500 w-36">
                        Trạng thái:
                      </span>
                      <span
                        className={
                          checkInStatus[appt.id]
                            ? "text-green-600 font-medium"
                            : "text-red-600 font-medium"
                        }
                      >
                        {checkInStatus[appt.id]
                          ? "Đã check-in"
                          : "Chưa check-in"}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleCheckIn(appt.id)}
                    disabled={checkInStatus[appt.id]}
                    className={`px-4 py-2 rounded-full flex items-center gap-2 transition-all duration-300 font-medium shadow-sm ${
                      checkInStatus[appt.id]
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : "bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700"
                    }`}
                  >
                    <FaCheckCircle />
                    {checkInStatus[appt.id] ? "Đã Check-in" : "Check-in"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600 text-sm italic">
            Không có lịch hẹn nào.
          </p>
        )}
      </div>
    </div>
  );
};

export default CheckIn;
