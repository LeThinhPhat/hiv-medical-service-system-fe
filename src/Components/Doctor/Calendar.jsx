import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import doctorScheduleService from "../../Services/DoctorService/doctorScheduleService";

const DoctorWeeklySchedule = () => {
  const [schedules, setSchedules] = useState([]);

  const [startDate, setStartDate] = useState(() => {
    const vnNow = new Date(
      new Date().toLocaleString("en-US", {
        timeZone: "Asia/Ho_Chi_Minh",
      })
    );
    const day = vnNow.getDay();
    const diff = vnNow.getDate() - (day === 0 ? 6 : day - 1); // Start from Monday
    vnNow.setDate(diff);
    vnNow.setHours(0, 0, 0, 0);
    return vnNow;
  });

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found in localStorage");
          return;
        }
        const end = new Date(startDate);
        end.setDate(startDate.getDate() + 6);

        const response = await doctorScheduleService.getScheduleByWeek(
          token,
          startDate.toISOString().slice(0, 10),
          end.toISOString().slice(0, 10)
        );
        setSchedules(response.data);
      } catch (err) {
        console.error("Lỗi khi lấy lịch:", err);
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
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    date.setHours(0, 0, 0, 0);

    const key = date.toISOString().slice(0, 10);

    const isToday =
      new Date().toLocaleDateString("vi-VN", {
        timeZone: "Asia/Ho_Chi_Minh",
      }) ===
      date.toLocaleDateString("vi-VN", {
        timeZone: "Asia/Ho_Chi_Minh",
      });

    const label = date.toLocaleDateString("vi-VN", {
      weekday: "long",
      day: "2-digit",
      month: "2-digit",
      timeZone: "Asia/Ho_Chi_Minh",
    });

    return { label, key, isToday };
  });

  const handlePreviousWeek = () => {
    const newStart = new Date(startDate);
    newStart.setDate(startDate.getDate() - 7);
    setStartDate(newStart);
  };

  const handleNextWeek = () => {
    const newStart = new Date(startDate);
    newStart.setDate(startDate.getDate() + 7);
    setStartDate(newStart);
  };

  const handleDateChange = (date) => {
    const newStart = new Date(
      new Date(date).toLocaleString("en-US", {
        timeZone: "Asia/Ho_Chi_Minh",
      })
    );
    const day = newStart.getDay();
    const diff = newStart.getDate() - (day === 0 ? 6 : day - 1);
    newStart.setDate(diff);
    newStart.setHours(0, 0, 0, 0);
    setStartDate(newStart);
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg max-w-full mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Lịch Làm Việc Tuần</h2>
        <div className="flex items-center space-x-4">
          <button
            onClick={handlePreviousWeek}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Tuần trước
          </button>
          <DatePicker
            selected={startDate}
            onChange={handleDateChange}
            dateFormat="dd/MM/yyyy"
            className="px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholderText="Chọn ngày"
          />
          <button
            onClick={handleNextWeek}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Tuần sau
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-200 px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Ca / Ngày
              </th>
              {days.map((day) => (
                <th
                  key={day.key}
                  className={`border border-gray-200 px-6 py-3 text-center text-sm font-semibold ${
                    day.isToday
                      ? "bg-yellow-200 text-yellow-900 border-2 border-yellow-500"
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
                className="hover:bg-gray-50 transition-colors duration-200"
              >
                <td className="border border-gray-200 px-6 py-4 font-semibold text-gray-800">
                  {label}
                </td>
                {days.map((day) => {
                  if (shift === "break") {
                    return (
                      <td
                        key={day.key + shift}
                        className="border border-gray-200 px-6 py-4 text-center bg-blue-300"
                      >
                        <span className="text-gray-900 italic">Nghỉ trưa</span>
                      </td>
                    );
                  }

                  const slot = groupedSchedule[day.key]?.[shift];
                  const isPending = slot && slot.isConfirmed === false;

                  return (
                    <td
                      key={day.key + shift}
                      className={`border border-gray-200 px-6 py-4 text-center transition-colors duration-200 ${
                        slot
                          ? isPending
                            ? "bg-yellow-100"
                            : "bg-green-50"
                          : "bg-red-50"
                      }`}
                    >
                      {slot ? (
                        <span
                          className={`font-medium ${
                            isPending ? "text-yellow-600" : "text-green-600"
                          }`}
                        >
                          {slot.status}
                        </span>
                      ) : (
                        <span className="text-red-500 italic">OFF</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DoctorWeeklySchedule;
