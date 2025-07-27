import axiosClient from "./api.config";

const authService = {
  signin: (data) => axiosClient.post("/auth/login", data),
  signup: (data) => axiosClient.post("/auth/register", data),
  forgotPassword: (email) => axiosClient.post("/auth/forgot-password", { email }),
  resetPassword: (token, newPassword) =>
    axiosClient.post("/auth/reset-password", { token, newPassword }),
  changePassword: (oldPassword, newPassword) =>
    axiosClient.post("/auth/change-password", { oldPassword, newPassword }),

  // Thêm hàm cập nhật người dùng theo ID
  updateUserById: (id, data) => axiosClient.patch(`/auth/${id}`, data),
};

export default authService;