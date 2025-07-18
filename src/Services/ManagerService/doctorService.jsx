import axiosClient from "../api.config"; // Đảm bảo đúng đường dẫn đến api.config.js

const doctorService = {
  // ✅ Lấy tất cả bác sĩ
  getAllDoctors: async () => {
    try {
      const response = await axiosClient.get("/doctors");
      const data = response.data?.data;
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error("Lỗi khi lấy danh sách bác sĩ:", error.response?.data || error.message);
      return [];
    }
  },

  // ✅ Lấy thông tin chi tiết bác sĩ theo ID
  getDoctorById: async (id) => {
    try {
      const response = await axiosClient.get(`/doctors/${id}`);
      return response.data;
    } catch (error) {
      console.error("Lỗi khi lấy chi tiết bác sĩ:", error.response?.data || error.message);
      throw error;
    }
  },

  // ✅ Cập nhật thông tin bác sĩ theo ID
  updateDoctorById: async (id, data) => {
    try {
      const response = await axiosClient.patch(`/doctors/${id}`, data);
      return response.data;
    } catch (error) {
      console.error("Lỗi khi cập nhật bác sĩ:", error.response?.data || error.message);
      throw error;
    }
  },
};

export default doctorService;
