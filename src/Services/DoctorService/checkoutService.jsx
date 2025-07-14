import axios from "axios";

const API_URL = "http://localhost:3000/appointments";

const checkoutAppointment = async (appointmentId, token) => {
  try {
    const response = await axios.patch(
      `${API_URL}/${appointmentId}/checkout`,
      {}, // nếu body rỗng
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "*/*",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Checkout appointment error:", error);
    throw error;
  }
};

export default {
  checkoutAppointment,
};
