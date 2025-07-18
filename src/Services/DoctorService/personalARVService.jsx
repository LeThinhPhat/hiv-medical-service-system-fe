import axiosClient from "../api.config"; // Cập nhật path đúng với dự án bạn

const BASE_URL = "/prescribedRegiments";

const prescribedRegimenService = {
  // 🧠 Gợi ý phác đồ điều trị
  suggestRegimen: async (treatmentID) => {
    try {
      const response = await axiosClient.post(`${BASE_URL}/suggest`, {
        treatmentID,
      });
      return response.data;
    } catch (error) {
      console.error(
        "❌ Lỗi khi gọi gợi ý phác đồ:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // 🩺 Tạo phác đồ điều trị cá nhân hóa
  createPrescribedRegimen: async (data) => {
    try {
      const response = await axiosClient.post(BASE_URL, data);
      return response.data;
    } catch (error) {
      console.error(
        "❌ Lỗi khi tạo phác đồ cá nhân hóa:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // 🔍 Lấy thông tin phác đồ theo ID
  getPrescribedRegimenById: async (regimenId) => {
    try {
      const response = await axiosClient.get(`${BASE_URL}/${regimenId}`);
      return response.data;
    } catch (error) {
      console.error(
        "❌ Lỗi khi lấy phác đồ theo ID:",
        error.response?.data || error.message
      );
      throw error;
    }
  },
};

export default prescribedRegimenService;
