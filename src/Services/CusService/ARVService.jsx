const BASE_URL = "http://localhost:3000";

const token = localStorage.getItem("token");

const ARVService = {
  // Hàm lấy thông tin phác đồ điều trị theo ID
  getPrescribedRegimentById: async (id) => {
    try {
        console.log("Fetching regiment with ID:", id);
      const response = await fetch(`${BASE_URL}/prescribedRegiments/${id}`, {
        method: "GET",
        headers: {
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch prescribed regiment");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching prescribed regiment:", error.message);
      throw error;
    }
  }
};

export default ARVService;
