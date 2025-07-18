
import axiosClient from "../api.config"; // Điều chỉnh đường dẫn nếu khác

const scheduleManagerService = {
  // ✅ Lấy tất cả lịch khám của bác sĩ
  getAllSchedules: async () => {
    try {
      const response = await axiosClient.get("/doctor-schedules");
      console.log("Raw response:", response);
      return Array.isArray(response.data?.data) ? response.data.data : [];
    } catch (error) {
      console.error("Error fetching doctor schedules:", error.response?.data || error.message);
      return [];
    }
  },

  // ✅ Lấy lịch theo ID
  getScheduleById: async (id) => {
    try {
      const response = await axiosClient.get(`/doctor-schedules/${id}`);
      return response.data?.data;
    } catch (error) {
      console.error("Error fetching schedule detail:", error.response?.data || error.message);
      throw error;
    }
  },

  // ✅ Xoá lịch khám theo ID
  deleteScheduleById: async (id) => {
    try {
      const response = await axiosClient.delete(`/doctor-schedules/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting schedule:", error.response?.data || error.message);
      throw error;
    }
  },
};

export default scheduleManagerService;
