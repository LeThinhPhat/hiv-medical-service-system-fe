const BASE_URL = "http://localhost:3000";

const AnonymousService = {
  createAnonymousAppointment: async (dateString, timeString) => {
    const token = localStorage.getItem("token");
    console.log("Creating anonymous appointment with:", { dateString, timeString });
    try {
      const response = await fetch(`${BASE_URL}/anonymousAppointments`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ dateString, timeString }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Lỗi tạo cuộc hẹn");
      }

      return await response.json();
    } catch (error) {
      console.error("Tạo lịch hẹn ẩn danh thất bại:", error);
      throw error;
    }
  },
getAllAnonymousAppointments: async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${BASE_URL}/anonymousAppointments`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Lỗi khi lấy danh sách cuộc hẹn");
      }

      return await response.json();
    } catch (error) {
      console.error("Lấy danh sách lịch hẹn ẩn danh thất bại:", error);
      throw error;
    }
  },
  confirmAnonymousAppointment: async (id) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${BASE_URL}/anonymousAppointments/${id}/confirm`, {
        method: "PATCH",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Lỗi xác nhận cuộc hẹn");
      }

      return await response.json();
    } catch (error) {
      console.error("Xác nhận lịch hẹn ẩn danh thất bại:", error);
      throw error;
    }
  },
};

export default AnonymousService;
