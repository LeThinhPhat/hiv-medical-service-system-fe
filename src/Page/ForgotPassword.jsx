import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import authService from "../Services/authService";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await authService.forgotPassword(email);
      toast.success("Đã gửi liên kết đặt lại mật khẩu đến email của bạn.");
      setTimeout(() => {
        window.open("https://mail.google.com", "_blank"); // mở Gmail sau 2 giây
      }, 2000);
    } catch (error) {
      toast.error("Gửi thất bại: " + (error.response?.data?.message || "Đã xảy ra lỗi."));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <ToastContainer position="top-center" autoClose={3000} />
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Quên mật khẩu
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Nhập email của bạn để đặt lại mật khẩu
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Email của bạn"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Gửi liên kết đặt lại mật khẩu
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
