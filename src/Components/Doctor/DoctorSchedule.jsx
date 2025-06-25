import React, { useEffect, useState } from "react";
import doctorScheduleService from "../../services/DoctorService/doctorScheduleService";
import moment from "moment";

const DoctorSchedule = () => {
  const [schedule, setSchedule] = useState([]);
  const [selectedShifts, setSelectedShifts] = useState({});
  const [currentMonday, setCurrentMonday] = useState(getMonday(new Date()));
  const token = localStorage.getItem("token");

  // 👉 Hàm lấy thứ 2 đầu tuần từ 1 ngày bất kỳ
  function getMonday(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - (day === 0 ? 6 : day - 1);
    return new Date(d.setDate(diff));
  }

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        if (!token) {
          console.warn("⚠️ Token không tồn tại!");
          return;
        }

        const monday = new Date(currentMonday);
        const sunday = new Date(monday);
        sunday.setDate(monday.getDate() + 6);

        const startDate = monday.toISOString().split("T")[0];
        const endDate = sunday.toISOString().split("T")[0];

        const res = await doctorScheduleService.getScheduleByWeek(
          token,
          startDate,
          endDate
        );
        setSchedule(res.data);
      } catch (err) {
        console.error("Không thể tải lịch làm việc", err);
      }
    };

    fetchSchedule();
  }, [token, currentMonday]);

  const handleConfirmSchedule = async (scheduleId) => {
    const shiftName = selectedShifts[scheduleId] || "morning";
    try {
      const response = await doctorScheduleService.confirmSchedule(
        scheduleId,
        shiftName,
        token
      );
      console.log("✅ Xác nhận thành công:", response?.message || response);

      setSchedule((prev) =>
        prev.map((item) =>
          item._id === scheduleId
            ? { ...item, status: "Đã xác nhận", isConfirmed: true }
            : item
        )
      );
    } catch (err) {
      console.error("❌ Lỗi xác nhận lịch làm việc:", err);
      alert("Xác nhận thất bại.");
    }
  };

  const handleShiftChange = (scheduleId, value) => {
    setSelectedShifts((prev) => ({
      ...prev,
      [scheduleId]: value,
    }));
  };

  const goToPreviousWeek = () => {
    const prevMonday = new Date(currentMonday);
    prevMonday.setDate(prevMonday.getDate() - 7);
    setCurrentMonday(prevMonday);
  };

  const goToNextWeek = () => {
    const nextMonday = new Date(currentMonday);
    nextMonday.setDate(nextMonday.getDate() + 7);
    setCurrentMonday(nextMonday);
  };

  const formatRange = () => {
    const monday = new Date(currentMonday);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    return `${moment(monday).format("DD/MM")} - ${moment(sunday).format(
      "DD/MM/YYYY"
    )}`;
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">
          📅 Lịch làm việc tuần: {formatRange()}
        </h1>
        <div className="space-x-2">
          <button
            onClick={goToPreviousWeek}
            className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
          >
            ⬅️ Tuần trước
          </button>
          <button
            onClick={goToNextWeek}
            className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
          >
            ➡️ Tuần sau
          </button>
        </div>
      </div>

      <table className="min-w-full border border-gray-300 rounded-md">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Ngày</th>
            <th className="p-2 border">Ca trực</th>
            <th className="p-2 border">Trạng thái</th>
            <th className="p-2 border">Người tạo</th>
            <th className="p-2 border">Chọn ca</th>
            <th className="p-2 border">Xác nhận</th>
            <th className="p-2 border">Đã đăng ký</th>
          </tr>
        </thead>
        <tbody>
          {schedule.length > 0 ? (
            schedule.map((item) => (
              <tr key={item._id} className="text-center">
                <td className="p-2 border">
                  {moment(item.date).format("DD/MM/YYYY")}
                </td>
                <td className="p-2 border capitalize">{item.shiftName}</td>
                <td className="p-2 border">{item.status}</td>
                <td className="p-2 border">{item.createdBy?.email}</td>
                <td className="p-2 border">
                  <select
                    className="border px-2 py-1 rounded"
                    value={selectedShifts[item._id] || "morning"}
                    onChange={(e) =>
                      handleShiftChange(item._id, e.target.value)
                    }
                  >
                    <option value="morning">Sáng</option>
                    <option value="afternoon">Chiều</option>
                    <option value="full">Cả ngày</option>
                  </select>
                </td>
                <td className="p-2 border">
                  {!item.isConfirmed ? (
                    <button
                      onClick={() => handleConfirmSchedule(item._id)}
                      className="bg-blue-500 text-white px-4 py-1 rounded-md hover:bg-blue-600"
                    >
                      Xác nhận
                    </button>
                  ) : (
                    <span className="text-green-600 font-semibold">
                      ✅ Đã xác nhận
                    </span>
                  )}
                </td>
                <td className="p-2 border">
                  {item.shiftName === "morning"
                    ? "Ca sáng"
                    : item.shiftName === "afternoon"
                    ? "Ca chiều"
                    : "Cả ngày"}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="p-4 text-center">
                Không có lịch làm việc nào.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DoctorSchedule;
