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
            value={dateString}
            onChange={(e) => setDateString(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Giờ tư vấn
          </label>
          <input
            type="time"
            required
            value={timeString}
            onChange={(e) => setTimeString(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
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
