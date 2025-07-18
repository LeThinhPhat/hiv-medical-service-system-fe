import axiosClient from "./api.config";

const PatientService = {
  // Gửi form không cần token (patient guest)
  createPatient: async (patientData) => {
    try {
      const response = await axiosClient.post("/patients/guest", patientData);
   
      return response.data.data;
    } catch (error) {
      console.error("Error creating patient:", error);
      throw error;
    }
  },

  // Gửi request có token để lấy thông tin bệnh nhân
  getPatientByToken: async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return { medicalRecordID: "" };
      }

      const response = await axiosClient.post("/patients/by-token");
   
      return response.data.data;
    } catch (error) {
      console.error("Error fetching patient data:", error);
      throw error;
    }
  },
};

export default PatientService;
