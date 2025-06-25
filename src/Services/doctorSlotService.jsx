const BASE_URL = "http://localhost:3000";

const doctorSlotService = {
    getAvailableSlotsByDate: async (serviceId, date) => {
    const token = localStorage.getItem("token");
    console.log("Fetching available slots for serviceId:", serviceId, "on date:", date);
    const url = `${BASE_URL}/doctorSlots/available-slots-by-date?serviceId=${serviceId}&date=${date}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "accept": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });
      const result = await response.json();
      console.log("API response:", result);
    if (!response.ok) throw new Error("Lỗi khi lấy khung giờ");
    return result;
  },
 getDoctorSlotByDoctor: async (doctorId, startTime) => {
  const token = localStorage.getItem("token");
  console.log("Fetching doctor slots for doctorId:", doctorId, "startTime:", startTime);
  
  // Dùng đúng endpoint: /doctorSlots/{doctorId}/slot-by-starttime?startTime={startTime}
  const response = await fetch(
    `${BASE_URL}/doctorSlots/${doctorId}/slot-by-starttime?startTime=${startTime}`, 
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
},

     getDoctorSlots: async ({startTime}) => {
    try {
      const token = localStorage.getItem("token");
      const params = new URLSearchParams({
        startTime,
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
  getDoctorSlotsByDateAndService: async (doctorId, date, serviceId) => {
  try {
    
    const token = localStorage.getItem("token");
    const response = await fetch(
      `${BASE_URL}/doctorSlots/${doctorId}/available-slots?serviceId=${serviceId}&date=${date}`,
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