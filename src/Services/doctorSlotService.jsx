const BASE_URL = "http://localhost:3000";

const doctorSlotService = {
     getDoctorSlots: async ({ date, startTime, endTime }) => {
    try {
      const token = localStorage.getItem("token");
      const params = new URLSearchParams({
        date,
        startTime,
        endTime,
      });
      const response = await fetch(
        `${BASE_URL}/doctorSlots/doctors-by-slot?${params.toString()}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();
      console.log("API response:", result);
      if (result.statusCode !== 200) {
        throw new Error(result.message || "Failed to fetch doctor slots");
      }

      return result.data;
    } catch (error) {
      console.error("Error fetching doctor slots:", error);
      throw error;
    }
  },
  getDoctorSlotsByDate: async (doctorId, date) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `${BASE_URL}/doctorSlots/${doctorId}/slots-by-date?date=${date}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const result = await response.json();

    if (result.statusCode !== 200) {
      throw new Error(result.message || "Failed to fetch doctor slots by date");
    }

    return result.data;
  } catch (error) {
    console.error("Error fetching doctor slots by date:", error);
    throw error;
  }
}
};
export default doctorSlotService;