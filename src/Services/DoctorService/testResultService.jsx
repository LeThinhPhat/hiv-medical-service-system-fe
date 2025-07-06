import axios from "axios";

const API_URL = "http://localhost:3000";

const testResultsService = {
  // Tạo test result
  createTestResult: async (data, token) => {
    try {
      const response = await axios.post(`${API_URL}/testResults`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      console.error("❌ Lỗi khi tạo test result:", error);
      throw error;
    }
  },

  // ✅ Lấy test results theo treatmentID
  getTestResultsByTreatmentID: async (treatmentID, token) => {
    try {
      const response = await axios.get(
        `${API_URL}/testResults/${treatmentID}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("❌ Lỗi khi lấy test results:", error);
      throw error;
    }
  },
};

export default testResultsService;
