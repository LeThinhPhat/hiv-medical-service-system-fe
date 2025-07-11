import axios from "axios";

const API_URL = "http://localhost:3000/educationalDocuments";

// Hàm lấy token đúng theo bạn đang dùng
const getToken = () => {
  return localStorage.getItem("token");
};

const educationalDocumentService = {
  // Lấy tất cả tài liệu
  getAllDocuments: async () => {
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
  createDocument: async (data) => {
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
  updateDocument: async (id, data) => {
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
  deleteDocument: async (id) => {
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

export default educationalDocumentService;
