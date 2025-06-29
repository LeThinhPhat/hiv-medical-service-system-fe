import axios from "axios";

const API_URL = "http://localhost:3000/users";

const userManagerService = {
  // Lấy tất cả user
  getAllUsers: (token) =>
    axios.get(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),

  // ✅ Lấy user theo ID
  getUserById: (id, token) =>
    axios.get(`${API_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
};

export default userManagerService;
