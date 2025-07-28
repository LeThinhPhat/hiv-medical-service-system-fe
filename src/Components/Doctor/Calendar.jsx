import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import doctorScheduleService from "../../Services/DoctorService/doctorScheduleService";
import { DateTime } from "luxon";
import toast, { Toaster } from "react-hot-toast";
import {
  FaCalendarAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaHourglassHalf,
} from "react-icons/fa";

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
          // toast.error("Không có lịch làm việc trong tuần này");
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
      return "bg-amber-100 text-amber-800 border-amber-300";
    }
    switch (status) {
      case "Đã xác nhận":
        return "bg-teal-100 text-teal-800 border-teal-300";
      case "Chưa xác nhận":
        return "bg-amber-100 text-amber-800 border-amber-300";
      case "Đã hủy":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-600 border-gray-300";
    }
  };

  const getStatusIcon = (status, isPending) => {
    if (isPending) {
      return <FaHourglassHalf className="mr-2" />;
    }
    switch (status) {
      case "Đã xác nhận":
        return <FaCheckCircle className="mr-2" />;
      case "Chưa xác nhận":
        return <FaHourglassHalf className="mr-2" />;
      case "Đã hủy":
        return <FaTimesCircle className="mr-2" />;
      default:
        return null;
    }
  };

  return (
    <div className="p-6 container mx-auto bg-gradient-to-br min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 bg-white p-6 rounded-2xl shadow-lg">
        <div className="flex items-center space-x-4">
          <FaCalendarAlt className="text-teal-600" size={24} />
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Lịch Làm Việc Tuần
          </h2>
        </div>
        <div className="flex items-center space-x-4 mt-4 sm:mt-0">
          <button
            onClick={handlePreviousWeek}
            className="px-5 py-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            Tuần trước
          </button>
          <DatePicker
            selected={startDate}
            onChange={handleDateChange}
            dateFormat="dd/MM/yyyy"
            className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-300 bg-white shadow-md hover:shadow-lg"
            placeholderText="Chọn ngày"
          />
          <button
            onClick={handleNextWeek}
            className="px-5 py-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            Tuần sau
          </button>
        </div>
      </div>

      {/* Schedule Table */}
      <div className="overflow-x-auto rounded-2xl shadow-lg border border-gray-200">
        <table className="w-full border-collapse bg-white">
          <thead>
            <tr className="bg-gradient-to-r from-teal-100 to-indigo-100">
              <th className="border border-gray-200 px-6 py-4 text-left text-sm font-bold text-gray-800 uppercase tracking-wider">
                Ca / Ngày
              </th>
              {days.map((day) => (
                <th
                  key={day.key}
                  className={`border border-gray-200 px-6 py-4 text-center text-sm font-bold uppercase tracking-wider ${
                    day.isToday
                      ? "bg-gradient-to-r from-amber-100 to-amber-200 text-amber-800 border-2 border-amber-300"
                      : "text-gray-800"
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
                <td className="border border-gray-200 px-6 py-4 font-bold text-gray-800 text-sm">
                  {label}
                </td>
                {days.map((day) => {
                  if (shift === "break") {
                    return (
                      <td
                        key={day.key + shift}
                        className="border border-gray-200 px-6 py-4 text-center bg-indigo-50"
                      >
                        <span className="text-indigo-600 italic text-sm">
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
                      className={`border border-gray-200 px-6 py-4 text-center transition-all duration-300 transform hover:scale-105 ${
                        slot
                          ? getStatusStyles(slot.status, isPending)
                          : "bg-red-50 border-red-200"
                      }`}
                    >
                      {slot ? (
                        <span className="font-medium text-sm inline-flex items-center px-3 py-1 rounded-full">
                          {getStatusIcon(slot.status, isPending)}
                          {slot.status}
                        </span>
                      ) : (
                        <span className="text-red-600 italic text-sm inline-flex items-center">
                          <FaTimesCircle className="mr-2" />
                          OFF
                        </span>
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
        <div className="">
          {/* <p className="text-red-600 font-semibold text-lg">
            Không có lịch làm việc trong tuần này.
          </p> */}
        </div>
      )}
      {/* 
      <Toaster /> */}
    </div>
  );
};

export default DoctorWeeklySchedule;
