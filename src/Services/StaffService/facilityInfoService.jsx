import axiosClient from "../api.config";

const facilityInfoService = {
  // Lấy tất cả tài liệu
  getAll: async () => {
    try {
      const response = await axiosClient.get("/facilityInfo");
      return response.data.data;
    } catch (error) {
      console.error("Lỗi khi lấy danh sách tài liệu:", error);
      throw error;
    }
  },

  // Lấy tài liệu theo ID
  getDocumentById: async (id) => {
    try {
      const response = await axiosClient.get(`/facilityInfo/${id}`);
      return response.data.data;
    } catch (error) {
      console.error("Lỗi khi lấy tài liệu:", error);
      throw error;
    }
  },

  // Tạo tài liệu mới
  create: async (data) => {
    try {
      const response = await axiosClient.post("/facilityInfo", data);
      return response.data.data;
    } catch (error) {
      console.error("Lỗi khi tạo tài liệu:", error);
      throw error;
    }
  },

  // Cập nhật tài liệu
  update: async (id, data) => {
    try {
      const response = await axiosClient.patch(`/facilityInfo/${id}`, data);
      return response.data.data;
    } catch (error) {
      console.error("Lỗi khi cập nhật tài liệu:", error);
      throw error;
    }
  },

  // Xoá tài liệu
  delete: async (id) => {
    try {
      await axiosClient.delete(`/facilityInfo/${id}`);
    } catch (error) {
      console.error("Lỗi khi xoá tài liệu:", error);
      throw error;
    }
  },
};

export default facilityInfoService;
