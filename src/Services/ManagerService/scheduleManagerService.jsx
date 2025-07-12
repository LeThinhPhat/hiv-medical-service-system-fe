// src/Services/DoctorService/scheduleManagerService.jsx
import axios from "axios";

const BASE_URL = "http://localhost:3000"; // hoặc dùng process.env nếu deploy

const scheduleManagerService = {
  // GET all doctor schedules
  // ✅ ĐÚNG: Truy cập .data.data nếu API trả về { data: [...] }
  getAllSchedules: async (token) => {
    try {
      const response = await axios.get(`${BASE_URL}/doctor-schedules`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Raw response:", response);
      return Array.isArray(response.data?.data) ? response.data.data : [];
    } catch (error) {
      console.error("Error fetching doctor schedules:", error);
      return [];
    }
  },
  getScheduleById: async (id, token) => {
    try {
      const response = await axios.get(`${BASE_URL}/doctor-schedules/${id}`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      // ✅ Lấy đúng object chi tiết trong data
      return response.data?.data;
    } catch (error) {
      console.error("Error fetching schedule detail:", error);
      throw error;
    }
  },
  deleteScheduleById: async (id, token) => {
    try {
      const response = await axios.delete(
        `${BASE_URL}/doctor-schedules/${id}`,
        {
          headers: {
            Accept: "*/*",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error deleting schedule:", error);
      throw error;
    }
  },
};

export default scheduleManagerService;
