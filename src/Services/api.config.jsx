import axios from "axios";
import Cookies from "js-cookie";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

const handleRequestSuccess = async (config) => {
  const token = Cookies.get("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
};

const handleRequestErr = (err) => {
  console.error("Request Error:", err);
  return Promise.reject(err);
};

const handleResponseSuccess = (res) => res;

const handleResponseErr = async (err) => {
  if (!err.response || !err.response.status) {
    console.error("Unknown error:", err);
    return Promise.reject(err);
  }

  const originalRequest = err.config;

  if (err.response.status === 401 && !originalRequest._retry) {
    originalRequest._retry = true;
    const refreshToken = Cookies.get("refreshToken");

    if (!refreshToken) {
      console.warn("No refresh token available");
      Cookies.remove("token");
      Cookies.remove("refreshToken");
      return Promise.reject(err);
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/refresh-token`,
        {
          token: refreshToken,
        },
      );

      const newAccessToken = res.data.accessToken;
      Cookies.set("token", newAccessToken); // Lưu token mới vào Cookies
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

      return axiosClient(originalRequest); // Gửi lại request ban đầu
    } catch (error) {
      console.error("Failed to refresh token:", error);
      Cookies.remove("token");
      Cookies.remove("refreshToken");

      return Promise.reject(error);
    }
  }

  return Promise.reject(err);
};

axiosClient.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

axiosClient.interceptors.request.use(handleRequestSuccess, handleRequestErr);
axiosClient.interceptors.response.use(handleResponseSuccess, handleResponseErr);

export default axiosClient;
