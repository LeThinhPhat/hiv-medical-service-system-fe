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
getAppointmentsByPersonalID: async (personalID) => {
  try {
    console.log("Fetching appointments for Personal ID:", personalID);
    const response = await fetch(`${BASE_URL}/patients/by-personal-id`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ personalID }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Không tìm thấy lịch hẹn");
    }

    return result.data;
  } catch (error) {
    console.error("Lỗi khi lấy lịch hẹn theo Personal ID:", error);
    throw error;
  }
},
  getById: async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${BASE_URL}/appointments/findOne/${id}`, {
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
  },

    getAppointmentByToken: async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${BASE_URL}/appointments/patienttoken`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      
      const result = await response.json();


      return result;
    } catch (error) {
      console.error(`Error fetching patient data:`, error);
      throw error;
    }
  },
};



export default appointmentService;
