const BASE_URL = "http://localhost:3000";

const docListService = {
  getAllDoctors: async () => {
    try {
      const token = localStorage.getItem("token"); // Lấy token từ localStorage

      if (!token) {
        throw new Error("Token không hợp lệ || không có token");
      }

      const response = await fetch(`${BASE_URL}/doctors`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Gửi token trong header
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
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Token không hợp lệ || không có token");
      }

      const response = await fetch(`${BASE_URL}/doctors/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
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
