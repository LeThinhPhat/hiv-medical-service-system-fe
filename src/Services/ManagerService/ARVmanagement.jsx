import axiosClient from "../api.config"; // cập nhật đúng đường dẫn nếu khác

const ARVmanagementService = {
  getRegiments: async () => {
    try {
      const response = await axiosClient.get("/regiments");
      return response.data; // hoặc response.data.data nếu API có dạng { data: [...] }
    } catch (error) {
      console.error("❌ Failed to get ARV regiments:", error.response?.data || error.message);
      throw error;
    }
  },
};
export default ARVmanagementService;
