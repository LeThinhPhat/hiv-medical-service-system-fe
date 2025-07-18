// Services/ManagerService/patientManagerService.js
import axiosClient from "../api.config"; // Cập nhật đường dẫn nếu cần

const patientManagerService = {
  // ✅ Lấy tất cả bệnh nhân
  getAllPatients: async () => {
    try {
      const response = await axiosClient.get("/patients");
      return response.data;
    } catch (error) {
      console.error("Error fetching all patients:", error.response?.data || error.message);
      throw error;
    }
  },

  // ✅ Lấy chi tiết bệnh nhân theo ID
  getPatientById: async (id) => {
    try {
      const response = await axiosClient.get(`/patients/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching patient by ID:", error.response?.data || error.message);
      throw error;
    }
  },
};

export default patientManagerService;
