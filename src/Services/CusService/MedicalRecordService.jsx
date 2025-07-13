const BASE_URL = "http://localhost:3000";
const token = localStorage.getItem("token");
const MedicalRecordService = {
  getMedicalRecordByPersonalId: async (personalId) => {
    try {
      const response = await fetch(`${BASE_URL}/medicalrecords/personalID?personalId=${personalId}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Lỗi khi lấy hồ sơ bệnh án");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Fetch medical record error:", error);
      throw error;
    }
  },
   getMedicalRecordById: async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/medicalrecords/getone/${id}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Lỗi khi lấy hồ sơ bệnh án theo ID");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Fetch medical record by ID error:", error);
      throw error;
    }
  },
  getFullMedicalRecordByPersonalId: async (personalId) => {
    try {
      const basicRes = await MedicalRecordService.getMedicalRecordByPersonalId(personalId);
      const id = basicRes?.data?._id;

      if (!id) throw new Error("Không tìm thấy ID hồ sơ bệnh án");

      const fullRes = await MedicalRecordService.getMedicalRecordById(id);
      return fullRes.data; // chỉ trả về phần `data`
    } catch (error) {
      console.error("Lỗi khi lấy hồ sơ bệnh án chi tiết:", error);
      throw error;
    }
  }
};


export default MedicalRecordService;
