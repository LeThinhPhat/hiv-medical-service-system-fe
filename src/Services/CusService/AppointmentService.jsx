const BASE_URL = "http://localhost:3000";

const appointmentService = {
  createAppointment: async (appointmentData) => {
    try {
      const token = localStorage.getItem("token");
      console.log("Creating appointment with data:", appointmentData);
      const response = await fetch(`${BASE_URL}/appointments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(appointmentData),
      });
      const result = await response.json();

      if (!response.ok || result.statusCode !== 201) {
        throw new Error(result.message || "Failed to create appointment");
      }

      const id = result.data?._id || result.data?.id;
      if (!id) throw new Error("Không lấy được ID lịch hẹn sau khi tạo!");

      return await appointmentService.getById(id);

    } catch (error) {
      console.error("Error creating appointment:", error);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${BASE_URL}/appointments/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Không tìm thấy lịch hẹn");
      }
      return result.data;
    } catch (error) {
      console.error("Error get appointment by ID:", error);
      throw error;
    }
  }
};

export default appointmentService;
