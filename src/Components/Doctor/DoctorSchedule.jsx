import React, { useEffect, useState } from "react";
import doctorScheduleService from "../../Services/DoctorService/doctorScheduleService";
import moment from "moment";
import toast, { Toaster } from "react-hot-toast";

const DoctorSchedule = () => {
  const [schedule, setSchedule] = useState([]);
  const [selectedShifts, setSelectedShifts] = useState({});
  const [selectedIds, setSelectedIds] = useState([]);
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
        if (!token) {
          toast.error("Vui lòng đăng nhập để xem lịch làm việc");
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
        toast.error("Không thể tải lịch làm việc");
      }
    };

    fetchSchedule();
  }, [token, currentMonday]);

  const handleConfirmSchedules = async () => {
    try {
      for (const scheduleId of selectedIds) {
        const shiftName = selectedShifts[scheduleId] || "morning";
        await doctorScheduleService.confirmSchedule(
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
      }
      setSelectedIds([]);
      toast.success(`Đã xác nhận thành công ${selectedIds.length} ca`);
    } catch (err) {
      console.error("Lỗi xác nhận:", err);
      toast.error("Xác nhận thất bại");
    }
  };

  const handleShiftChange = (scheduleId, value) => {
    setSelectedShifts((prev) => ({
      ...prev,
      [scheduleId]: value,
    }));
  };

  const toggleSelectSchedule = (scheduleId) => {
    setSelectedIds((prev) =>
      prev.includes(scheduleId)
        ? prev.filter((id) => id !== scheduleId)
        : [...prev, scheduleId]
    );
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

  const generateWeekDays = () => {
    const days = [];
    const monday = new Date(currentMonday);
    for (let i = 0; i < 7; i++) {
      const day = new Date(monday);
      day.setDate(monday.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case "Đã xác nhận":
        return "bg-green-200 text-green-800";
      case "Chưa xác nhận":
        return "bg-yellow-100 text-yellow-700";
      case "Đã hủy":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="p-6 Container mx-auto  min-h-screen">
      {/* Toaster for notifications */}
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 bg-white p-6 rounded-2xl shadow-lg">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 sm:mb-0">
          📅 Lịch làm việc: {formatRange()}
        </h1>
        <div className="flex gap-3">
          <button
            onClick={goToPreviousWeek}
            className="px-5 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-lg transition duration-200"
          >
            ⬅️ Tuần trước
          </button>
          <button
            onClick={goToNextWeek}
            className="px-5 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-lg transition duration-200"
          >
            ➡️ Tuần sau
          </button>
        </div>
      </div>

      {/* Calendar View */}
      <div className="grid grid-cols-1 sm:grid-cols-7 gap-4 mb-8">
        {generateWeekDays().map((day, index) => (
          <div
            key={index}
            className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition duration-200"
          >
            <h3 className="text-lg font-semibold text-gray-800">
              {moment(day).format("ddd, DD/MM")}
            </h3>
            <div className="mt-2 space-y-2">
              {schedule
                .filter(
                  (item) =>
                    moment(item.date).format("DD/MM/YYYY") ===
                    moment(day).format("DD/MM/YYYY")
                )
                .map((item) => (
                  <div
                    key={item._id}
                    className={`p-3 rounded-lg border transition-all duration-200 ${
                      item.isConfirmed
                        ? "border-green-400 bg-gradient-to-r from-green-50 to-green-100 scale-105 shadow-md"
                        : selectedIds.includes(item._id)
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          Ca: {item.shiftName}
                        </p>
                        <p
                          className={`text-xs font-semibold mt-1 px-2 py-1 rounded-full ${getStatusStyles(
                            item.status
                          )}`}
                        >
                          {item.status}
                        </p>
                      </div>
                      {!item.isConfirmed && (
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(item._id)}
                          onChange={() => toggleSelectSchedule(item._id)}
                          className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                        />
                      )}
                    </div>
                    {!item.isConfirmed && (
                      <select
                        className="mt-2 w-full p-2 border rounded-lg text-sm text-gray-700 focus:ring-2 focus:ring-blue-500"
                        value={selectedShifts[item._id] || "morning"}
                        onChange={(e) =>
                          handleShiftChange(item._id, e.target.value)
                        }
                      >
                        <option value="full">Cả ngày</option>
                        <option value="morning">Sáng</option>
                        <option value="afternoon">Chiều</option>
                      </select>
                    )}
                    {item.isConfirmed && (
                      <div className="mt-2 text-sm text-green-600 font-medium flex items-center">
                        <span className="mr-1"></span> Đã xác nhận
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>

      {/* Confirm Button */}
      {selectedIds.length > 0 && (
        <div className="flex justify-end">
          <button
            onClick={handleConfirmSchedules}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Xác nhận {selectedIds.length} ca
          </button>
        </div>
      )}

      {/* No Schedule Message */}
      {schedule.length === 0 && (
        <div className="text-center p-8 bg-white rounded-2xl shadow-md">
          <p className="text-gray-500 text-lg">
            Không có lịch làm việc trong tuần này.
          </p>
        </div>
      )}
    </div>
  );
};

export default DoctorSchedule;
