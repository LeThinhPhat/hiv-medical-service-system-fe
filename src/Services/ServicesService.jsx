const BASE_URL = "http://localhost:3000";

const ServicesService = {
    getAllService : async () => {
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
      console.log("Fetched services:", result.data);
      return result.data;
    } catch (error) {
      console.error("Error fetching doctors:", error);
      throw error;
    }
  },
};
export default ServicesService;