import React, { useEffect, useState } from "react";
import doctorScheduleService from "../../Services/DoctorService/doctorScheduleService";
import moment from "moment";

const DoctorSchedule = () => {
  const [schedule, setSchedule] = useState([]);
  const [selectedShifts, setSelectedShifts] = useState({});
  const [currentMonday, setCurrentMonday] = useState(getMonday(new Date()));
  const token = localStorage.getItem("token");

  function getMonday(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - (day === 0 ? 6 : day - 1);
    return new Date(d.setDate(diff));
  }

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        if (!token) return;

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
      setSchedule((prev) =>
        prev.map((item) =>
          item._id === scheduleId
            ? { ...item, status: "Đã xác nhận", isConfirmed: true }
            : item
        )
      );
    } catch (err) {
      console.error("❌ Lỗi xác nhận:", err);
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
    <div className="p-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 bg-white p-4 rounded-lg shadow">
        <h1 className="text-xl font-bold text-gray-800 mb-2 sm:mb-0">
          📅 Lịch làm việc: {formatRange()}
        </h1>
        <div className="flex gap-2">
          <button
            onClick={goToPreviousWeek}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-sm rounded-md"
          >
            ⬅️ Tuần trước
          </button>
          <button
            onClick={goToNextWeek}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-sm rounded-md"
          >
            ➡️ Tuần sau
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white text-sm border border-gray-200 rounded-lg shadow-sm">
          <thead>
            <tr className="bg-blue-50 text-blue-800 uppercase text-xs">
              <th className="p-3 border text-left">Ngày</th>
              <th className="p-3 border text-left">Ca trực</th>
              <th className="p-3 border text-left">Trạng thái</th>
              <th className="p-3 border text-left">Người tạo</th>
              <th className="p-3 border text-left">Chọn ca</th>
              <th className="p-3 border text-left">Xác nhận</th>
              <th className="p-3 border text-left">Đã đăng ký</th>
            </tr>
          </thead>
          <tbody>
            {schedule.length > 0 ? (
              schedule.map((item) => (
                <tr
                  key={item._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="p-3 border text-gray-700">
                    {moment(item.date).format("DD/MM/YYYY")}
                  </td>
                  <td className="p-3 border capitalize text-gray-700">
                    {item.shiftName}
                  </td>
                  <td className="p-3 border text-gray-700">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        item.status === "Đã xác nhận"
                          ? "bg-green-100 text-green-700"
                          : "bg-green-400 text-white-900"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="p-3 border text-gray-700">
                    {item.createdBy?.email || "—"}
                  </td>
                  <td className="p-3 border">
                    <select
                      className="w-full p-1 border rounded-md text-gray-700 focus:ring-1 focus:ring-teal-500"
                      value={selectedShifts[item._id] || "morning"}
                      onChange={(e) =>
                        handleShiftChange(item._id, e.target.value)
                      }
                    >
                      <option value="full">Cả ngày</option>
                      <option value="morning">Sáng</option>
                      <option value="afternoon">Chiều</option>
                    </select>
                  </td>
                  <td className="p-3 border text-center">
                    {!item.isConfirmed ? (
                      <button
                        onClick={() => handleConfirmSchedule(item._id)}
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-xs"
                      >
                        Xác nhận
                      </button>
                    ) : (
                      <span className="text-green-600 text-sm font-medium">
                        ✅
                      </span>
                    )}
                  </td>
                  <td className="p-3 border text-gray-700">
                    {item.shiftName === "full"
                      ? "Cả ngày"
                      : item.shiftName === "morning"
                      ? "Ca sáng"
                      : "Ca chiều"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="p-4 text-center text-gray-500">
                  Không có lịch làm việc trong tuần này.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DoctorSchedule;
