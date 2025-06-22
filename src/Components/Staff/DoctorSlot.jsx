import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { parseISO } from "date-fns";
import doctorslotService from "../../Services/StaffService/doctorslotService";

const localizer = momentLocalizer(moment);

const DoctorSlot = () => {
  const [events, setEvents] = useState([]);
  const [date, setDate] = useState(new Date());
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSlotInfo, setSelectedSlotInfo] = useState(null);
  const [dailySlots, setDailySlots] = useState({ morning: [], afternoon: [] });

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const rawSlots = await doctorslotService.getAllDoctorSlots();

        // Group slots by time and ID, filter for 7:00 AM to 8:00 PM
        const grouped = {};
        rawSlots.forEach((slot) => {
          const start = moment(slot.startTime);
          const end = moment(slot.endTime);
          if (
            start.hour() >= 7 &&
            end.hour() <= 20 &&
            start.isSame(end, "day")
          ) {
            const key = `${slot.startTime}-${slot.endTime}-${slot._id}`;
            if (!grouped[key]) {
              grouped[key] = { ...slot, count: 1 };
            } else {
              grouped[key].count += 1;
            }
          }
        });

        // Format events for calendar
        const formattedEvents = Object.values(grouped).map((slot) => ({
          id: slot._id,
          title: `Slot: ${slot.count} người`,
          start: parseISO(slot.startTime),
          end: parseISO(slot.endTime),
          allDay: false,
          slotData: slot,
        }));

        setEvents(formattedEvents);
        updateDailySlots(formattedEvents, date);
      } catch (error) {
        console.error("Lỗi khi lấy doctor slots:", error);
      }
    };

    fetchSlots();
  }, []);

  // Update daily slots for the selected date
  const updateDailySlots = (events, selectedDate) => {
    const selectedDay = moment(selectedDate).startOf("day");
    const nextDay = moment(selectedDay).add(1, "day");

    const filteredSlots = events.filter((event) => {
      const start = moment(event.start);
      return start.isSameOrAfter(selectedDay) && start.isBefore(nextDay);
    });

    const morning = filteredSlots.filter(
      (event) => moment(event.start).hour() < 12
    );
    const afternoon = filteredSlots.filter(
      (event) =>
        moment(event.start).hour() >= 12 && moment(event.start).hour() < 20
    );

    setDailySlots({
      morning: morning.sort((a, b) => a.start - b.start),
      afternoon: afternoon.sort((a, b) => a.start - b.start),
    });
  };

  useEffect(() => {
    updateDailySlots(events, date);
  }, [date, events]);

  const handleSlotClick = async (event) => {
    try {
      const token = localStorage.getItem("token");
      const data = await doctorslotService.getDoctorSlotById(event.id, token);
      setSelectedSlotInfo(data);
      setModalOpen(true);
    } catch (err) {
      console.error("Lỗi khi lấy thông tin slot:", err);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedSlotInfo(null);
  };

  const handleNavigate = (action) => {
    let newDate;
    switch (action) {
      case "NEXT_DAY":
        newDate = moment(date).add(1, "day").toDate();
        break;
      case "PREV_DAY":
        newDate = moment(date).subtract(1, "day").toDate();
        break;
      case "NEXT_WEEK":
        newDate = moment(date).add(1, "week").toDate();
        break;
      case "PREV_WEEK":
        newDate = moment(date).subtract(1, "week").toDate();
        break;
      case "NEXT_MONTH":
        newDate = moment(date).add(1, "month").toDate();
        break;
      case "PREV_MONTH":
        newDate = moment(date).subtract(1, "month").toDate();
        break;
      case "NEXT_YEAR":
        newDate = moment(date).add(1, "year").toDate();
        break;
      case "PREV_YEAR":
        newDate = moment(date).subtract(1, "year").toDate();
        break;
      case "TODAY":
        newDate = new Date();
        break;
      default:
        return;
    }
    setDate(newDate);
  };

  const renderSlotList = (slots, title) => (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-gray-700 mb-3">{title}</h3>
      {slots.length > 0 ? (
        <ul className="space-y-2">
          {slots.map((slot) => (
            <li
              key={slot.id}
              className="p-3 bg-gray-50 rounded-lg flex justify-between items-center hover:bg-blue-50 cursor-pointer transition-colors duration-200"
              onClick={() => handleSlotClick(slot)}
            >
              <div>
                <p className="text-sm font-medium text-gray-800">
                  {moment(slot.start).format("HH:mm")} -{" "}
                  {moment(slot.end).format("HH:mm")}
                </p>
                <p className="text-xs text-gray-500">{slot.title}</p>
              </div>
              <span className="text-xs text-blue-600 font-semibold">
                Xem chi tiết
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-gray-500 italic">
          Không có slot nào trong {title.toLowerCase()}.
        </p>
      )}
    </div>
  );

  // Set min and max time for calendar (7:00 AM to 8:00 PM)
  const minTime = new Date();
  minTime.setHours(7, 0, 0);
  const maxTime = new Date();
  maxTime.setHours(20, 0, 0);

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 to-gray-100 min-h-screen">
      <h2 className="text-3xl font-extrabold text-gray-800 mb-6">
        Lịch Làm Việc Bác Sĩ
      </h2>

      {/* Navigation Buttons */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          ["Năm Trước", "PREV_YEAR"],
          ["Tháng Trước", "PREV_MONTH"],
          ["Tuần Trước", "PREV_WEEK"],
          ["Ngày Trước", "PREV_DAY"],
          ["Hôm Nay", "TODAY"],
          ["Ngày Sau", "NEXT_DAY"],
          ["Tuần Sau", "NEXT_WEEK"],
          ["Tháng Sau", "NEXT_MONTH"],
          ["Năm Sau", "NEXT_YEAR"],
        ].map(([label, action]) => (
          <button
            key={action}
            onClick={() => handleNavigate(action)}
            className={`px-4 py-2 rounded-lg text-white transition duration-200 ${
              action === "TODAY"
                ? "bg-green-600 hover:bg-green-700"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Calendar */}
      <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
        <Calendar
          localizer={localizer}
          events={events}
          date={date}
          onNavigate={(newDate) => setDate(newDate)}
          defaultView="day"
          views={["day", "week", "month"]}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 400 }}
          popup
          onSelectEvent={handleSlotClick}
          min={minTime}
          max={maxTime}
          messages={{
            next: "Tiếp",
            previous: "Trước",
            today: "Hôm nay",
            month: "Tháng",
            week: "Tuần",
            day: "Ngày",
            agenda: "Lịch trình",
          }}
          eventPropGetter={() => ({
            style: {
              backgroundColor: "#2563eb",
              color: "white",
              borderRadius: "4px",
              border: "none",
            },
          })}
        />
      </div>

      {/* Daily Schedule */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          Lịch chi tiết ngày {moment(date).format("DD/MM/YYYY")}
        </h3>
        {renderSlotList(dailySlots.morning, "Buổi Sáng (07:00 - 12:00)")}
        {renderSlotList(dailySlots.afternoon, "Buổi Chiều (12:00 - 20:00)")}
      </div>

      {/* Modal */}
      {modalOpen && selectedSlotInfo && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg relative">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Thông tin Slot
            </h3>
            <p>
              <strong>Thời gian:</strong>{" "}
              {moment(selectedSlotInfo.startTime).format("HH:mm")} -{" "}
              {moment(selectedSlotInfo.endTime).format("HH:mm")}
            </p>
            <p>
              <strong>Trạng thái:</strong> {selectedSlotInfo.status}
            </p>

            {selectedSlotInfo.appointments &&
            selectedSlotInfo.appointments.length > 0 ? (
              <>
                <h4 className="mt-4 font-semibold text-gray-700">
                  Danh sách đặt lịch:
                </h4>
                <ul className="list-disc list-inside">
                  {selectedSlotInfo.appointments.map((a, idx) => (
                    <li key={idx}>
                      Bệnh nhân ID: {a.patientID?.userID || "Ẩn danh"}
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <p className="mt-2 text-gray-500 italic">
                Chưa có người đăng ký.
              </p>
            )}

            <button
              onClick={handleCloseModal}
              className="mt-6 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorSlot;
