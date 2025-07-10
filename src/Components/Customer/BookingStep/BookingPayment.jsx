import { useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import paymentService from "../../../Services/CusService/PaymentService";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Divider,
} from "@mui/material";
import EventIcon from "@mui/icons-material/Event";
import PersonIcon from "@mui/icons-material/Person";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import PaymentIcon from "@mui/icons-material/Payment";

function formatTime(isoString) {
  const date = new Date(isoString);
  const adjustedDate = new Date(date.getTime() - 7 * 60 * 60 * 1000);
  return adjustedDate.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

function formatDate(isoDateString) {
  if (!isoDateString) return "";
  const date = new Date(isoDateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

const BookingPaymentPage = () => {
  const location = useLocation();
  const { info, appointment } = location.state || {};

  console.log("BookingPaymentPage location state:", appointment);

  const handlePayment = async () => {
    try {
      const { paymentUrl } = await paymentService.createPayment({
        appointmentID: appointment._id,
      });
      window.location.href = paymentUrl;
    } catch (err) {
      toast.error("Tạo thanh toán thất bại!");
      throw err;
    }
  };

  return (
    <Box
      sx={{
        maxWidth: "md",
        mx: "auto",
        mt: 8,
        p: { xs: 2, sm: 4 },
        bgcolor: "#f8fafc",
        borderRadius: "16px",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
      }}
    >
      <Typography
        variant="h4"
        sx={{
          fontWeight: 700,
          color: "#1e293b",
          textAlign: "center",
          mb: 4,
          py: 2,
          bgcolor: "linear-gradient(to right, #3b82f6, #60a5fa)",
          background: "#3b82f6",
          borderRadius: "12px",
        }}
      >
        Thanh toán lịch hẹn
      </Typography>
      <Card
        sx={{
          borderRadius: "12px",
          border: "2px solid #e5e7eb",
          bgcolor: "#fff",
          boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)",
          mb: 4,
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Box display="flex" alignItems="center" mb={2}>
            <EventIcon sx={{ color: "#3b82f6", mr: 1.5, fontSize: 24 }} />
            <Typography variant="body1" sx={{ fontWeight: 600, color: "#1e293b" }}>
              Mã lịch hẹn: <span style={{ color: "#3b82f6" }}>{appointment._id || "N/A"}</span>
            </Typography>
          </Box>
          <Divider sx={{ my: 2, bgcolor: "#e5e7eb" }} />
          <Box display="flex" alignItems="center" mb={2}>
            <PersonIcon sx={{ color: "#3b82f6", mr: 1.5, fontSize: 24 }} />
            <Typography variant="body1" sx={{ fontWeight: 500, color: "#475569" }}>
              <b>Bệnh nhân:</b> {appointment.patientID?.userID?.name || appointment.patientID?.name}
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" mb={2}>
            <PersonIcon sx={{ color: "#3b82f6", mr: 1.5, fontSize: 24 }} />
            <Typography variant="body1" sx={{ fontWeight: 500, color: "#475569" }}>
              <b>CCCD:</b> {appointment.patientID.personalID}
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" mb={2}>
            <PersonIcon sx={{ color: "#3b82f6", mr: 1.5, fontSize: 24 }} />
            <Typography variant="body1" sx={{ fontWeight: 500, color: "#475569" }}>
              <b>SĐT:</b> {info?.phone || "Không có"}
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" mb={2}>
            <MedicalServicesIcon sx={{ color: "#3b82f6", mr: 1.5, fontSize: 24 }} />
            <Typography variant="body1" sx={{ fontWeight: 500, color: "#475569" }}>
              <b>Bác sĩ:</b> {appointment.doctorID.userID?.name}
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" mb={2}>
            <EventIcon sx={{ color: "#3b82f6", mr: 1.5, fontSize: 24 }} />
            <Typography variant="body1" sx={{ fontWeight: 500, color: "#475569" }}>
              <b>Ngày:</b> {formatDate(appointment.date)}
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" mb={2}>
            <EventIcon sx={{ color: "#3b82f6", mr: 1.5, fontSize: 24 }} />
            <Typography variant="body1" sx={{ fontWeight: 500, color: "#475569" }}>
              <b>Giờ:</b> {formatTime(appointment.startTime)} -{" "}
              {formatTime(
                appointment.doctorSlotID.length >= 2
                  ? appointment.doctorSlotID[1].endTime
                  : appointment.doctorSlotID[0].endTime
              )}
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" mb={2}>
            <MedicalServicesIcon sx={{ color: "#3b82f6", mr: 1.5, fontSize: 24 }} />
            <Typography variant="body1" sx={{ fontWeight: 500, color: "#475569" }}>
              <b>Dịch vụ:</b> {appointment.serviceID.name}
            </Typography>
          </Box>
          <Box display="flex" alignItems="center">
            <PaymentIcon sx={{ color: "#3b82f6", mr: 1.5, fontSize: 24 }} />
            <Typography variant="body1" sx={{ fontWeight: 600, color: "#1e293b" }}>
              <b>Giá tiền:</b> {appointment.serviceID?.price?.toLocaleString("vi-VN")} ₫
            </Typography>
          </Box>
        </CardContent>
      </Card>
      <Button
        variant="contained"
        onClick={handlePayment}
        fullWidth
        sx={{
          textTransform: "none",
          borderRadius: "8px",
          py: 1.5,
          fontSize: "1.1rem",
          fontWeight: 600,
          bgcolor: "#3b82f6",
          "&:hover": { bgcolor: "#2563eb" },
          "&.Mui-disabled": {
            bgcolor: "#d1d5db",
            color: "#6b7280",
          },
        }}
      >
        Thanh toán ngay
      </Button>
      <ToastContainer position="top-center" autoClose={2000} />
    </Box>
  );
};

export default BookingPaymentPage;