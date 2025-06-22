import axios from "axios";

const BASE_URL = "http://localhost:3000";

const patientService = {
  // Lấy tất cả bệnh nhân
  getAllPatients: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/patients`);
      return response.data; // chứa statusCode, message, data
    } catch (error) {
      console.error("Error fetching patients:", error);
      throw error;
    }
  },
};

export default patientService;
