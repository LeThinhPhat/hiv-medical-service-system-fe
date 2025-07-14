import React, { useEffect, useState } from "react";
import doctorSlotService from "../../Services/DoctorService/doctorSlotService";
import { FaArrowLeft, FaArrowRight, FaCalendarAlt } from "react-icons/fa";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import viLocale from "date-fns/locale/vi";
import { formatInTimeZone } from "date-fns-tz";
import { parseISO } from "date-fns";

const DoctorSlotList = () => {
  const [slots, setSlots] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);

  const VIETNAM_TIME_ZONE = "Asia/Ho_Chi_Minh";

  const fetchSlots = async (date) => {
    setIsLoading(true);
    const isoDate = formatInTimeZone(date, VIETNAM_TIME_ZONE, "yyyy-MM-dd");
    try {
      const response = await doctorSlotService.getSlotsByDate(isoDate);
      setSlots(response.data);
    } catch (err) {
      console.error("Failed to fetch slots", err);
      setSlots([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSlots(currentDate);
  }, [currentDate]);

  const handleNextDay = () => {
    setCurrentDate((prev) => new Date(prev.getTime() + 86400000));
  };

  const handlePrevDay = () => {
    setCurrentDate((prev) => new Date(prev.getTime() - 86400000));
  };

  const formatDate = (date) =>
    formatInTimeZone(date, VIETNAM_TIME_ZONE, "EEEE, dd/MM/yyyy", {
      locale: viLocale,
    });

  // ✅ Sửa formatTime để giữ giờ UTC gốc
  const formatTime = (dateStr) => {
    const date = parseISO(dateStr); // vẫn giữ giờ UTC
    const hours = date.getUTCHours(); // lấy giờ gốc UTC
    const minutes = String(date.getUTCMinutes()).padStart(2, "0");
    const period = hours < 12 ? "sáng" : "chiều";
    const displayHour = hours.toString().padStart(2, "0");

    return `${displayHour}:${minutes} ${period}`;
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={viLocale}>
      <div className="container mx-auto p-4 sm:p-6 bg-gray-50 min-h-screen">
        {/* Header chọn ngày */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8 bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center space-x-4">
            <button
              onClick={handlePrevDay}
              className="p-3 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200"
              aria-label="Ngày trước"
            >
              <FaArrowLeft size={20} />
            </button>
            <div className="flex items-center space-x-2">
              <FaCalendarAlt className="text-gray-500" size={20} />
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                {formatDate(currentDate)}
              </h2>
            </div>
            <button
              onClick={handleNextDay}
              className="p-3 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200"
              aria-label="Ngày sau"
            >
              <FaArrowRight size={20} />
            </button>
          </div>
          <div className="mt-4 sm:mt-0">
            <DatePicker
              label="Chọn ngày"
              value={currentDate}
              onChange={(newValue) => {
                if (newValue) setCurrentDate(newValue);
              }}
              slotProps={{
                textField: {
                  size: "small",
                  sx: {
                    "& .MuiInputBase-root": {
                      borderRadius: "0.75rem",
                      backgroundColor: "white",
                      fontSize: "1rem",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#d1d5db",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#3b82f6",
                    },
                    "& .MuiInputLabel-root": {
                      fontSize: "1rem",
                      color: "#4b5563",
                    },
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Slot hiển thị */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
          </div>
        ) : slots.length > 0 ? (
          <div className="bg-white shadow-xl rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm sm:text-base text-gray-700">
                <thead className="bg-blue-600 text-white">
                  <tr>
                    <th className="py-4 px-6 text-left font-semibold">STT</th>
                    <th className="py-4 px-6 text-left font-semibold">
                      Giờ Bắt Đầu
                    </th>
                    <th className="py-4 px-6 text-left font-semibold">
                      Giờ Kết Thúc
                    </th>
                    <th className="py-4 px-6 text-left font-semibold">
                      Trạng Thái
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {slots.map((slot, index) => (
                    <tr
                      key={slot._id}
                      className="border-b border-gray-200 hover:bg-gray-100 transition-colors duration-150"
                    >
                      <td className="py-4 px-6 font-medium">{index + 1}</td>
                      <td className="py-4 px-6">
                        {formatTime(slot.startTime)}
                      </td>
                      <td className="py-4 px-6">{formatTime(slot.endTime)}</td>
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            slot.status === "Sẵn sàng khám"
                              ? "bg-green-100 text-green-700"
                              : slot.status === "Đang xét duyệt"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {slot.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-xl shadow-lg text-center">
            <p className="text-red-600 font-semibold text-lg">
              Không có slot khám trong ngày này.
            </p>
          </div>
        )}
      </div>
    </LocalizationProvider>
  );
};

export default DoctorSlotList;
