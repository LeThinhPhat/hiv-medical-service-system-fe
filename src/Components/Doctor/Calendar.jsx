import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import doctorScheduleService from "../../Services/DoctorService/doctorScheduleService";
import { DateTime } from "luxon";
import toast, { Toaster } from "react-hot-toast";
import { FaCalendarAlt } from "react-icons/fa";

const DoctorWeeklySchedule = () => {
  const [schedules, setSchedules] = useState([]);
  const [startDate, setStartDate] = useState(() => {
    const vnNow = DateTime.now().setZone("Asia/Ho_Chi_Minh");
    const monday = vnNow.minus({ days: vnNow.weekday - 1 }).startOf("day");
    return new Date(monday.toISO());
  });

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("Vui lòng đăng nhập để xem lịch làm việc");
          return;
        }

        const start = DateTime.fromJSDate(startDate).toISODate();
        const end = DateTime.fromJSDate(startDate)
          .plus({ days: 6 })
          .toISODate();

        const response = await doctorScheduleService.getScheduleByWeek(
          token,
          start,
          end
        );
        setSchedules(response.data);
        if (response.data.length === 0) {
          toast.error("Không có lịch làm việc trong tuần này");
        }
      } catch (err) {
        console.error("Lỗi khi lấy lịch:", err);
        toast.error("Không thể tải lịch làm việc");
      }
    };

    fetchSchedules();
  }, [startDate]);

  const groupedSchedule = schedules.reduce((acc, schedule) => {
    const dateKey = schedule.date.slice(0, 10);
    const shift = schedule.shiftName;
    if (!acc[dateKey]) acc[dateKey] = {};

    if (shift === "full") {
      acc[dateKey]["morning"] = { ...schedule, shiftName: "morning" };
      acc[dateKey]["afternoon"] = { ...schedule, shiftName: "afternoon" };
    } else {
      acc[dateKey][shift] = schedule;
    }

    return acc;
  }, {});

  const days = Array.from({ length: 7 }).map((_, i) => {
    const date = DateTime.fromJSDate(startDate)
      .plus({ days: i })
      .setZone("Asia/Ho_Chi_Minh");

    const key = date.toISODate();
    const vnToday = DateTime.now().setZone("Asia/Ho_Chi_Minh").toISODate();
    const isToday = vnToday === key;
    const label = date.setLocale("vi").toFormat("cccc, dd/MM");

    return { label, key, isToday };
  });

  const handlePreviousWeek = () => {
    setStartDate((prev) => {
      const newStart = DateTime.fromJSDate(prev)
        .minus({ weeks: 1 })
        .startOf("day");
      return new Date(newStart.toISO());
    });
  };

  const handleNextWeek = () => {
    setStartDate((prev) => {
      const newStart = DateTime.fromJSDate(prev)
        .plus({ weeks: 1 })
        .startOf("day");

      return new Date(newStart.toISO());
    });
  };

  const handleDateChange = (date) => {
    const selected = DateTime.fromJSDate(date).setZone("Asia/Ho_Chi_Minh");
    const monday = selected
      .minus({ days: selected.weekday - 1 })
      .startOf("day");
    setStartDate(new Date(monday.toISO()));
    toast.success(
      `Đã chọn tuần bắt đầu từ ${monday.setLocale("vi").toFormat("dd/MM/yyyy")}`
    );
  };

  const getStatusStyles = (status, isPending) => {
    if (isPending) {
      return "bg-yellow-100 text-yellow-700 border-yellow-200 bg-gradient-to-r from-yellow-50 to-yellow-200";
    }
    switch (status) {
      case "Đã xác nhận":
        return "bg-green-100 text-green-700 border-green-200 bg-gradient-to-r from-green-50 to-green-200 scale-105 shadow-sm";
      case "Chưa xác nhận":
        return "bg-yellow-100 text-yellow-700 border-yellow-200 bg-gradient-to-r from-yellow-50 to-yellow-200";
      case "Đã hủy":
        return "bg-red-100 text-red-700 border-red-200 bg-gradient-to-r from-red-50 to-red-200";
      default:
        return "bg-gray-100 text-gray-600 border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100";
    }
  };

  return (
    <div className="p-6 Container mx-auto bg-gradient-to-br  min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 bg-white p-6 rounded-2xl shadow-sm">
        <div className="flex items-center space-x-4">
          <FaCalendarAlt className="text-gray-500" size={20} />
          <h2 className="text-2xl font-extrabold text-gray-800 tracking-tight">
            Lịch Làm Việc Tuần
          </h2>
        </div>
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <button
            onClick={handlePreviousWeek}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-300 shadow-sm hover:shadow-md"
          >
            Tuần trước
          </button>
          <DatePicker
            selected={startDate}
            onChange={handleDateChange}
            dateFormat="dd/MM/yyyy"
            className="px-4 py-2 border border-gray-200 rounded-lg text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300 bg-white shadow-sm"
            placeholderText="Chọn ngày"
          />
          <button
            onClick={handleNextWeek}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-300 shadow-sm hover:shadow-md"
          >
            Tuần sau
          </button>
        </div>
      </div>

      {/* Schedule Table */}
      <div className="overflow-x-auto rounded-lg shadow-sm border border-gray-100">
        <table className="w-full border-collapse bg-white">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-200 px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                Ca / Ngày
              </th>
              {days.map((day) => (
                <th
                  key={day.key}
                  className={`border border-gray-200 px-6 py-4 text-center text-sm font-semibold uppercase tracking-wider ${
                    day.isToday
                      ? "bg-yellow-50 text-yellow-700 border-2 border-yellow-200"
                      : "text-gray-700"
                  }`}
                >
                  {day.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              { shift: "morning", label: "Ca sáng (8:00–11:30)" },
              { shift: "break", label: "Nghỉ trưa (11:30–13:00)" },
              { shift: "afternoon", label: "Ca chiều (13:00–17:00)" },
            ].map(({ shift, label }) => (
              <tr
                key={shift}
                className="hover:bg-gray-50 transition-all duration-200"
              >
                <td className="border border-gray-200 px-6 py-4 font-semibold text-gray-700 text-sm">
                  {label}
                </td>
                {days.map((day) => {
                  if (shift === "break") {
                    return (
                      <td
                        key={day.key + shift}
                        className="border border-gray-200 px-6 py-4 text-center bg-blue-50"
                      >
                        <span className="text-gray-600 italic text-sm">
                          Nghỉ trưa
                        </span>
                      </td>
                    );
                  }

                  const slot = groupedSchedule[day.key]?.[shift];
                  const isPending = slot && slot.isConfirmed === false;

                  return (
                    <td
                      key={day.key + shift}
                      className={`border border-gray-200 px-6 py-4 text-center transition-all duration-300 ${
                        slot
                          ? getStatusStyles(slot.status, isPending)
                          : "bg-red-50 border-red-100"
                      }`}
                    >
                      {slot ? (
                        <span
                          className={`font-medium text-sm inline-flex items-center px-3 py-1 rounded-full ${
                            isPending ? "text-green-500" : "text-green-600"
                          }`}
                        >
                          {slot.status === "Đã xác nhận" && (
                            <span className="mr-1"></span>
                          )}
                          {slot.status}
                        </span>
                      ) : (
                        <span className="text-red-500 italic text-sm">OFF</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* No Schedule Message */}
      {schedules.length === 0 && (
        <div className="mt-4 bg-white p-8 rounded-2xl shadow-sm text-center">
          <p className="text-red-500 font-semibold text-lg">
            Không có lịch làm việc trong tuần này.
          </p>
        </div>
      )}
    </div>
  );
};

export default DoctorWeeklySchedule;
