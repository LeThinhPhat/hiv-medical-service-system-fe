import axiosClient from "./api.config";

const doctorSlotService = {
  getAvailableSlotsByDate: async (serviceId, date) => {
    try {
      const response = await axiosClient.get("/doctorSlots/available-slots-by-date", {
        params: { serviceId, date },
      });
      console.log("Fetched slots:", response.data);
      return response.data;
    } catch (error) {
      console.error("Lỗi khi lấy khung giờ:", error);
      throw error;
    }
  },

  getDoctorSlotByDoctor: async (doctorId, startTime) => {
    try {
      const response = await axiosClient.get(
        `/doctorSlots/${doctorId}/slot-by-starttime`,
        { params: { startTime } }
      );

      const result = response.data;
      if (result.statusCode !== 200) {
        throw new Error(result.message || "Failed to fetch doctor slots");
      }

      return result.data;
    } catch (error) {
      console.error("Error fetching doctor slots by doctor:", error);
      throw error;
    }
  },

  getDoctorSlots: async ({ startTime }) => {
    try {
      const response = await axiosClient.get(
        "/doctorSlots/doctors-by-slot",
        { params: { startTime } }
      );

      const result = response.data;
      if (result.statusCode !== 200) {
        throw new Error(result.message || "Failed to fetch doctor slots");
      }

      return result.data;
    } catch (error) {
      console.error("Error fetching doctor slots:", error);
      throw error;
    }
  },

  getDoctorSlotsByDateAndService: async (doctorId, date, serviceId) => {
    try {
      const response = await axiosClient.get(
        `/doctorSlots/${doctorId}/available-slots`,
        { params: { serviceId, date } }
      );

      const result = response.data;
      if (result.statusCode !== 200) {
        throw new Error(result.message || "Failed to fetch doctor slots by date");
      }

      return result.data;
    } catch (error) {
      console.error("Error fetching doctor slots by date:", error);
      throw error;
    }
  },
};

export default doctorSlotService;
