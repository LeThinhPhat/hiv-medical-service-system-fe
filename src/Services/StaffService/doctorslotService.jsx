import axios from "axios";

const API_URL = "http://localhost:3000/doctorSlots";

const doctorslotService = {
  // Lấy tất cả slot khám
  getAllDoctorSlots: async () => {
    try {
      const response = await axios.get(API_URL, {
        headers: {
          Accept: "*/*",
        },
      });
      return response.data.data; // hoặc response.data nếu cần toàn bộ
    } catch (error) {
      console.error("Lỗi khi lấy danh sách doctor slots:", error);
      throw error;
    }
  },

  // Lấy chi tiết 1 slot theo ID
  getDoctorSlotById: async (id, token) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`, // Truyền token để xác thực nếu cần
        },
      });
      return response.data.data;
    } catch (error) {
      console.error("Lỗi khi lấy thông tin slot:", error);
      throw error;
    }
  },
};

export default doctorslotService;
