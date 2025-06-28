// Services/ManagerService/patientManagerService.js
import axios from "axios";

const getAllPatients = (token) => {
  return axios.get("http://localhost:3000/patients", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Thêm hàm lấy chi tiết bệnh nhân theo ID
const getPatientById = (id, token) => {
  return axios.get(`http://localhost:3000/patients/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });
};

export default {
  getAllPatients,
  getPatientById,
};
