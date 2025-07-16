import axiosClient from "./api.config";

const UserService = {
  getUserInfo: async (userId) => {
    try {
      const response = await axiosClient.get(`/users/${userId}`);
      console.log("Fetched user info:", response.data);
      return response.data.data;
    } catch (error) {
      console.error("Error fetching user info:", error);
      throw error;
    }
  },

  getAllUsers: async () => {
    try {
      const response = await axiosClient.get("/users");
      console.log("Fetched users:", response.data);
      return response.data.data;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  },

  updateUser: async (userId, userData) => {
    try {
      const response = await axiosClient.patch(`/users/${userId}`, userData);
      console.log("User updated:", response.data);
      return response.data.data;
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  },
};

export default UserService;
