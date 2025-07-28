const BASE_URL = "http://localhost:3000";
const token = localStorage.getItem("token");

const ARVmanagementService = {
  getRegiments: async () => {
    try {
      const response = await fetch(`${BASE_URL}/regiments`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error fetching regiments: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Failed to get ARV regiments:", error);
      throw error;
    }
  },
};

export default ARVmanagementService;
