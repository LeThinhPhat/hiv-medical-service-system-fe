import axiosClient from "./api.config"; // Đảm bảo axiosClient có interceptor gắn token

const userManagerService = {
  // ✅ Lấy tất cả user
  getAllUsers: async () => {
    try {
      const response = await axiosClient.get("/users");
      return response.data;
    } catch (error) {
      console.error("Error fetching all users:", error.response?.data || error.message);
      throw error;
    }
  },

  // ✅ Lấy user theo ID
  getUserById: async (id) => {
    try {
      const response = await axiosClient.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching user by ID:", error.response?.data || error.message);
      throw error;
    }
  },
};

export default userManagerService;
