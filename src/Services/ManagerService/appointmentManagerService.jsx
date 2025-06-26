import axios from "axios";

const API_BASE_URL = "http://localhost:3000";

const appointmentManagerService = {
  // Lấy danh sách tất cả cuộc hẹn
  getAllAppointments: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/appointments`, {
        headers: {
          Accept: "*/*",
        },
      });

      const data = response.data;

      // Trường hợp data là mảng trực tiếp
      if (Array.isArray(data)) {
        return data;
      }

      // Trường hợp data là object chứa mảng bên trong
      if (Array.isArray(data.appointments)) {
        return data.appointments;
      }

      if (Array.isArray(data.data)) {
        return data.data;
      }

      console.warn("Dữ liệu trả về không đúng định dạng mảng:", data);
      return [];
    } catch (error) {
      console.error("Lỗi khi lấy danh sách cuộc hẹn:", error);
      throw error;
    }
  },
};

export default appointmentManagerService;
