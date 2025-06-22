import axios from "axios";

const API_URL = "http://localhost:3000/appointments";

const appointmentListService = {
  getAllAppointments: async () => {
    try {
      const response = await axios.get(API_URL, {
        headers: {
          Accept: "*/*",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching appointments:", error);
      throw error;
    }
  },
};

export default appointmentListService;
