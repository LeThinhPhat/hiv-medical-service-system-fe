
import axiosClient from "../api.config"; // Đảm bảo đúng đường dẫn

const appointmentManagerService = {
  // Lấy tất cả cuộc hẹn
  getAllAppointments: async () => {
    try {
      const response = await axiosClient.get("/appointments");
      return response.data.data;
    } catch (error) {
      console.error("❌ Error fetching all appointments:", error);
      throw error;
    }
  },

  // Lấy chi tiết cuộc hẹn theo ID
  getAppointmentById: async (id) => {
    try {
      const response = await axiosClient.get(`/appointments/${id}`);
      return response.data.data;
    } catch (error) {
      console.error("❌ Error fetching appointment by ID:", error);
      throw error;
    }
  },

  // Cập nhật cuộc hẹn
  updateAppointment: async (id, data) => {
    try {
      const response = await axiosClient.patch(`/appointments/${id}`, data);
      return response.data;
    } catch (error) {
      console.error("❌ Error updating appointment:", error);
      throw error;
    }
  },

  // Xoá cuộc hẹn
  deleteAppointment: async (id) => {
    try {
      const response = await axiosClient.delete(`/appointments/${id}`);
      return response.data;
    } catch (error) {
      console.error("❌ Error deleting appointment:", error);
      throw error;
    }
  },
};

export default appointmentManagerService;
