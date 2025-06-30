import { useState } from "react"; // API bạn cần chuẩn bị
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import appointmentService from "../../Services/CusService/AppointmentService";

function formatDateTime(iso) {
  const date = new Date(iso);
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
}

const SearchBooking = () => {
  const [personalID, setPersonalID] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!personalID.trim()) {
      toast.warning("Vui lòng nhập CCCD");
      return;
    }

    setLoading(true);
    try {
      const result = await appointmentService.getAppointmentsByPersonalID(personalID);
      setAppointments(result || []);
      if (result.length === 0) toast.info("Không tìm thấy cuộc hẹn nào");
    } catch (err) {
      toast.error("Lỗi khi tra cứu: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold text-center mb-4 text-blue-600">Tra cứu cuộc hẹn</h2>

      <form onSubmit={handleSearch} className="mb-6">
        <label className="block mb-2 font-medium">Nhập CCCD/CMND:</label>
        <input
          type="text"
          value={personalID}
          onChange={(e) => setPersonalID(e.target.value)}
          className="w-full border px-4 py-2 rounded mb-3"
          placeholder="Nhập số CCCD"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white font-bold py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Đang tìm..." : "Tra cứu"}
        </button>
      </form>

      <div>
        {appointments.length > 0 && (
          <div>
            <h3 className="text-xl font-semibold mb-3 text-green-600">Kết quả:</h3>
            {appointments.map((app, idx) => (
              <div key={idx} className="border p-4 mb-3 rounded shadow-sm bg-gray-50">
                <div><b>Bác sĩ:</b> {app.doctor?.userID?.name}</div>
                <div><b>Dịch vụ:</b> {app.service?.name}</div>
                <div><b>Thời gian:</b> {formatDateTime(app.slot?.startTime)} - {formatDateTime(app.slot?.endTime)}</div>
                <div><b>Trạng thái:</b> {app.status || "Chưa rõ"}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
};

export default SearchBooking;
