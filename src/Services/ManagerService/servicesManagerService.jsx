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

// GET service by ID
const getServiceById = (id, token) => {
  return axios.get(`${API_BASE_URL}/services/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });
};

// UPDATE service by ID
const updateServiceById = (id, data, token) => {
  return axios.patch(`${API_BASE_URL}/services/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
};

export default {
  getAllServices,
  getServiceById,
  updateServiceById,
};
