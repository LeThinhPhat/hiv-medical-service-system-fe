
import axiosClient from "../api.config"; 

const drugsManagerService = {
  // ✅ Lấy tất cả thuốc
  getAllDrugs: async () => {
    try {
      const response = await axiosClient.get("/drugs");
      return response.data.data;
    } catch (error) {
      console.error("Error fetching drugs:", error.response?.data || error.message);
      throw error;
    }
  },

  // ✅ Lấy thuốc theo ID
  getDrugById: async (id) => {
    try {
      const response = await axiosClient.get(`/drugs/${id}`);
      return response.data.data;
    } catch (error) {
      console.error("Error fetching drug by ID:", error.response?.data || error.message);
      throw error;
    }
  },

  // ✅ Tạo thuốc mới
  createDrug: async (data) => {
    try {
      const response = await axiosClient.post("/drugs", data);
      return response.data;
    } catch (error) {
      console.error("Error creating drug:", error.response?.data || error.message);
      throw error;
    }
  },

  // ✅ Cập nhật thuốc theo ID
  updateDrug: async (id, data) => {
    try {
      const response = await axiosClient.patch(`/drugs/${id}`, data);
      return response.data;
    } catch (error) {
      console.error("Error updating drug:", error.response?.data || error.message);
      throw error;
    }
  },

  // ✅ Xoá thuốc
  deleteDrug: async (id) => {
    try {
      const response = await axiosClient.delete(`/drugs/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting drug:", error.response?.data || error.message);
      throw error;
    }
  },
};

export default drugsManagerService;
