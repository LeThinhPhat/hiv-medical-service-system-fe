import axios from "axios";

// Base URL của API
const API_URL = "http://localhost:3000/treatments";

// Hàm tạo mới treatment
const createTreatment = async (token, data) => {
  try {
    const response = await axios.post(API_URL, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error creating treatment:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Hàm lấy treatment theo ID
const getTreatmentById = async (id, token) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching treatment by ID:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Hàm cập nhật treatment theo ID
const updateTreatment = async (id, token, data) => {
  try {
    const response = await axios.patch(`${API_URL}/${id}`, data, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error updating treatment:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export default {
  createTreatment,
  getTreatmentById,
  updateTreatment,
};
