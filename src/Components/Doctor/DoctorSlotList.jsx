import React, { useEffect, useState } from "react";
import doctorSlotService from "../../Services/DoctorService/doctorSlotService";
import { FaArrowLeft, FaArrowRight, FaCalendarAlt } from "react-icons/fa";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import viLocale from "date-fns/locale/vi";

const DoctorSlotList = () => {
  const [slots, setSlots] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());

  const fetchSlots = async (date) => {
    const isoDate = date.toISOString().split("T")[0];
    try {
      const response = await doctorSlotService.getSlotsByDate(isoDate);
      setSlots(response.data);
    } catch (err) {
      console.error("Failed to fetch slots", err);
      setSlots([]);
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
    date.toLocaleDateString("vi-VN", {
      weekday: "long",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={viLocale}>
      <div>
        {/* Chọn ngày */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-6 bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrevDay}
              className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
            >
              <FaArrowLeft />
            </button>
            <span className="text-gray-500">
              <FaCalendarAlt />
            </span>
            <h2 className="text-xl font-semibold text-gray-700">
              {formatDate(currentDate)}
            </h2>
            <button
              onClick={handleNextDay}
              className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
            >
              <FaArrowRight />
            </button>
          </div>

          <div className="mt-2 sm:mt-0">
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
                      borderRadius: "0.5rem",
                      backgroundColor: "white",
                      fontSize: "1rem",
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#e5e7eb",
                    },
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Bảng slots */}
        {slots.length > 0 ? (
          <div className="overflow-x-auto bg-white shadow rounded-lg">
            <table className="min-w-full table-auto text-xl text-gray-700 border border-gray-300">
              <thead className="bg-blue-400 text-gray-900 uppercase">
                <tr>
                  <th className="py-3 px-4 text-left border border-gray-300">
                    Stt
                  </th>
                  <th className="py-3 px-4 text-left border border-gray-300">
                    Giờ Bắt Đầu
                  </th>
                  <th className="py-3 px-4 text-left border border-gray-300">
                    Giờ Kết Thúc
                  </th>
                  <th className="py-3 px-4 text-left border border-gray-300">
                    Trạng Thái
                  </th>
                </tr>
              </thead>
              <tbody>
                {slots.map((slot, index) => (
                  <tr
                    key={slot._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-2 px-4 font-medium border border-gray-300">
                      {index + 1}
                    </td>
                    <td className="py-2 px-4 border border-gray-300">
                      {new Date(slot.startTime).toLocaleTimeString("vi-VN")}
                    </td>
                    <td className="py-2 px-4 border border-gray-300">
                      {new Date(slot.endTime).toLocaleTimeString("vi-VN")}
                    </td>
                    <td className="py-2 px-4 border border-gray-300">
                      <span
                        className={`px-3 py-1 rounded-full font-semibold ${
                          slot.status === "Sẵn sàng khám"
                            ? "bg-green-100 text-green-700"
                            : slot.status === "Đang xét duyệt"
                            ? "bg-yellow-100 text-yellow-800"
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
        ) : (
          <div className="text-center p-4 bg-white rounded-lg shadow-sm">
            <p className="text-red-500 font-medium">
              Không có slot khám trong ngày này.
            </p>
          </div>
        )}
      </div>
    </LocalizationProvider>
  );
};

export default DoctorSlotList;
