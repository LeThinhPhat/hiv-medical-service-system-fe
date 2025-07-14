import axios from "axios";

const API_URL = "http://localhost:3000/appointments";
const appointmentListService = {
  
  getAllAppointments: async () => {
    try {
      const token = localStorage.getItem("token"); 
      console.log("token", token);
      const response = await axios.get(API_URL, {
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`, 
          },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching appointments:", error);
      throw error;
    }
  },
  confirmAppointment: async (id) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.patch(
      `${API_URL}/${id}/confirm`,
      {},
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error confirming appointment:", error);
    throw error;
  }
},
getAppointmentByPersonalID: async (personalID) => {
    try {
      const token = localStorage.getItem("token"); // Lấy token từ localStorage
      const response = await axios.post(
        `${API_URL}/personalID`,
        { personalID },
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`, 
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching appointment by personalID:", error);
      throw error;
    }
  },
 checkInAppointment: async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.patch(
        `${API_URL}/${id}/checkin`,
        {},
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error checking in appointment:", error);
      throw error;
    }
  },
 
 cancelAppointment: async (appoinmentId, reason) => {
  try {
    const token = localStorage.getItem("token");
    console.log("token", token);
    const response = await axios.post(
      `${API_URL}/cancle/appointment`,
      {appoinmentId,
        reason, // thêm lý do như yêu cầu từ Swagger
      },
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error canceling appointment:", error);
    throw error;
  }
},
  
};
 
export default appointmentListService;
