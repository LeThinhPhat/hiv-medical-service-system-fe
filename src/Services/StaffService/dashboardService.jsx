const API_URL = "http://localhost:3000";

const dashboardService = {
  getRevenueStatistics: async (filter = "day") => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/statistics/revenue?filter=${filter}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Response status:", response.status);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error("Error fetching revenue statistics:", error);
      throw error;
    }
  },
};

export default dashboardService;
