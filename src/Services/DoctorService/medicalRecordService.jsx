import axios from "axios";

const API_URL = "http://localhost:3000/medicalrecords";

const medicalRecordService = {
  // Gọi API để tạo hồ sơ bệnh án mới
  createMedicalRecord: async (data) => {
    try {
      const token = localStorage.getItem("token");

      const payload = {
        patientID: data.patientID,
        diagnosis: data.diagnosis,
        symptoms: data.symptoms,
        clinicalNotes: data.clinicalNotes,
        createdBy: data.createdBy,
      };

      const response = await axios.post(API_URL, payload, {
        headers: {
          Accept: "*/*",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Gửi token nếu backend yêu cầu
        },
      });

      return response.data;
    } catch (error) {
      console.error("Lỗi tạo hồ sơ bệnh án:", error);
      throw error;
    }
  },

  // Gọi API để lấy tất cả hồ sơ bệnh án
  getAllMedicalRecords: async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(API_URL, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data.data;
    } catch (error) {
      console.error("Lỗi lấy danh sách hồ sơ bệnh án:", error);
      throw error;
    }
  },
  // Gọi API để lấy hồ sơ bệnh án theo ID
  getMedicalRecordById: async (id) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(`${API_URL}/${id}`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data.data; // hoặc response.data tùy vào backend trả về
    } catch (error) {
      console.error("Lỗi lấy hồ sơ bệnh án theo ID:", error);
      throw error;
    }
  },
};
export default medicalRecordService;
