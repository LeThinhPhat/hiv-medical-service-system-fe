import { useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import paymentService from "../../../Services/CusService/PaymentService";

function formatTime(isoString) {
  const date = new Date(isoString);
  // Trừ đi 7 giờ (chênh lệch UTC và UTC+7) để hiển thị đúng giờ địa phương
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

const BookingPaymentPage = () => {
  const location = useLocation();
  const {
    info,
    appointment
  } = location.state || {};

  console.log("BookingPaymentPage location state:", appointment);
 

  const handlePayment = async () => {
    try {
      // Gọi API tạo payment và nhận về paymentUrl
      const { paymentUrl } = await paymentService.createPayment({
        appointmentID: appointment._id,
      });
      // Redirect sang trang thanh toán
      window.location.href = paymentUrl;
    } catch (err) {
      toast.error("Tạo thanh toán thất bại!");
      throw err;
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-10 rounded-2xl shadow-2xl" style={{ background: "#f9fafb" }}>
      <h2 className="text-3xl font-extrabold mb-6 text-center drop-shadow-xl"
          style={{ color: "#1976d2" }}>
        Thanh toán lịch hẹn
      </h2>
      <div className="mb-6 border-2 rounded-xl p-5 shadow-md"
        style={{ borderColor: "#1976d2", background: "#e3f2fd" }}>
        <div className="text-lg mb-2"><b>Mã lịch hẹn:</b> <span style={{ color: "#1976d2" }}>{appointment._id || "N/A"}</span></div>
      <div className="text-lg mb-2">
        <b>Bệnh nhân:</b> {appointment.patientID?.userID?.name || appointment.patientID?.name}
      </div>
        <div className="text-lg mb-2"><b>CCCD:</b> {appointment.patientID.personalID}</div>
        <div className="text-lg mb-2"><b>SĐT:</b> {info?.phone || "Không có"}</div>
        <div className="text-lg mb-2"><b>Bác sĩ:</b> {appointment.doctorID.userID?.name}</div>
        <div className="text-lg mb-2"><b>Ngày:</b> {formatDate(appointment.date)}</div>
       <div className="text-lg mb-2">
        <b>Giờ:</b> {formatTime(appointment.startTime)} -{" "}
        {formatTime(
          appointment.doctorSlotID.length >= 2
            ? appointment.doctorSlotID[1].endTime
            : appointment.doctorSlotID[0].endTime
        )}
      </div>
        <div className="text-lg"><b>Dịch vụ:</b> {appointment.serviceID.name}</div>
        <div className="text-lg">
          <b>Giá Tiền:</b> {appointment.serviceID?.price?.toLocaleString('vi-VN')} ₫
        </div>
      </div>
      <button
        className="w-full mt-4 text-white text-xl px-6 py-4 rounded-2xl font-bold shadow-lg transition-all duration-200"
        style={{
          background: "#1976d2",
          border: "none"
        }}
        onClick={handlePayment}
      >
        Thanh toán ngay
      </button>
      <ToastContainer position="top-center" autoClose={2000} />
    </div>
  );
};

export default BookingPaymentPage;