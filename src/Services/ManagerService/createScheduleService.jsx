// Services/ManagerService/createScheduleService.jsx
import axios from "axios";

const API_URL = "http://localhost:3000/doctor-schedules"; // ✅ chỉnh URL nếu khác

const createSchedule = async ({ doctorID, dates }) => {
  const token = localStorage.getItem("token");

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
};

// ✅ ĐÂY LÀ ĐIỂM QUAN TRỌNG
export default {
  createSchedule,
};
