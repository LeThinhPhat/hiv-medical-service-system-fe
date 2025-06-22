const BASE_URL = "http://localhost:3000";

const PatientService = {
  getPatientByToken: async () => {
    try {
      const token = localStorage.getItem("token");
       if (!token) {
      return { medicalRecordID: "" };
    }
      const response = await fetch(`${BASE_URL}/patients/by-token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      
      const result = await response.json();
      
      console.log("API response:", result);

      return result.data;
    } catch (error) {
      console.error(`Error fetching patient data:`, error);
      throw error;
    }
  },
};

export default PatientService;