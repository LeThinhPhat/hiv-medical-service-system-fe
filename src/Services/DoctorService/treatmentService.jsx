import axios from "axios";

const API_URL = "http://localhost:3000/treatments";

const treatmentService = {
  createTreatment: async (treatmentData, token) => {
    try {
      const response = await axios.post(API_URL, treatmentData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      return response.data;
    } catch (error) {
      console.error("❌ Lỗi khi tạo treatment:", error);
      throw error;
    }
  },

  getTreatmentByID: async (treatmentID, token) => {
    try {
      const response = await axios.get(`${API_URL}/${treatmentID}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      return response.data; // Trả về chi tiết treatment
    } catch (error) {
      console.error("❌ Lỗi khi lấy treatment theo ID:", error);
      throw error;
    }
  },
};

export default treatmentService;
