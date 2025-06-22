import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

function formatTime(isoString) {
  const date = new Date(isoString);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
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
  const { doctor, slot, date, userRole } = location.state || {};
  const [cccd, setCCCD] = useState("");
  const [info, setInfo] = useState({});
  const [selectedService, setSelectedService] = useState("");

  // Fake data service ở đây!
  const services = [
    { _id: "1", name: "Khám tổng quát" },
    { _id: "2", name: "Khám nội khoa" },
    { _id: "3", name: "Xét nghiệm máu" },
    { _id: "4", name: "Tư vấn dinh dưỡng" },
    { _id: "5", name: "Tiêm chủng" },
  ];

  const handleSubmitBooking = (e) => {
    e.preventDefault();
    if (!selectedService) {
      alert("Vui lòng chọn dịch vụ!");
      return;
    }
    if (userRole === "patient") {
      if (!cccd) {
        alert("Vui lòng nhập CCCD");
        return;
      }
      alert(`Đặt lịch thành công cho bệnh nhân với CCCD: ${cccd}, dịch vụ: ${selectedService}`);
      // navigate("/success");
    } else {
      if (!info.name || !info.phone) {
        alert("Vui lòng nhập đầy đủ thông tin!");
        return;
      }
      alert(`Đặt lịch thành công cho khách khác, dịch vụ: ${selectedService}!`);
      // navigate("/success");
    }
  };

  if (!doctor || !slot) return <div>Không có dữ liệu đặt lịch!</div>;

  return (
    <div className="max-w-md mx-auto mt-8 bg-white p-8 rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-4 text-green-700">Xác nhận đặt lịch</h2>
      <div className="mb-4">
        <b>Bác sĩ:</b> {doctor.userID?.name}<br />
        <b>Ngày:</b> {formatDate(date)}<br />
        <b>Giờ:</b> {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
      </div>
      <form onSubmit={handleSubmitBooking}>
        {/* Ô chọn dịch vụ */}
        <div className="mb-4">
          <label className="block font-semibold mb-1">Chọn dịch vụ:</label>
          <select
            value={selectedService}
            onChange={e => setSelectedService(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          >
            <option value="">-- Chọn dịch vụ --</option>
            {services.map(sv => (
              <option key={sv._id} value={sv.name}>
                {sv.name}
              </option>
            ))}
          </select>
        </div>
        {/* Nếu là patient: nhập CCCD, không thì nhập info */}
        {userRole === "patient" ? (
          <div className="mb-4">
            <label className="block font-semibold mb-1">Nhập số CCCD:</label>
            <input
              type="text"
              value={cccd}
              onChange={e => setCCCD(e.target.value)}
              className="w-full border rounded px-3 py-2"
              placeholder="CCCD"
              required
            />
          </div>
        ) : (
          <div>
            <div className="mb-2">
              <label className="block font-semibold mb-1">Tên khách:</label>
              <input
                type="text"
                value={info.name || ""}
                onChange={e => setInfo((i) => ({ ...i, name: e.target.value }))}
                className="w-full border rounded px-3 py-2"
                placeholder="Tên"
                required
              />
            </div>
            <div className="mb-2">
              <label className="block font-semibold mb-1">Số điện thoại:</label>
              <input
                type="text"
                value={info.phone || ""}
                onChange={e => setInfo((i) => ({ ...i, phone: e.target.value }))}
                className="w-full border rounded px-3 py-2"
                placeholder="SĐT"
                required
              />
            </div>
          </div>
        )}
        <button
          type="submit"
          className="w-full mt-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 font-semibold shadow"
        >
          Xác nhận đặt lịch
        </button>
      </form>
    </div>
  );
};

export default BookingConfirmPage;
