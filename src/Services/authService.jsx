import axiosClient  from "./api.config";

// const VITE_API_URL = import.meta.env.VITE_API_URL;

const authService = {
     signin: (data) => axiosClient.post("/auth/login", data),
     signup: (data) => axiosClient.post("/auth/register", data)
    };

export default authService;
