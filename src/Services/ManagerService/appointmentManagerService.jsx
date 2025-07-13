import axios from "axios";

const API_URL = "http://localhost:3000/appointments";

// Lấy tất cả cuộc hẹn
const getAllAppointments = async (token) => {
  const response = await axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });
  return response.data.data;
};

// Lấy chi tiết một cuộc hẹn theo ID
const getAppointmentById = async (token, id) => {
  const response = await axios.get(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });
  return response.data.data;
};

// Cập nhật cuộc hẹn
const updateAppointment = async (token, id, data) => {
  const response = await axios.patch(`${API_URL}/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

// Xoá cuộc hẹn
const deleteAppointment = async (token, id) => {
  const response = await axios.delete(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

const appointmentManagerService = {
  getAllAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
};

export default appointmentManagerService;
