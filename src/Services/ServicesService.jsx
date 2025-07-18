const BASE_URL = "http://localhost:3000";

const ServicesService = {
  getAllService: async () => {
    try {
      const token = localStorage.getItem("token"); // Lấy token từ localStorage

      const response = await fetch(`${BASE_URL}/services`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Gửi token trong header
        },
      });

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error("Error fetching doctors:", error);
      throw error;
    }
  },
  getServiceById: async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${BASE_URL}/services/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Gửi token trong header
        },
      });

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error("Error fetching doctors:", error);
      throw error;
    }
  },
};
export default ServicesService;
