// src/Services/Doctor/doctorAppointmentService.jsx

import axios from "axios";

const API_URL = "http://localhost:3000/appointments/token";

const doctorAppointmentService = {
  // Lấy danh sách cuộc hẹn từ access token
  getAppointmentsByToken: async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Token không tồn tại. Vui lòng đăng nhập lại.");
      }

      const response = await axios.post(
        API_URL,
        {}, // body rỗng
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      return response.data.data;
    } catch (error) {
      if (error.response?.status === 401) {
        console.error("❌ Token không hợp lệ hoặc đã hết hạn.");
      }
      console.error(
        "Lỗi khi lấy cuộc hẹn:",
        error.response?.data || error.message
      );
      throw error;
    }
  },
};

export default doctorAppointmentService;
