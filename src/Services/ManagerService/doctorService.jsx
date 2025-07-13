// Services/ManagerService/doctorService.jsx
import axios from "axios";

const API_BASE_URL = "http://localhost:3000";

const doctorService = {
  // Lấy tất cả bác sĩ
  getAllDoctors: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/doctors`, {
        headers: {
          Accept: "application/json",
        },
      });

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

  // ✅ Lấy thông tin chi tiết bác sĩ theo ID
  getDoctorById: async (id, token) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/doctors/${id}`, {
        headers: {
          Accept: "*/*",
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Lỗi khi lấy chi tiết bác sĩ:", error);
      throw error;
    }
  },

  // ✅ Cập nhật thông tin bác sĩ theo ID
  updateDoctorById: async (id, data, token) => {
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/doctors/${id}`,
        data,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Lỗi khi cập nhật bác sĩ:", error);
      throw error;
    }
  },
};

export default doctorService;
