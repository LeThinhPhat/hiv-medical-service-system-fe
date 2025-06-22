import doctorService from "./doctorService";

export const fetchAppointments = async (doctorId) => {
  try {
    const response = await doctorService.getAppointments(doctorId);
    if (response.status === 200 && response.data) {
      return response.data.map((appointment) => ({
        id: appointment._id,
        name: "Tên Bệnh Nhân", // Placeholder, điều chỉnh nếu có dữ liệu thực tế
        type: "Thăm khám trực tiếp", // Placeholder, điều chỉnh dựa trên serviceID
        time: new Date(appointment.startTime).toLocaleTimeString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
        email: appointment.createdBy?.email || "N/A",
        phone: "9876543210", // Placeholder, điều chỉnh nếu có số điện thoại
        payment:
          appointment.status === "pending_payment"
            ? "Chưa thanh toán"
            : "Đã thanh toán",
        avatar: `https://randomuser.me/api/portraits/men/${Math.floor(
          Math.random() * 50
        )}.jpg`, // Avatar ngẫu nhiên
      }));
    }
    return [];
  } catch (error) {
    console.error("Lỗi khi lấy danh sách lịch hẹn:", error);
    throw error;
  }
};
