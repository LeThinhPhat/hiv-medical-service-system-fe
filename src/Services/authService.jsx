import axiosClient  from "./api.config";

// const VITE_API_URL = import.meta.env.VITE_API_URL;

const authService = {
     signin: (data) => axiosClient.post("/auth/login", data),
     signup: (data) => axiosClient.post("/auth/register", data),
     forgotPassword: (email) => axiosClient.post("/auth/forgot-password", { email }),
       resetPassword: (token, newPassword) =>
    axiosClient.post("/auth/reset-password", { token, newPassword }),
};
    

export default authService;
