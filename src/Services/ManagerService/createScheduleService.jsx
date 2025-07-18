import axiosClient from "../api.config"; // cập nhật đúng đường dẫn nếu khác

const createSchedule = async ({ doctorID, dates }) => {
  try {
    const response = await axiosClient.post("/doctor-schedules", {
      doctorID,
      dates,
    });

    return response.data;
  } catch (err) {
    console.error("❌ Lỗi API:", err.response?.data || err.message);
    throw err;
  }
};

export default {
  createSchedule,
};
