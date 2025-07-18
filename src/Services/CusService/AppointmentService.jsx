import axiosClient from "../api.config";

const appointmentService = {
  // Tạo lịch hẹn mới
  createAppointment: async (appointmentData) => {
    try {
      console.log("Creating appointment with data:", appointmentData);
      const response = await axiosClient.post("/appointments", appointmentData);

      const id = response.data?.data?._id || response.data?.data?.id;
      if (!id) throw new Error("Không lấy được ID lịch hẹn sau khi tạo!");

      // Gọi lại để lấy chi tiết
      return await appointmentService.getById(id);
    } catch (error) {
      console.error("Error creating appointment:", error);
      throw error;
    }
  },

  // Lấy lịch hẹn từ số định danh cá nhân
  getAppointmentsByPersonalID: async (personalID) => {
    try {
      console.log("Fetching appointments for Personal ID:", personalID);
      const response = await axiosClient.post("/patients/by-personal-id", { personalID });
      return response.data.data;
    } catch (error) {
      console.error("Lỗi khi lấy lịch hẹn theo Personal ID:", error);
      throw error;
    }
  },

  // Lấy chi tiết lịch hẹn theo ID
  getById: async (id) => {
    try {
      const response = await axiosClient.get(`/appointments/findOne/${id}`);
      return response.data.data;
    } catch (error) {
      console.error("Error get appointment by ID:", error);
      throw error;
    }
  },

  // Lấy lịch hẹn của người bệnh từ token
  getAppointmentByToken: async () => {
    try {
      const response = await axiosClient.get("/appointments/patienttoken");
      return response.data.data;
    } catch (error) {
      console.error("Error fetching appointment by token:", error);
      throw error;
    }
  },
};

export default appointmentService;
