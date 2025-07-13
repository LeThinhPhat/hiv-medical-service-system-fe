// src/Services/serviceAPI.js
import axios from "axios";

const API_BASE_URL = "http://localhost:3000";

// Lấy tất cả dịch vụ
const getAllServices = (token) => {
  return axios.get(`${API_BASE_URL}/services`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "*/*",
    },
  });
};

// Lấy dịch vụ theo ID
const getServiceById = (id, token) => {
  return axios.get(`${API_BASE_URL}/services/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });
};

// Cập nhật dịch vụ theo ID
const updateServiceById = (id, data, token) => {
  return axios.patch(`${API_BASE_URL}/services/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
};

// Tạo mới dịch vụ
const createService = (data, token) => {
  return axios.post(`${API_BASE_URL}/services`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
};

// (Tuỳ chọn) Xoá dịch vụ theo ID
const deleteServiceById = (id, token) => {
  return axios.delete(`${API_BASE_URL}/services/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });
};

export default {
  getAllServices,
  getServiceById,
  updateServiceById,
  createService,
  deleteServiceById, // ← thêm nếu bạn cần gọi API xoá
};
