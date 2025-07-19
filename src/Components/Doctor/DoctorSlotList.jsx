import React, { useEffect, useState } from "react";
import doctorSlotService from "../../Services/DoctorService/doctorSlotService";
import { FaCalendarAlt } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { DateTime } from "luxon";
import toast, { Toaster } from "react-hot-toast";

const DoctorSlotList = () => {
  const [slots, setSlots] = useState([]);
  const [currentDate, setCurrentDate] = useState(() => {
    const vnNow = DateTime.now().setZone("Asia/Ho_Chi_Minh");
    return new Date(vnNow.toISO());
  });
  const [isLoading, setIsLoading] = useState(false);

  const VIETNAM_TIME_ZONE = "Asia/Ho_Chi_Minh";

  const fetchSlots = async (date) => {
    setIsLoading(true);
    const isoDate = DateTime.fromJSDate(date).toISODate();
    try {
      const response = await doctorSlotService.getSlotsByDate(isoDate);
      setSlots(response.data);
      if (response.data.length === 0) {
        toast.error("Không có slot khám trong ngày này");
      }
    } catch (err) {
      console.error("Failed to fetch slots", err);
      setSlots([]);
      toast.error("Không thể tải danh sách slot khám");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSlots(currentDate);
  }, [currentDate]);

  const handlePreviousDay = () => {
    setCurrentDate((prev) => {
      const newDate = DateTime.fromJSDate(prev)
        .minus({ days: 1 })
        .startOf("day");
      return new Date(newDate.toISO());
    });
  };

  const handleNextDay = () => {
    setCurrentDate((prev) => {
      const newDate = DateTime.fromJSDate(prev)
        .plus({ days: 1 })
        .startOf("day");
      return new Date(newDate.toISO());
    });
  };

  const handleDateChange = (date) => {
    const selected = DateTime.fromJSDate(date).setZone("Asia/Ho_Chi_Minh");
    setCurrentDate(new Date(selected.toISO()));
    toast.success(
      `Đã chọn ngày ${DateTime.fromJSDate(date)
        .setZone(VIETNAM_TIME_ZONE)
        .setLocale("vi")
        .toFormat("EEEE, dd/MM/yyyy")}`
    );
  };

  const formatDate = (date) =>
    DateTime.fromJSDate(date)
      .setZone(VIETNAM_TIME_ZONE)
      .setLocale("vi")
      .toFormat("EEEE, dd/MM/yyyy");

  const formatTime = (dateStr) => {
    const date = DateTime.fromISO(dateStr, { zone: "utc" });
    const hours = date.hour;
    const minutes = String(date.minute).padStart(2, "0");
    const period = hours < 12 ? "sáng" : "chiều";
    const displayHour = hours.toString().padStart(2, "0");
    return `${displayHour}:${minutes} ${period}`;
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case "Sẵn sàng khám":
        return "bg-emerald-200 text-emerald-800 border-emerald-400 bg-gradient-to-r from-emerald-100 to-emerald-300 scale-105 shadow-lg";
      case "Đang xét duyệt":
        return "bg-amber-200 text-amber-800 border-amber-400 bg-gradient-to-r from-amber-100 to-amber-300";
      case "Đã hủy":
        return "bg-red-200 text-red-800 border-red-400 bg-gradient-to-r from-red-100 to-red-300";
      default:
        return "bg-gray-200 text-gray-800 border-gray-400 bg-gradient-to-r from-gray-100 to-gray-300";
    }
  };

  const getSlotBackground = (index) => {
    const colors = [
      "bg-blue-50 border-blue-200 bg-gradient-to-r from-blue-50 to-blue-100",
      "bg-purple-50 border-purple-200 bg-gradient-to-r from-purple-50 to-purple-100",
      "bg-teal-50 border-teal-200 bg-gradient-to-r from-teal-50 to-teal-100",
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="p-6 Container mx-auto bg-gradient-to-br  min-h-screen">
      {/* Toaster for notifications */}
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 bg-white p-6 rounded-2xl shadow-lg">
        <div className="flex items-center space-x-4">
          <FaCalendarAlt className="text-gray-600" size={20} />
          <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
            {formatDate(currentDate)}
          </h2>
        </div>
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <button
            onClick={handlePreviousDay}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            Ngày trước
          </button>
          <DatePicker
            selected={currentDate}
            onChange={handleDateChange}
            dateFormat="dd/MM/yyyy"
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 bg-white shadow-sm"
            placeholderText="Chọn ngày"
          />
          <button
            onClick={handleNextDay}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            Ngày sau
          </button>
        </div>
      </div>

      {/* Slots Display */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-indigo-600"></div>
        </div>
      ) : slots.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {slots.map((slot, index) => (
            <div
              key={slot._id}
              className={`p-4 rounded-xl border transition-all duration-200 ${getSlotBackground(
                index
              )} hover:shadow-lg`}
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold text-gray-800">
                  Slot {index + 1}
                </h3>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusStyles(
                    slot.status
                  )}`}
                >
                  {slot.status}
                </span>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Bắt đầu:</span>{" "}
                  {formatTime(slot.startTime)}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Kết thúc:</span>{" "}
                  {formatTime(slot.endTime)}
                </p>
                {slot.status === "Sẵn sàng khám" && (
                  <div className="flex items-center text-emerald-600 font-medium">
                    <span className="mr-1">✅</span> Sẵn sàng
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
          <p className="text-red-600 font-semibold text-lg">
            Không có slot khám trong ngày này.
          </p>
        </div>
      )}
    </div>
  );
};

export default DoctorSlotList;
