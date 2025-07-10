import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import appointmentService from "../../../Services/CusService/AppointmentService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function formatTime(isoString) {
  const date = new Date(isoString);
  const adjustedDate = new Date(date.getTime() - 7 * 60 * 60 * 1000);
  return adjustedDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
}

function formatDate(isoDateString) {
  if (!isoDateString) return "";
  const date = new Date(isoDateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

const BookingConfirmPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { doctor, slot, date, service = null } = location.state || {};
  const token = localStorage.getItem("token");
  const serviceName = service?.name || "Chưa chọn dịch vụ";

  const patient = JSON.parse(localStorage.getItem("patient"));
  const user = JSON.parse(localStorage.getItem("user"));
  const [info, setInfo] = useState({ name: "", cccd: "", phone: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
     console.log("User data:", user);
    if (!doctor || !slot || !token || !patient?._id) return;
    setInfo({
      name: user.name || "",
      cccd: patient.personalID || "",
      phone: patient.contactPhones?.[0] || ""
    });
  }, [token, slot]);

  const handleChange = (e) => {
    setInfo({ ...info, [e.target.name]: e.target.value });
  };

  const handleSubmitBooking = async (e) => {
    e.preventDefault();
    if (!info.name || !info.cccd || !info.phone) {
      toast.warning("Vui lòng nhập đầy đủ thông tin bệnh nhân!");
      return;
    }

    setLoading(true);
    try {
      const appointmentData = {
        patientID: patient._id,
        doctorSlotID: [slot._id],
        serviceID: service?._id || null,
        treatmentID: null,
      };

      const appointment = await appointmentService.createAppointment(appointmentData);
      toast.success(
        <>
          <b>Đặt lịch thành công!</b><br />
          Bệnh nhân: {info.name} <br />
          CCCD: {info.cccd} <br />
          SĐT: {info.phone} <br />
          Bác sĩ: {doctor.userID?.name} <br />
          Ngày: {formatDate(date)}, {formatTime(slot.startTime)} - {formatTime(slot.endTime)}<br />
          Dịch vụ: {serviceName}
        </>
      );
      setTimeout(() => {
        navigate("/booking-payment", {
          state: {
            appointment,
            info,
            doctor,
            slot,
            date,
            service
          }
        });
      }, 1800);
    } catch (error) {
      toast.error("Đặt lịch thất bại: " + (error.message || "Lỗi không xác định"));
    } finally {
      setLoading(false);
    }
  };

  if (!doctor || !slot || !token || !patient?._id) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg text-center text-red-600 font-semibold">
        Không có dữ liệu đặt lịch hoặc thông tin bệnh nhân!
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl p-8 transform transition-all hover:shadow-2xl">
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-8">
          Xác nhận đặt lịch
        </h2>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
          <div className="flex items-center mb-4">
            <svg className="w-6 h-6 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-lg text-gray-800"><span className="font-semibold">Bác sĩ:</span> {doctor.userID?.name}</p>
          </div>
          <div className="flex items-center mb-4">
            <svg className="w-6 h-6 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-lg text-gray-800"><span className="font-semibold">Ngày:</span> {formatDate(date)}</p>
          </div>
          <div className="flex items-center mb-4">
            <svg className="w-6 h-6 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-lg text-gray-800"><span className="font-semibold">Giờ:</span> {formatTime(slot.startTime)} - {formatTime(slot.endTime)}</p>
          </div>
          <div className="flex items-center">
            <svg className="w-6 h-6 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-lg text-gray-800"><span className="font-semibold">Dịch vụ:</span> {serviceName}</p>
          </div>
        </div>

        <form onSubmit={handleSubmitBooking} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Họ tên</label>
            <input
              type="text"
              name="name"
              value={info.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              placeholder="Nhập họ tên"
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">CCCD</label>
            <input
              type="text"
              name="cccd"
              value={info.cccd}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              placeholder="Nhập CCCD"
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
            <input
              type="text"
              name="phone"
              value={info.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              placeholder="Nhập số điện thoại"
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white text-lg font-semibold py-3 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200"
            disabled={loading}
          >
            {loading ? "Đang xử lý..." : "Xác nhận đặt lịch"}
          </button>
        </form>

        <ToastContainer position="top-center" autoClose={3000} />
      </div>
    </div>
  );
};

export default BookingConfirmPage;