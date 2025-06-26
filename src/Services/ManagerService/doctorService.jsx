// Services/ManagerService/doctorService.jsx
import axios from "axios";

const API_BASE_URL = "http://localhost:3000";

const doctorService = {
  getAllDoctors: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/doctors`, {
        headers: {
          Accept: "application/json",
        },
      });

      // ✅ Truy cập đúng mảng từ response.data.data
      if (Array.isArray(response.data.data)) {
        return response.data.data;
      } else {
        console.warn("API không trả về mảng:", response.data);
        return [];
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách bác sĩ:", error);
      return [];
    }
  },
};

export default doctorService;
