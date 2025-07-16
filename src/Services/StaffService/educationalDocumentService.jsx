import axiosClient from "../api.config";

const educationalDocumentService = {
  // Lấy tất cả tài liệu
  getAllDocuments: async () => {
    try {
      const response = await axiosClient.get("/educationalDocuments");
      return response.data.data;
    } catch (error) {
      console.error("Lỗi khi lấy danh sách tài liệu:", error);
      throw error;
    }
  },

  // Lấy tài liệu theo ID
  getDocumentById: async (id) => {
    try {
      const response = await axiosClient.get(`/educationalDocuments/${id}`);
      return response.data.data;
    } catch (error) {
      console.error("Lỗi khi lấy tài liệu:", error);
      throw error;
    }
  },

  // Tạo tài liệu mới
  createDocument: async (data) => {
    try {
      const response = await axiosClient.post("/educationalDocuments", data);
      return response.data.data;
    } catch (error) {
      console.error("Lỗi khi tạo tài liệu:", error);
      throw error;
    }
  },

  // Cập nhật tài liệu
  updateDocument: async (id, data) => {
    try {
      const response = await axiosClient.patch(`/educationalDocuments/${id}`, data);
      return response.data.data;
    } catch (error) {
      console.error("Lỗi khi cập nhật tài liệu:", error);
      throw error;
    }
  },

  // Xoá tài liệu
  deleteDocument: async (id) => {
    try {
      await axiosClient.delete(`/educationalDocuments/${id}`);
    } catch (error) {
      console.error("Lỗi khi xoá tài liệu:", error);
      throw error;
    }
  },
};

export default educationalDocumentService;
