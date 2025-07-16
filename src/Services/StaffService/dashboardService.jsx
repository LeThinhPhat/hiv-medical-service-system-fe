import axiosClient from "../api.config"; 
const dashboardService = {
  getRevenueStatistics: async (filter = "day") => {
    try {
      const response = await axiosClient.get(`/statistics/revenue`, {
        params: { filter },
      });
      return response.data.data;
    } catch (error) {
      console.error("Error fetching revenue statistics:", error);
      throw error;
    }
  },
};

export default dashboardService;
