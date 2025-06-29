import axios from "axios";

const API_BASE_URL = "http://localhost:3000";

const getAllServices = (token) => {
  return axios.get(`${API_BASE_URL}/services`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "*/*",
    },
  });
};

export default {
  getAllServices,
};
