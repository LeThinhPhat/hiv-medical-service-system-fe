const BASE_URL = "http://localhost:3000";

const docListService = {
  getAllDoctors: async () => {
    try {
      const response = await fetch(`${BASE_URL}/doctors`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (result.statusCode !== 200) {
        throw new Error(result.message || "Failed to fetch doctors");
      }

      return result.data;
    } catch (error) {
      console.error("Error fetching doctors:", error);
      throw error;
    }
  },

  getDoctorById: async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/doctors/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (result.statusCode !== 200) {
        throw new Error(result.message || "Failed to fetch doctor by ID");
      }

      return result.data;
    } catch (error) {
      console.error(`Error fetching doctor with ID ${id}:`, error);
      throw error;
    }
  },
};

export default docListService;
