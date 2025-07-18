import axiosClient from "../api.config"; // Cập nhật đúng path tùy dự án

const treatmentService = {
  // Tạo mới treatment
  createTreatment: async (data) => {
    try {
      const response = await axiosClient.post("/treatments", data);
      return response.data;
    } catch (error) {
      console.error(
        "❌ Error creating treatment:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Lấy treatment theo ID
  getTreatmentById: async (id) => {
    try {
      const response = await axiosClient.get(`/treatments/${id}`);
      return response.data;
    } catch (error) {
      console.error(
        "❌ Error fetching treatment by ID:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Cập nhật treatment theo ID
  updateTreatment: async (id, data) => {
    try {
      const response = await axiosClient.patch(`/treatments/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(
        "❌ Error updating treatment:",
        error.response?.data || error.message
      );
      throw error;
    }
  },
};

export default treatmentService;
