import axios from "axios";

const API_URL = "http://localhost:3000/appointments";

const appointmentFinishService = async (token) => {
  try {
    const response = await axios.post(
      `${API_URL}/token/done`,
      {}, // body rỗng tương đương với `-d ''`
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Lỗi khi hoàn tất lịch hẹn:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export default appointmentFinishService;
