// import React, { useState } from "react";
// import { useParams } from "react-router-dom";

// const doctors = [
//   {
//     id: 1,
//     name: "Dr. Nguyễn Văn A",
//     specialty: "Khoa Nội Tổng Quát",
//     experience: "15 năm kinh nghiệm",
//     avatar: "https://nguoinoitieng.tv/images/nnt/107/0/bjur.jpg",
//     schedule: [
//       { date: "2025-06-01", times: ["08:00", "09:00", "10:00", "14:00"] },
//       { date: "2025-06-02", times: ["08:30", "09:30", "11:00", "15:00"] },
//       { date: "2025-06-03", times: ["10:00", "11:30", "14:30", "16:00"] },
//       { date: "2025-06-04", times: ["08:00", "09:00", "10:00", "14:00"] },
//       { date: "2025-06-05", times: ["08:30", "09:30", "11:00", "15:00"] },
//     ],
//   },
//   {
//     id: 2,
//     name: "Dr. Trần Thị B",
//     specialty: "Khoa Nhi",
//     experience: "10 năm kinh nghiệm",
//     avatar: "https://nguoinoitieng.tv/images/nnt/107/0/bjur.jpg",
//     schedule: [
//       { date: "2025-06-01", times: ["09:00", "10:30", "13:00", "15:30"] },
//       { date: "2025-06-02", times: ["08:00", "10:00", "14:00", "16:00"] },
//       { date: "2025-06-03", times: ["09:30", "11:00", "13:30", "15:00"] },
//       { date: "2025-06-04", times: ["09:00", "10:30", "13:00", "15:30"] },
//       { date: "2025-06-05", times: ["08:00", "10:00", "14:00", "16:00"] },
//     ],
//   },
//   {
//     id: 3,
//     name: "Dr. Lê Văn C",
//     specialty: "Khoa Da Liễu",
//     experience: "12 năm kinh nghiệm",
//     avatar: "https://nguoinoitieng.tv/images/nnt/107/0/bjur.jpg",
//     schedule: [
//       { date: "2025-06-01", times: ["08:30", "10:00", "11:30", "14:30"] },
//       { date: "2025-06-02", times: ["09:00", "10:30", "13:00", "15:30"] },
//       { date: "2025-06-03", times: ["08:00", "09:30", "11:00", "14:00"] },
//       { date: "2025-06-04", times: ["08:30", "10:00", "11:30", "14:30"] },
//       { date: "2025-06-05", times: ["09:00", "10:30", "13:00", "15:30"] },
//     ],
//   },
//   {
//     id: 4,
//     name: "Dr. Phạm Thị D",
//     specialty: "Khoa Chấn Thương",
//     experience: "18 năm kinh nghiệm",
//     avatar: "https://nguoinoitieng.tv/images/nnt/107/0/bjur.jpg",
//     schedule: [
//       { date: "2025-06-01", times: ["09:30", "11:00", "13:30", "16:00"] },
//       { date: "2025-06-02", times: ["08:30", "10:00", "11:30", "14:30"] },
//       { date: "2025-06-03", times: ["09:00", "10:30", "13:00", "15:30"] },
//       { date: "2025-06-04", times: ["09:30", "11:00", "13:30", "16:00"] },
//       { date: "2025-06-05", times: ["08:30", "10:00", "11:30", "14:30"] },
//     ],
//   },
// ];

// const DetailDoctor = () => {
//   const { id } = useParams();
//   const doctor = doctors.find((doc) => doc.id === parseInt(id));
//   const [currentMonth, setCurrentMonth] = useState(new Date(2025, 5, 1)); // June 2025
//   const [selectedDate, setSelectedDate] = useState("");
//   const [selectedTime, setSelectedTime] = useState("");
//   const [bookingStatus, setBookingStatus] = useState("");

//   if (!doctor)
//     return <h2 className="text-center text-red-500">Không tìm thấy bác sĩ!</h2>;

//   const generateCalendar = () => {
//     const year = currentMonth.getFullYear();
//     const month = currentMonth.getMonth();
//     const firstDay = new Date(year, month, 1).getDay();
//     const daysInMonth = new Date(year, month + 1, 0).getDate();
//     const calendarDays = [];

//     // Add empty slots for days before the first day of the month
//     for (let i = 0; i < firstDay; i++) {
//       calendarDays.push(null);
//     }

//     // Add days of the month
//     for (let day = 1; day <= daysInMonth; day++) {
//       const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(
//         day
//       ).padStart(2, "0")}`;
//       const hasSchedule = doctor.schedule.some((slot) => slot.date === dateStr);
//       calendarDays.push({ day, dateStr, hasSchedule });
//     }

//     return calendarDays;
//   };

//   const handlePrevMonth = () => {
//     setCurrentMonth(
//       new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
//     );
//   };

//   const handleNextMonth = () => {
//     setCurrentMonth(
//       new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
//     );
//   };

//   const handleDateClick = (dateStr) => {
//     setSelectedDate(dateStr);
//     setSelectedTime(""); // Reset time selection when date changes
//     setBookingStatus("");
//   };

//   const handleBooking = (e) => {
//     e.preventDefault();
//     if (selectedDate && selectedTime) {
//       setBookingStatus(
//         `Đã đặt lịch hẹn với ${doctor.name} vào ngày ${selectedDate} lúc ${selectedTime}!`
//       );
//       setSelectedDate("");
//       setSelectedTime("");
//     } else {
//       setBookingStatus("Vui lòng chọn ngày và giờ hẹn!");
//     }
//   };

//   return (
//     <div className="w-full max-w-4xl mx-auto px-6 py-10">
//       <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
//         Thông Tin Bác Sĩ
//       </h2>
//       <div className="flex flex-col items-center bg-white shadow-lg rounded-lg p-6 mb-6">
//         <img
//           src={doctor.avatar}
//           alt={doctor.name}
//           className="w-32 h-32 rounded-full mb-4"
//         />
//         <h3 className="text-xl font-semibold text-gray-800">{doctor.name}</h3>
//         <p className="text-md text-gray-600">{doctor.specialty}</p>
//         <p className="text-sm text-gray-500">{doctor.experience}</p>
//       </div>

//       <div className="bg-white shadow-lg rounded-lg p-6">
//         <h3 className="text-xl font-semibold text-gray-800 mb-4">
//           Đặt Lịch Hẹn
//         </h3>
//         <div className="flex flex-col gap-4">
//           <div className="flex justify-between items-center mb-4">
//             <button
//               onClick={handlePrevMonth}
//               className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
//             >
//               Tháng trước
//             </button>
//             <h4 className="text-lg font-semibold">
//               {currentMonth.toLocaleString("vi-VN", {
//                 month: "long",
//                 year: "numeric",
//               })}
//             </h4>
//             <button
//               onClick={handleNextMonth}
//               className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
//             >
//               Tháng sau
//             </button>
//           </div>
//           <div className="grid grid-cols-7 gap-2 text-center">
//             {["CN", "T2", "T3", "T4", "T5", "T6", "T7"].map((day) => (
//               <div key={day} className="font-semibold text-gray-700">
//                 {day}
//               </div>
//             ))}
//             {generateCalendar().map((day, index) => (
//               <button
//                 key={index}
//                 onClick={() => day?.hasSchedule && handleDateClick(day.dateStr)}
//                 className={`p-2 rounded-full ${
//                   day
//                     ? day.hasSchedule
//                       ? "bg-green-100 hover:bg-green-200 cursor-pointer"
//                       : "bg-gray-100 text-gray-400 cursor-not-allowed"
//                     : "bg-transparent"
//                 } ${selectedDate === day?.dateStr ? "bg-green-300" : ""}`}
//                 disabled={!day || !day.hasSchedule}
//               >
//                 {day ? day.day : ""}
//               </button>
//             ))}
//           </div>
//           {selectedDate && (
//             <div>
//               <label className="block text-gray-700 mb-2">Chọn giờ:</label>
//               <div className="flex flex-wrap gap-2">
//                 {doctor.schedule
//                   .find((slot) => slot.date === selectedDate)
//                   ?.times.map((time) => (
//                     <button
//                       key={time}
//                       onClick={() => setSelectedTime(time)}
//                       className={`px-4 py-2 rounded-lg ${
//                         selectedTime === time
//                           ? "bg-green-500 text-white"
//                           : "bg-gray-200 hover:bg-gray-300"
//                       }`}
//                     >
//                       {time}
//                     </button>
//                   ))}
//               </div>
//             </div>
//           )}
//           <button
//             onClick={handleBooking}
//             className="mt-6 px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all"
//           >
//             Xác nhận đặt lịch
//           </button>
//           {bookingStatus && (
//             <p
//               className={`mt-4 text-center ${
//                 bookingStatus.includes("Vui lòng")
//                   ? "text-red-500"
//                   : "text-green-500"
//               }`}
//             >
//               {bookingStatus}
//             </p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DetailDoctor;
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import docService from "../../Services/CusService/docterListService"; // Assuming same service as TestAPI

const DetailDoctor = () => {
  const { id } = useParams(); // Get doctor ID from URL
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDoctorDetails = async () => {
      try {
        setLoading(true);
        const data = await docService.getDoctorById(id); // Assuming service has getDoctorById method
        setDoctor({
          id: data._id,
          name: data.userID.name,
          phone: data.userID.phone,
          room: data.room,
          experiences: data.experiences,
          degrees: data.degrees,
          specializations: data.specializations,
          isActive: data.isActive,
          createdAt: new Date(data.createdAt).toLocaleDateString(),
        });
      } catch (err) {
        setError("Không thể tải thông tin bác sĩ. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };
    fetchDoctorDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Đang tải...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Không tìm thấy thông tin bác sĩ.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="container mx-auto py-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Thông tin chi tiết bác sĩ
        </h1>
        <p className="text-gray-600 mt-2">
          <Link to="/" className="text-gray-600 hover:underline">
            Trang chủ
          </Link>{" "}
          /{" "}
          <Link to="/doctors" className="text-gray-600 hover:underline">
            Danh sách bác sĩ
          </Link>{" "}
          / <span className="text-gray-800">{doctor.name}</span>
        </p>
      </header>

      {/* Main Content */}
      <main className="container mx-auto py-8">
        <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
          <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6">
            {/* Doctor Image */}
            <div className="md:w-1/3">
              <img
                src="https://nguoinoitieng.tv/images/nnt/107/0/bjur.jpg" // Placeholder avatar
                alt={doctor.name}
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>

            {/* Doctor Details */}
            <div className="md:w-2/3">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Bác sĩ {doctor.name}
              </h2>
              <div className="space-y-4">
                <p className="text-gray-600">
                  <span className="font-semibold">Chuyên khoa: </span>
                  {doctor.specializations}
                </p>
                <p className="text-gray-600">
                  <span className="font-semibold">Số điện thoại: </span>
                  {doctor.phone}
                </p>
                <p className="text-gray-600">
                  <span className="font-semibold">Phòng: </span>
                  {doctor.room}
                </p>
                <p className="text-gray-600">
                  <span className="font-semibold">Kinh nghiệm: </span>
                  {doctor.experiences.join(", ")}
                </p>
                <p className="text-gray-600">
                  <span className="font-semibold">Bằng cấp: </span>
                  {doctor.degrees}
                </p>
                <p className="text-gray-600">
                  <span className="font-semibold">Trạng thái: </span>
                  {doctor.isActive ? "Đang hoạt động" : "Không hoạt động"}
                </p>
                <p className="text-gray-600">
                  <span className="font-semibold">Ngày tham gia: </span>
                  {doctor.createdAt}
                </p>
              </div>
              <Link
                to="/docs"
                className="mt-6 inline-block px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all"
              >
                Quay lại danh sách bác sĩ
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DetailDoctor;
