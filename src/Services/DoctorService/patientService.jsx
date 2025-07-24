
import axiosClient from "../api.config"; // Đảm bảo đúng đường dẫn

const patientService = {
  // 📋 Lấy tất cả bệnh nhân
  getAllPatients: async () => {
    try {
      const response = await axiosClient.get("/patients");
      return response.data; // { statusCode, message, data }
    } catch (error) {
      console.error("❌ Lỗi khi lấy danh sách bệnh nhân:", error);
      throw error;
    }
  },

  // 🔍 Lấy chi tiết bệnh nhân theo ID
  getPatientById: async (id) => {
    try {
      const response = await axiosClient.get(`/patients/${id}`);
      return response.data;
    } catch (error) {
      console.error("❌ Lỗi khi lấy chi tiết bệnh nhân:", error);
      throw error;
    }
  },
};

export default patientService;
