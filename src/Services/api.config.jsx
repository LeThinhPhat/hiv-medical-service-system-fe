import axios from "axios";
import Cookies from "js-cookie";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Thêm token vào header nếu có
const handleRequestSuccess = (config) => {
  const token = localStorage.getItem('token');  // Sử dụng localStorage thay cho Cookies

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
};

const handleRequestError = (error) => {
  console.error("Request Error:", error);
  return Promise.reject(error);
};

// Xử lý phản hồi thành công
const handleResponseSuccess = (response) => response;

// Xử lý phản hồi lỗi
const handleResponseError = (error) => {
  console.error("Response Error:", error);

  // Nếu muốn, bạn có thể kiểm tra 401 và chuyển người dùng về trang đăng nhập:
  if (error.response && error.response.status === 401) {
    Cookies.remove("token");
    Cookies.remove("refreshToken");
    // window.location.href = "/login"; // Bỏ comment nếu muốn chuyển hướng khi token hết hạn
  }

  return Promise.reject(error);
};

// Cấu hình interceptors
axiosClient.interceptors.request.use(handleRequestSuccess, handleRequestError);
axiosClient.interceptors.response.use(handleResponseSuccess, handleResponseError);

export default axiosClient;
