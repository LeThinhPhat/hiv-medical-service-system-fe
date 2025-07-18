import axiosClient from "../api.config";

const medicalRecordService = {
  // 📝 Tạo hồ sơ bệnh án
  createMedicalRecord: async (data) => {
    try {
      const { patientID, serviceId, ...payload } = data;

      const response = await axiosClient.post(
        `/medicalrecords/${patientID}?serviceId=${serviceId}`,
        payload
      );

      return response.data;
    } catch (error) {
      console.error("❌ Lỗi tạo hồ sơ bệnh án:", error.response?.data || error);
      throw error;
    }
  },

  // 📋 Lấy tất cả hồ sơ bệnh án
  getAllMedicalRecords: async () => {
    try {
      const response = await axiosClient.get("/medicalrecords");
      return response.data.data;
    } catch (error) {
      console.error("❌ Lỗi lấy danh sách hồ sơ bệnh án:", error.response?.data || error);
      throw error;
    }
  },

  // 🔍 Lấy hồ sơ theo mã định danh (CCCD/PersonalID)
  getMedicalRecordByPersonalID: async (personalId) => {
    try {
      const response = await axiosClient.get("/medicalrecords/personalID", {
        params: { personalId },
      });
      return response.data.data;
    } catch (error) {
      console.error("❌ Lỗi lấy hồ sơ theo Personal ID:", error.response?.data || error);
      throw error;
    }
  },
};

export default medicalRecordService;
