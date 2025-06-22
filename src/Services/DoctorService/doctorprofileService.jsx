// src/services/DoctorService/doctorProfileService.jsx
import axios from "axios";

const BASE_URL = "http://localhost:3000";

export const getDoctorById = async (id, token = null) => {
  try {
    const response = await axios.get(`${BASE_URL}/doctors/${id}`, {
      headers: {
        Accept: "*/*",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    // 🟢 Trả về đúng phần dữ liệu (tuỳ vào API của bạn)
    return response.data.data; // nếu API trả về { data: { ... } }
  } catch (error) {
    console.error("Error fetching doctor data:", error);
    throw error;
  }
};
