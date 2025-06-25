// services/doctorScheduleService.js
import axios from "axios";

const API_URL = "http://localhost:3000/doctor-schedules";

const doctorScheduleService = {
  // 📅 Lấy lịch làm việc bác sĩ theo tuần
  getScheduleByWeek: async (token, startDate, endDate) => {
    try {
      const response = await axios.get(`${API_URL}/schedule-by-week/token`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        params: {
          startDate,
          endDate,
        },
      });
      return response.data;
    } catch (error) {
      console.error(
        "❌ Lỗi khi lấy lịch làm việc theo tuần:",
        error.response?.data || error
      );
      throw error;
    }
  },

  // ✅ Xác nhận lịch làm việc (Confirm ca làm)
  confirmSchedule: async (scheduleID, shiftName, token) => {
    try {
      const response = await axios.patch(
        `${API_URL}/${scheduleID}/confirm`,
        null, // PATCH không cần body ở API này
        {
          headers: {
            Accept: "*/*",
            Authorization: `Bearer ${token}`,
          },
          params: {
            shiftName, // shiftName = morning | afternoon | full
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error(
        "❌ Lỗi khi xác nhận lịch làm:",
        error.response?.data || error
      );
      throw error;
    }
  },
};

export default doctorScheduleService;
