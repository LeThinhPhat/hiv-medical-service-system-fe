import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import appointmentService from "../../../Services/CusService/AppointmentService";

const BASE_URL = "http://localhost:3000";

const patient = JSON.parse(localStorage.getItem("patient")) || {};

const SuccessPaymentPage = () => {
  const [searchParams] = useSearchParams();
  const [order, setOrder] = useState(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // Lấy orderId từ URL
  const appointmentId = searchParams.get("vnp_TxnRef");

  useEffect(() => {
    const fetchOrder = async () => {
      if (!appointmentId) {
        setErr("Không tìm thấy mã lịch hẹn (orderId)!");
        setLoading(false);
        return;
      }
      try {
        const data = await appointmentService.getById(appointmentId);
        setOrder(data);
        console.log("Order data:", data);
      } catch (error) {
        setErr(error.message || "Không lấy được thông tin lịch hẹn.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [appointmentId]);

  if (loading) return <div>Đang tải thông tin lịch hẹn...</div>;
  if (err) return <div className="text-red-600">Lỗi: {err}</div>;

  return (
    <div className="max-w-lg mx-auto mt-10 p-8 rounded-xl shadow-xl bg-white">
      <h2 className="text-2xl font-bold mb-4 text-green-700">Thanh toán thành công!</h2>
      <div className="mb-4">Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi.</div>
      <div className="mb-2"><b>Mã lịch hẹn:</b> {order?._id}</div>
      <div className="mb-2"><b>CCCD:</b> {patient.personalID}</div>
      <div className="mb-2"><b>SĐT:</b> {patient.contactPhones[0]}</div>
      <div className="mb-2"><b>Dịch vụ:</b> {order?.serviceID?.name}</div>
      <div className="mb-2"><b>Giá tiền:</b> {order?.serviceID?.price?.toLocaleString('vi-VN')} ₫</div>
     <div className="mt-6 text-center">
        <button
          onClick={() => navigate("/")}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
        >
          Quay về trang chủ
        </button>
      </div>
      <div className="mt-6 text-center text-sm text-gray-500">Mã giao dịch: {searchParams.get("vnp_TransactionNo")}</div>
    </div>
  );
};

export default SuccessPaymentPage;
