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

 createUser: async (userData) => {
    try {
      const response = await axiosClient.post("/users", userData);
      console.log("User created:", response.data);
      return response.data.data;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  },
    deleteUser: async (userId) => {
    try {
      const response = await axiosClient.delete(`/users/${userId}`);
      console.log("User deleted:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    }
  },
  

    getAllRoles: async () => {
    const response = await axiosClient.get("/roles");
    return response.data.data;
  },
};

export default UserService;
