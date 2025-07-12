import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { toast } from "react-hot-toast";
import doctorService from "../../Services/ManagerService/doctorService";
import doctorScheduleService from "../../Services/ManagerService/createScheduleService";

const CreateDoctorScheduleWeek = () => {
  const [doctors, setDoctors] = useState([]);
  const [startDate, setStartDate] = useState(() => {
    const today = new Date();
    today.setDate(today.getDate() - today.getDay());
    return today;
  });
  const [scheduleData, setScheduleData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [openEventModal, setOpenEventModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDoctors, setSelectedDoctors] = useState([]);

  useEffect(() => {
    const fetchDoctors = async () => {
      setIsLoading(true);
      try {
        const data = await doctorService.getAllDoctors();
        setDoctors(data || []);
      } catch (err) {
        console.error("Lỗi khi lấy danh sách bác sĩ:", err);
        toast.error("Lỗi khi tải danh sách bác sĩ");
      } finally {
        setIsLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  const daysOfWeek = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    const key = date.toISOString().slice(0, 10);
    const label = date.toLocaleDateString("vi-VN", {
      weekday: "short",
      day: "2-digit",
      month: "2-digit",
    });
    return { key, label, date };
  });

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const doctorId = result.draggableId;
    const date = result.destination.droppableId;
    if (scheduleData[date]?.includes(doctorId)) return;
    setScheduleData((prev) => ({
      ...prev,
      [date]: [...(prev[date] || []), doctorId],
    }));
  };

  const handleRemoveDoctor = (date, doctorId) => {
    setScheduleData((prev) => ({
      ...prev,
      [date]: (prev[date] || []).filter((id) => id !== doctorId),
    }));
  };

  const handleAddEvent = () => {
    if (selectedDate && selectedDoctors.length > 0) {
      setScheduleData((prev) => {
        const currentDoctors = prev[selectedDate] || [];
        const newDoctors = selectedDoctors.filter(
          (id) => !currentDoctors.includes(id)
        );
        return {
          ...prev,
          [selectedDate]: [...currentDoctors, ...newDoctors],
        };
      });
      setOpenEventModal(false);
      setSelectedDoctors([]);
      setSelectedDate(null);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const selectedDoctorIDs = new Set();
      const selectedDates = [];

      Object.entries(scheduleData).forEach(([date, doctorIDs]) => {
        doctorIDs.forEach((id) => selectedDoctorIDs.add(id));
        selectedDates.push(date);
      });

      if (selectedDoctorIDs.size === 0 || selectedDates.length === 0) {
        throw new Error("Vui lòng chọn ít nhất một bác sĩ và ngày!");
      }

      const payload = {
        doctorID: Array.from(selectedDoctorIDs),
        dates: selectedDates,
      };

      await doctorScheduleService.createSchedule(payload);
      toast.success("Gửi lịch khám thành công!");
      setScheduleData({});
    } catch (err) {
      console.error("❌ API Error:", err.response?.data || err.message);
      toast.error(
        `Gửi lịch khám thất bại: ${err.response?.data?.message || err.message}`
      );
    } finally {
      setIsLoading(false);
      setOpenConfirmDialog(false);
    }
  };

  const handlePreviousWeek = () => {
    const newStart = new Date(startDate);
    newStart.setDate(startDate.getDate() - 7);
    setStartDate(newStart);
    setScheduleData({});
  };

  const handleNextWeek = () => {
    const newStart = new Date(startDate);
    newStart.setDate(startDate.getDate() + 7);
    setStartDate(newStart);
    setScheduleData({});
  };

  const availableDoctors = selectedDate
    ? doctors.filter((doc) => !scheduleData[selectedDate]?.includes(doc._id))
    : doctors;

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <div className="container mx-auto mt-10 p-8 bg-white shadow-xl rounded-xl relative">
        <h1 className="text-3xl font-bold mb-8 text-teal-600">
          Lịch Khám Bác Sĩ
        </h1>
        <div className="flex items-center mb-8 space-x-6">
          <DatePicker
            label="Chọn tuần"
            value={startDate}
            onChange={(newDate) => {
              if (newDate) {
                const adjustedDate = new Date(newDate);
                adjustedDate.setDate(newDate.getDate() - newDate.getDay());
                setStartDate(adjustedDate);
                setScheduleData({});
              }
            }}
            slotProps={{
              textField: { className: "w-48 bg-teal-50 rounded-md" },
            }}
          />
          <button
            className="px-5 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
            onClick={handlePreviousWeek}
          >
            ← Tuần trước
          </button>
          <button
            className="px-5 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
            onClick={handleNextWeek}
          >
            Tuần sau →
          </button>
        </div>

        {isLoading && (
          <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center z-10">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-teal-600"></div>
          </div>
        )}

        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex space-x-6">
            <Droppable droppableId="doctors">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="w-56 p-6 bg-teal-50 rounded-xl shadow-sm"
                >
                  <h2 className="text-xl font-semibold mb-4 text-teal-600">
                    Danh Sách Bác Sĩ
                  </h2>
                  {doctors.map((doc, index) => (
                    <Draggable
                      key={doc._id}
                      draggableId={doc._id}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="bg-teal-600 text-white rounded-lg px-4 py-2 mb-3 text-sm shadow hover:bg-teal-700 transition-colors"
                        >
                          {doc.userID?.name || "Không rõ"}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>

            <div className="flex-1 grid grid-cols-7 gap-4 bg-teal-50 p-6 rounded-xl shadow-sm">
              {daysOfWeek.map(({ key, label, date }) => (
                <Droppable key={key} droppableId={key}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`p-5 rounded-lg border ${
                        scheduleData[key]?.length > 0
                          ? "bg-teal-100"
                          : "bg-white"
                      } ${
                        date.toDateString() === new Date().toDateString()
                          ? "border-teal-500 border-2"
                          : "border-gray-200"
                      } hover:bg-teal-50 transition-colors min-h-[180px] shadow-sm`}
                    >
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-sm font-semibold text-teal-600">
                          {label}
                        </span>
                        <button
                          className="text-teal-500 hover:text-teal-700 transition-colors"
                          onClick={() => {
                            setSelectedDate(key);
                            setOpenEventModal(true);
                          }}
                          title="Thêm bác sĩ"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 4v16m8-8H4"
                            />
                          </svg>
                        </button>
                      </div>
                      {(scheduleData[key] || []).map((doctorId) => {
                        const doc = doctors.find((d) => d._id === doctorId);
                        return (
                          <div
                            key={doctorId}
                            className="flex items-center mb-2"
                          >
                            <span className="bg-teal-600 text-white rounded-lg px-3 py-1 text-xs flex-1 shadow-sm">
                              {doc?.userID?.name || doctorId}
                            </span>
                            <button
                              className="ml-2 text-red-500 hover:text-red-700 transition-colors"
                              onClick={() => handleRemoveDoctor(key, doctorId)}
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            </button>
                          </div>
                        );
                      })}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              ))}
            </div>
          </div>
        </DragDropContext>

        <button
          className={`w-full mt-8 py-3 text-white rounded-lg font-semibold ${
            Object.keys(scheduleData).length === 0 || isLoading
              ? "bg-teal-300 cursor-not-allowed"
              : "bg-teal-600 hover:bg-teal-700 transition-colors"
          } shadow-md`}
          onClick={() => setOpenConfirmDialog(true)}
          disabled={Object.keys(scheduleData).length === 0 || isLoading}
        >
          Gửi Lịch Khám
        </button>

        {openEventModal && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-8 w-[28rem] shadow-2xl">
              <h2 className="text-xl font-semibold mb-5 text-teal-600">
                Thêm Bác Sĩ Cho Ngày {selectedDate}
              </h2>
              <div className="mb-5">
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Chọn bác sĩ (giữ Ctrl/Cmd để chọn nhiều)
                </label>
                <select
                  multiple
                  value={selectedDoctors}
                  onChange={(e) =>
                    setSelectedDoctors(
                      Array.from(
                        e.target.selectedOptions,
                        (option) => option.value
                      )
                    )
                  }
                  className="w-full border border-gray-200 rounded-lg p-3 h-48 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-teal-50"
                >
                  {availableDoctors.length > 0 ? (
                    availableDoctors.map((doc) => (
                      <option key={doc._id} value={doc._id} className="py-1">
                        {doc.userID?.name || "Không rõ"}
                      </option>
                    ))
                  ) : (
                    <option disabled>Không còn bác sĩ nào để chọn</option>
                  )}
                </select>
                <p className="text-xs text-gray-500 mt-2">
                  Sử dụng Ctrl/Cmd + click để chọn nhiều bác sĩ hoặc Shift để
                  chọn một dãy.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {selectedDoctors.map((id) => {
                    const doc = doctors.find((d) => d._id === id);
                    return (
                      <span
                        key={id}
                        className="bg-teal-600 text-white rounded-lg px-3 py-1 text-xs shadow-sm"
                      >
                        {doc?.userID?.name || id}
                      </span>
                    );
                  })}
                </div>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  className="px-5 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  onClick={() => {
                    setOpenEventModal(false);
                    setSelectedDoctors([]);
                  }}
                >
                  Hủy
                </button>
                <button
                  className={`px-5 py-2 text-white rounded-lg ${
                    selectedDoctors.length === 0
                      ? "bg-teal-300 cursor-not-allowed"
                      : "bg-teal-600 hover:bg-teal-700 transition-colors"
                  } shadow-sm`}
                  onClick={handleAddEvent}
                  disabled={selectedDoctors.length === 0}
                >
                  Thêm
                </button>
              </div>
            </div>
          </div>
        )}

        {openConfirmDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-8 w-[28rem] shadow-2xl">
              <h2 className="text-xl font-semibold mb-5 text-teal-600">
                Xác nhận lịch khám
              </h2>
              <p className="mb-5 text-gray-700">
                Bạn có chắc chắn muốn gửi lịch khám sau?
              </p>
              <div className="mb-5 max-h-64 overflow-y-auto">
                {Object.entries(scheduleData).map(([date, doctorIDs]) => (
                  <div key={date} className="mb-3">
                    <p className="text-sm font-semibold text-teal-600">
                      {new Date(date).toLocaleDateString("vi-VN", {
                        weekday: "long",
                        day: "2-digit",
                        month: "2-digit",
                      })}
                    </p>
                    <p className="text-sm text-gray-600">
                      {doctorIDs
                        .map(
                          (id) =>
                            doctors.find((d) => d._id === id)?.userID?.name ||
                            id
                        )
                        .join(", ")}
                    </p>
                  </div>
                ))}
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  className="px-5 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  onClick={() => setOpenConfirmDialog(false)}
                >
                  Hủy
                </button>
                <button
                  className={`px-5 py-2 text-white rounded-lg ${
                    isLoading
                      ? "bg-teal-300 cursor-not-allowed"
                      : "bg-teal-600 hover:bg-teal-700 transition-colors"
                  } shadow-sm`}
                  onClick={handleSubmit}
                  disabled={isLoading}
                >
                  Xác nhận
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </LocalizationProvider>
  );
};

export default CreateDoctorScheduleWeek;
