import axiosClient from "../api.config"; 

const doctorslotService = {
  // Lấy tất cả slot khám
  getAllDoctorSlots: async () => {
    try {
      const response = await axiosClient.get("/doctorSlots");
      return response.data.data;
    } catch (error) {
      console.error("Lỗi khi lấy danh sách doctor slots:", error);
      throw error;
    }
  },

  // Lấy chi tiết 1 slot theo ID
  getDoctorSlotById: async (id) => {
    try {
      const response = await axiosClient.get(`/doctorSlots/${id}`);
      return response.data.data;
    } catch (error) {
      console.error("Lỗi khi lấy thông tin slot:", error);
      throw error;
    }
  },
};

export default doctorslotService;
