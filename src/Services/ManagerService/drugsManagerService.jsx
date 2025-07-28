import axios from "axios";

const API_URL = "http://localhost:3000/drugs";

// Lấy tất cả thuốc
const getAllDrugs = async (token) => {
  const response = await axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });
  return response.data.data;
};

// Lấy 1 thuốc theo ID
const getDrugById = async (token, id) => {
  const response = await axios.get(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });
  return response.data.data;
};

// Tạo thuốc mới
const createDrug = async (token, data) => {
  const response = await axios.post(API_URL, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

// Cập nhật thuốc theo ID
const updateDrug = async (token, id, data) => {
  const response = await axios.patch(`${API_URL}/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

// Xoá thuốc
const deleteDrug = async (token, id) => {
  const response = await axios.delete(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

const drugsManagerService = {
  getAllDrugs,
  getDrugById,
  createDrug,
  updateDrug,
  deleteDrug,
};

export default drugsManagerService;
