import React, { useState } from "react";
import { FaCheckCircle, FaSearch } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import appointmentListService from "../../Services/StaffService/appointmentlistService";

const CheckIn = () => {
  const [personalId, setPersonalId] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [checkInStatus, setCheckInStatus] = useState({});
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const handleSearch = async () => {
    if (!personalId || !token) return;

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
      toast.error("Không tìm thấy lịch hẹn hoặc token không hợp lệ.",err);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async (appointmentId) => {
    try {
      await appointmentListService.checkInAppointment(appointmentId);
      setCheckInStatus((prev) => ({ ...prev, [appointmentId]: true }));
      toast.success("Check-in thành công!", { position: "top-right" });
    } catch (error) {
      console.error("Check-in thất bại:", error);
      toast.error("Check-in thất bại!", { position: "top-right" });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Check-in Lịch Hẹn
        </h1>

        <div className="flex items-center gap-4 mb-8">
          <input
            type="text"
            placeholder="Nhập Personal ID"
            value={personalId}
            onChange={(e) => setPersonalId(e.target.value)}
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSearch}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 flex items-center gap-2"
          >
            <FaSearch />
            {loading ? "Đang tìm..." : "Tìm lịch hẹn"}
          </button>
        </div>

        {appointments.length > 0 ? (
          <div className="space-y-4">
            {appointments.map((appt) => (
              <div
                key={appt.id}
                className="p-6 bg-gray-50 rounded-lg shadow-md hover:shadow-lg transition duration-300"
              >
                <div className="flex justify-between items-center">
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <span className="font-semibold text-blue-500 w-36">Bệnh nhân:</span>
                      <span className="text-gray-800">{appt.patientName}</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="font-semibold text-blue-500 w-36">Thời Gian Khám:</span>
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
                      <span className="font-semibold text-blue-500 w-36">Dịch vụ:</span>
                      <span className="text-gray-700">{appt.serviceName}</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="font-semibold text-blue-500 w-36">Trạng thái:</span>
                      <span
                        className={
                          checkInStatus[appt.id]
                            ? "text-green-600 font-medium"
                            : "text-red-600 font-medium"
                        }
                      >
                        {checkInStatus[appt.id] ? "Đã check-in" : "Chưa check-in"}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleCheckIn(appt.id)}
                    disabled={checkInStatus[appt.id]}
                    className={`px-4 py-2 rounded-lg flex items-center gap-2 transition duration-300 ${
                      checkInStatus[appt.id]
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-green-600 hover:bg-green-700 text-white"
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
          <p className="text-center text-gray-500 italic">
            Không có lịch hẹn nào.
          </p>
        )}

        <ToastContainer />
      </div>
    </div>
  );
};

export default CheckIn;
