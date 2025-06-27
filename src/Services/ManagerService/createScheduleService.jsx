// Services/ManagerService/createScheduleService.jsx
import axios from "axios";

const API_URL = "http://localhost:3000/doctor-schedules";

const createSchedule = async ({ doctorID, dates }) => {
  const token = localStorage.getItem("token");

  try {
    const response = await axios.post(
      API_URL,
      { doctorID, dates },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (err) {
    console.error("❌ Lỗi API:", err.response?.data || err.message);
    throw err;
  }
};

export default {
  createSchedule,
};
