// src/Services/ManagerService/drugsManagerService.jsx

import axios from "axios";

const API_URL = "http://localhost:3000";

const drugsManagerService = {
  getAllDrugs: async () => {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}/drugs`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  },

  getDrugById: async (id) => {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}/drugs/${id}`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  },

  createDrug: async (drugData) => {
    const token = localStorage.getItem("token");
    const response = await axios.post(`${API_URL}/drugs`, drugData, {
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  // ✅ Xóa thuốc theo ID
  deleteDrug: async (id) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.delete(`${API_URL}/drugs/${id}`, {
        headers: {
          Accept: "*/*",
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error(`Failed to delete drug with ID ${id}:`, error);
      throw error;
    }
  },
};

export default drugsManagerService;
