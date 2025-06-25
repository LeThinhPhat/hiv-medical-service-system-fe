import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaUserMd, FaEnvelope, FaStethoscope, FaRegBuilding, FaBriefcase } from "react-icons/fa";
import doctorSlotService from "../../../Services/doctorSlotService";
import docListService from "../../../Services/CusService/docterListService";
import ServicesService from "../../../Services/ServicesService";

// Hàm trả về yyyy-MM-dd hôm nay
const today = new Date();
const pad = (v) => String(v).padStart(2, '0');
const defaultDate = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;

function formatTime(isoString) {
  const date = new Date(isoString);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function formatDate(isoDateString) {
  if (!isoDateString) return "";
  const date = new Date(isoDateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

const BookingPage = () => {
  const { doctorId } = useParams();
  const navigate = useNavigate();

  const [selectedDate, setSelectedDate] = useState(defaultDate); // yyyy-MM-dd
  const [schedule, setSchedule] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [doctorInfo, setDoctorInfo] = useState(null);
  const [loadingDoctor, setLoadingDoctor] = useState(true);
  const [error, setError] = useState(null);
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState("");

  const userRole = localStorage.getItem("role") || "patient";

  // Lấy thông tin bác sĩ
  useEffect(() => {
  const fetchDoctorInfo = async () => {
    setLoadingDoctor(true);
    setError(null);
    try {
       const info = await docListService.getDoctorById(doctorId);
       setDoctorInfo(info);
       const services = await ServicesService.getAllService();
      
      setDoctorInfo(info);
      setServices(services);
    } catch (err) {
      setError("Không thể tải thông tin bác sĩ. Vui lòng thử lại.",err);
      setDoctorInfo(null);
    } finally {
      setLoadingDoctor(false);
    }
  };
  if (doctorId) fetchDoctorInfo();
}, [doctorId]);

  // Lấy lịch khám theo ngày và dịch vụ
  useEffect(() => {
    const fetchSchedule = async () => {
      if (!selectedService) {
        setSchedule([]);
        setSelectedSlot(null);
        return;
      }
      try {
        const slots = await doctorSlotService.getDoctorSlotsByDateAndService(
          doctorId,
          selectedDate,
          selectedService
        );
        setSchedule([{ date: selectedDate, slots: slots || [] }]);
        setSelectedSlot(null);
      } catch (err) {
        console.error("Lỗi khi lấy lịch làm việc:",);
        setSchedule([]);
        setSelectedSlot(null);
      }
    };
    if (doctorId && selectedDate && selectedService) fetchSchedule();
  }, [doctorId, selectedDate, selectedService]);

  const getInitials = (name) => {
    if (!name) return "DR";
    return name
      .split(" ")
      .map((w) => w[0]?.toUpperCase())
      .join("")
      .slice(0, 2);
  };

  const handleConfirmBooking = () => {
    if (!selectedSlot || !selectedService) return;
    navigate("/booking/confirm", {
      state: {
        doctor: doctorInfo,
        slot: selectedSlot,
        date: selectedDate,
        userRole: userRole,
        service: services.find((s) => s._id === selectedService),
      },
    });
  };

  return (
    <div className="max-w-4xl mx-auto mt-8 p-4 bg-transparent">
      {/* Profile Card */}
      <div className="relative flex flex-col items-center mb-10">
        <div className="bg-white shadow-md rounded-lg pt-16 pb-8 w-full flex flex-col items-center relative border border-gray-200">
          <div className="absolute -top-12 flex justify-center w-full">
            <div className="rounded-full shadow-lg bg-white border-4 border-blue-200 p-1">
              {loadingDoctor ? (
                <div className="w-24 h-24 rounded-full bg-gray-200 animate-pulse flex items-center justify-center text-gray-500 text-4xl font-bold">
                  DR
                </div>
              ) : doctorInfo ? (
                doctorInfo.avatar ? (
                  <img
                    src={doctorInfo.avatar}
                    alt={doctorInfo.userID.name || "Doctor"}
                    className="w-24 h-24 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-blue-400 flex items-center justify-center text-white text-4xl font-bold">
                    {getInitials(doctorInfo.userID.name)}
                  </div>
                )
              ) : (
                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-4xl font-bold">
                  DR
                </div>
              )}
            </div>
          </div>
          <div className="mt-3 flex flex-col items-center">
            {loadingDoctor ? (
              <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
            ) : (
              <h1 className="text-3xl font-semibold text-gray-700 flex items-center gap-2">
                <FaUserMd className="text-blue-600" />
                {doctorInfo?.userID?.name || "Tên bác sĩ"}
              </h1>
            )}
            <div className="flex flex-col gap-2 mt-4 text-center w-full max-w-xs">
              {loadingDoctor ? (
                <>
                  <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mx-auto"></div>
                  <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mx-auto"></div>
                  <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mx-auto"></div>
                  <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mx-auto"></div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2 text-gray-700 justify-center">
                    <FaStethoscope className="text-blue-600" />
                    {doctorInfo?.specializations || "Chuyên khoa chưa cập nhật"}
                  </div>
                  <div className="flex items-center gap-2 text-gray-700 justify-center">
                    <FaEnvelope className="text-blue-600" />
                    {doctorInfo?.email || "Email chưa cập nhật"}
                  </div>
                  <div className="flex items-center gap-2 text-gray-700 justify-center">
                    <FaBriefcase className="text-blue-600" />
                    Kinh nghiệm: {doctorInfo?.experiences?.[0] || "Chưa cập nhật"}
                  </div>
                  <div className="flex items-center gap-2 text-gray-700 justify-center">
                    <FaRegBuilding className="text-blue-600" />
                    Phòng: {doctorInfo?.room || "Chưa cập nhật"}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200 text-center">
          {error}
        </div>
      )}

      {/* Service Picker */}
      <div className="mb-6 flex items-center gap-3">
        <label htmlFor="service" className="font-semibold text-gray-700">
          Chọn dịch vụ:
        </label>
        <select
          id="service"
          value={selectedService}
          className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all"
          onChange={(e) => setSelectedService(e.target.value)}
        >
          <option value="">-- Chọn dịch vụ --</option>
          {services.map((service) => (
            <option value={service._id} key={service._id}>
              {service.name}
            </option>
          ))}
        </select>
      </div>

      {/* Schedule */}
      <div className="bg-white rounded-lg shadow-md p-8 border border-gray-200">
        {/* Date picker */}
        <div className="mb-6 flex items-center gap-3">
          <label htmlFor="date" className="font-semibold text-gray-700">
            Chọn ngày khám:
          </label>
          <input
            type="date"
            id="date"
            value={selectedDate}
            min={defaultDate}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all"
            onChange={(e) => setSelectedDate(e.target.value)}
            disabled={!selectedService}
          />
        </div>

        {/* Chỉ hiển thị lịch khi đã chọn dịch vụ */}
        {!selectedService ? (
          <p className="text-center text-gray-500">
            Vui lòng chọn dịch vụ để xem lịch khám.
          </p>
        ) : schedule.length === 0 || schedule[0].slots.length === 0 ? (
          <p className="text-center text-gray-500">
            Không có lịch làm việc cho bác sĩ này vào ngày{" "}
            {formatDate(selectedDate)}
          </p>
        ) : (
          <div>
            {schedule.map((day, idx) => (
              <div key={idx} className="mb-4">
                <h2 className="font-semibold mb-3 text-lg text-gray-700">
                  Bạn đang chọn đặt lịch vào ngày {formatDate(day.date)}
                </h2>
                <div className="flex gap-3 flex-wrap">
                  {day.slots.map((slot) => (
                    <button
                      key={slot._id}
                      className={`px-5 py-2 rounded-md border transition-all text-base font-semibold
                        ${
                          selectedSlot && selectedSlot._id === slot._id
                            ? "bg-blue-600 text-white borderVinhome-blue-600 shadow-md"
                            : "bg-white text-gray-700 hover:bg-blue-50 border-gray-300 hover:border-blue-600"
                        }`}
                      onClick={() => setSelectedSlot(slot)}
                    >
                      {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                    </button>
                  ))}
                </div>
              </div>
            ))}
            {selectedSlot && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200 text-center shadow">
                <span>
                  <span className="mr-1 text-gray-700">Bạn đã chọn:</span>
                  <b className="text-blue-600">
                    {formatTime(selectedSlot.startTime)} -{" "}
                    {formatTime(selectedSlot.endTime)}
                  </b>
                </span>
                <button
                  className="ml-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-all font-semibold shadow"
                  onClick={handleConfirmBooking}
                >
                  Xác nhận đặt lịch
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingPage;