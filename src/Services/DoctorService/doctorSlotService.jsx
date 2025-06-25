// doctorSlotService.jsx
import axios from "axios";

const API_BASE_URL = "http://localhost:3000/doctorSlots";

const doctorSlotService = {
  getSlotsByDate: async (date) => {
    const token = localStorage.getItem("token"); // Hoặc lấy từ context / redux nếu bạn dùng
    try {
      const response = await axios.get(`${API_BASE_URL}/slots-by-date/token`, {
        params: { date },
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`, // thêm dòng này
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching slots by date:", error);
      throw error;
    }
  },
};

export default doctorSlotService;
