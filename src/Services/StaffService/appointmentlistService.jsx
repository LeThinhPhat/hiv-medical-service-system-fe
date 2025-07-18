import axiosClient from "../api.config"; 

const appointmentListService = {
  getAllAppointments: async () => {
    try {
      const response = await axiosClient.get("/appointments");
      return response.data;
    } catch (error) {
      console.error("Error fetching appointments:", error.response?.data || error.message);
      throw error;
    }
  },

  confirmAppointment: async (id) => {
    try {
      const response = await axiosClient.patch(`/appointments/${id}/confirm`);
      return response.data;
    } catch (error) {
      console.error("Error confirming appointment:", error.response?.data || error.message);
      throw error;
    }
  },

  getAppointmentByPersonalID: async (personalID) => {
    try {
      const response = await axiosClient.post("/appointments/personalID", { personalID });
      return response.data;
    } catch (error) {
      console.error("Error fetching appointment by personalID:", error.response?.data || error.message);
      throw error;
    }
  },

  checkInAppointment: async (id) => {
    try {
      const response = await axiosClient.patch(`/appointments/${id}/checkin`);
      return response.data;
    } catch (error) {
      console.error("Error checking in appointment:", error.response?.data || error.message);
      throw error;
    }
  },

  cancelAppointment: async (appointmentId, reason) => {
    try {
      const response = await axiosClient.post("/appointments/cancle/appointment", {
        appoinmentId: appointmentId,
        reason,
      });
      return response.data;
    } catch (error) {
      console.error("Error canceling appointment:", error.response?.data || error.message);
      throw error;
    }
  },
};

export default appointmentListService;
