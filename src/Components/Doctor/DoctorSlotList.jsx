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
      <div className="max-w-4xl mx-auto p-4">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-6 bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrevDay}
              className="p-2 rounded-full bg-teal-100 text-teal-600 hover:bg-teal-200 transition-colors"
            >
              <FaArrowLeft />
            </button>
            <span className="text-gray-500">
              <FaCalendarAlt />
            </span>
            <h2 className="text-lg font-semibold text-gray-700">
              {formatDate(currentDate)}
            </h2>
            <button
              onClick={handleNextDay}
              className="p-2 rounded-full bg-teal-100 text-teal-600 hover:bg-teal-200 transition-colors"
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
                      fontSize: "0.875rem",
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

        {slots.length > 0 ? (
          <div className="space-y-2">
            {slots.map((slot) => (
              <div
                key={slot._id}
                className="p-3 bg-white rounded-lg shadow hover:bg-gray-50 transition-colors flex items-center justify-between"
              >
                <div className="flex items-center space-x-2">
                  <span className="text-teal-500">🕒</span>
                  <div>
                    <p className="text-sm text-gray-700">
                      Bắt đầu:{" "}
                      {new Date(slot.startTime).toLocaleTimeString("vi-VN")}
                    </p>
                    <p className="text-sm text-gray-700">
                      Kết thúc:{" "}
                      {new Date(slot.endTime).toLocaleTimeString("vi-VN")}
                    </p>
                  </div>
                </div>
                <span
                  className={`text-sm font-medium ${
                    slot.status === "Available"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {slot.status}
                </span>
              </div>
            ))}
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
