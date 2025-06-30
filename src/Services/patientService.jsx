const BASE_URL = "http://localhost:3000";

const PatientService = {
  createPatient: async (patientData) => {
    try {
      const response = await fetch(`${BASE_URL}/patients/guest`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(patientData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("API response:", result);
      return result.data;
    } catch (error) {
      console.error(`Error creating patient:`, error);
      throw error;
    }
  },

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