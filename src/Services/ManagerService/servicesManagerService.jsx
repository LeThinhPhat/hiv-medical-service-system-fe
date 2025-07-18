// src/Services/serviceAPI.js
import axiosClient from "../api.config"; 
const serviceAPI = {
  // ✅ Lấy tất cả dịch vụ
  getAllServices: async () => {
    try {
      const response = await axiosClient.get("/services");
      return response.data;
    } catch (error) {
      console.error("Error fetching services:", error.response?.data || error.message);
      throw error;
    }
  },

  // ✅ Lấy dịch vụ theo ID
  getServiceById: async (id) => {
    try {
      const response = await axiosClient.get(`/services/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching service by ID:", error.response?.data || error.message);
      throw error;
    }
  },

  // ✅ Cập nhật dịch vụ theo ID
  updateServiceById: async (id, data) => {
    try {
      const response = await axiosClient.patch(`/services/${id}`, data);
      return response.data;
    } catch (error) {
      console.error("Error updating service:", error.response?.data || error.message);
      throw error;
    }
  },

  // ✅ Tạo mới dịch vụ
  createService: async (data) => {
    try {
      const response = await axiosClient.post("/services", data);
      return response.data;
    } catch (error) {
      console.error("Error creating service:", error.response?.data || error.message);
      throw error;
    }
  },

  // ✅ Xoá dịch vụ theo ID
  deleteServiceById: async (id) => {
    try {
      const response = await axiosClient.delete(`/services/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting service:", error.response?.data || error.message);
      throw error;
    }
  },
};

export default serviceAPI;
