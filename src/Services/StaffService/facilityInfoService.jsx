import axios from "axios";

const API_URL = "http://localhost:3000/facilityInfo";

// Hàm lấy token đúng theo bạn đang dùng
const getToken = () => {
  return localStorage.getItem("token");
};

const facilityInfoService = {
  // Lấy tất cả tài liệu
  getAll: async () => {
    try {
      const response = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      return response.data.data;
    } catch (error) {
      console.error("Lỗi khi lấy danh sách tài liệu:", error);
      throw error;
    }
  },

  // Lấy tài liệu theo ID
  getDocumentById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      return response.data.data;
    } catch (error) {
      console.error("Lỗi khi lấy tài liệu:", error);
      throw error;
    }
  },

  // Tạo tài liệu mới
  create: async (data) => {
    try {
      const response = await axios.post(API_URL, data, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      return response.data.data;
    } catch (error) {
      console.error("Lỗi khi tạo tài liệu:", error);
      throw error;
    }
  },

  // Cập nhật tài liệu
  update: async (id, data) => {
    try {
      const response = await axios.patch(`${API_URL}/${id}`, data, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      return response.data.data;
    } catch (error) {
      console.error("Lỗi khi cập nhật tài liệu:", error);
      throw error;
    }
  },

  // Xoá tài liệu
  delete: async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
    } catch (error) {
      console.error("Lỗi khi xoá tài liệu:", error);
      throw error;
    }
  },
};

export default facilityInfoService;
