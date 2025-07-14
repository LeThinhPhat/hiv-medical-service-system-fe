import React, { useState } from "react";
import AnonymousService from "../../../Services/CusService/AnonymousService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AnonymousConsultationForm = () => {
  const [dateString, setDateString] = useState("");
  const [timeString, setTimeString] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const selectedDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // reset về 00:00 để so sánh chính xác

    if (selectedDate < today) {
      toast.error("Vui lòng chọn ngày trong tương lai.");
      setIsSubmitting(false);
      return;
    }

    try {
      const result = await AnonymousService.createAnonymousAppointment(
        dateString,
        timeString
      );
      console.log("Kết quả:", result);

      toast.success("Đăng ký tư vấn thành công!");

      setDateString("");
      setTimeString("");
    } catch (error) {
      toast.error("Lỗi: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Chỉ tạo khung giờ phút là 00 từ 07:00–11:00 và 13:00–17:00
  const generateTimeOptions = () => {
    const times = [];
    const allowedHours = [
      ...Array.from({ length: 5 }, (_, i) => 7 + i),  // 07 → 11
      ...Array.from({ length: 5 }, (_, i) => 13 + i), // 13 → 17
    ];

    for (let hour of allowedHours) {
      const h = hour.toString().padStart(2, "0");
      times.push(`${h}:00`);
    }

    return times;
  };

  return (
    <div className="mt-12 max-w-md mx-auto bg-gradient-to-br from-white to-blue-50 p-8 rounded-2xl shadow-xl border border-gray-200">
      <ToastContainer position="top-center" autoClose={3000} />
      <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">
        Đăng ký tư vấn ẩn danh
      </h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ngày tư vấn
          </label>
          <input
            type="date"
            required
            min={new Date().toISOString().split("T")[0]} // 👈 giới hạn chỉ chọn từ hôm nay trở đi
            value={dateString}
            onChange={(e) => setDateString(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Giờ tư vấn
          </label>
          <select
            required
            value={timeString}
            onChange={(e) => setTimeString(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value=""> Chọn khung giờ </option>
            {generateTimeOptions().map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-2 rounded-lg text-white font-semibold transition duration-300 ${
            isSubmitting
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isSubmitting ? "Đang gửi..." : "Gửi yêu cầu tư vấn"}
        </button>
      </form>
    </div>
  );
};

export default AnonymousConsultationForm;
