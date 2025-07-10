import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import appointmentService from "../../../Services/CusService/AppointmentService";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Divider,
  CircularProgress,
  Alert,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import EventIcon from "@mui/icons-material/Event";
import PersonIcon from "@mui/icons-material/Person";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import PaymentIcon from "@mui/icons-material/Payment";

const BASE_URL = "http://localhost:3000";
const patient = JSON.parse(localStorage.getItem("patient")) || {};

const SuccessPaymentPage = () => {
  const [searchParams] = useSearchParams();
  const [order, setOrder] = useState(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const appointmentId = searchParams.get("vnp_TxnRef");

  useEffect(() => {
    const fetchOrder = async () => {
      if (!appointmentId) {
        setErr("Không tìm thấy mã lịch hẹn (orderId)!");
        setLoading(false);
        return;
      }
      try {
        const data = await appointmentService.getById(appointmentId);
        setOrder(data);
      } catch (error) {
        setErr(error.message || "Không lấy được thông tin lịch hẹn.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [appointmentId]);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          bgcolor: "#f8fafc",
        }}
      >
        <CircularProgress color="primary" size={50} />
        <Typography sx={{ ml: 2, color: "#475569", fontWeight: 500 }}>
          Đang tải thông tin lịch hẹn...
        </Typography>
      </Box>
    );
  }

  if (err) {
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
        <Alert
          severity="error"
          sx={{
            borderRadius: "8px",
            bgcolor: "#fee2e2",
            color: "#b91c1c",
            fontSize: "1rem",
            fontWeight: 500,
            p: 2,
          }}
        >
          Lỗi: {err}
        </Alert>
      </Box>
    );
  }

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
          <Box
        sx={{
          background: "#d1fae5", // xanh lá nhạt
          color: "#065f46",       // chữ xanh rêu đậm, dễ đọc
          borderRadius: "12px",
          py: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 4,
          gap: 1.5,
        }}
      >
        <CheckCircleIcon sx={{ fontSize: 32, color: "#22c55e" }} />
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          Thanh toán thành công!
        </Typography>
      </Box>

      <Card
        sx={{
          borderRadius: "16px",
          border: "2px solid #e5e7eb",
          bgcolor: "#fff",
          boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)",
          mb: 4,
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Typography
            variant="body1"
            sx={{
              fontWeight: 500,
              color: "#475569",
              mb: 3,
              textAlign: "center",
            }}
          >
            Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi.
          </Typography>

          <Divider sx={{ my: 2, bgcolor: "#e5e7eb" }} />

          <InfoRow
            icon={<EventIcon />}
            label="Mã lịch hẹn"
            value={order?._id}
            highlight
          />
          <InfoRow
            icon={<PersonIcon />}
            label="CCCD"
            value={patient.personalID}
          />
          <InfoRow
            icon={<PersonIcon />}
            label="SĐT"
            value={patient.contactPhones?.[0]}
          />
          <InfoRow
            icon={<MedicalServicesIcon />}
            label="Dịch vụ"
            value={order?.serviceID?.name}
          />
          <InfoRow
            icon={<PaymentIcon />}
            label="Giá tiền"
            value={
              order?.serviceID?.price?.toLocaleString("vi-VN") + " ₫"
            }
            bold
          />

          <Divider sx={{ my: 2, bgcolor: "#e5e7eb" }} />

          <Typography
            variant="body2"
            sx={{
              textAlign: "center",
              color: "#475569",
              fontWeight: 500,
            }}
          >
            Mã giao dịch: {searchParams.get("vnp_TransactionNo")}
          </Typography>
        </CardContent>
      </Card>

      <Button
        variant="contained"
        fullWidth
        onClick={() => navigate("/")}
        sx={{
          textTransform: "none",
          borderRadius: "8px",
          py: 1.5,
          fontSize: "1.1rem",
          fontWeight: 600,
          bgcolor: "#3b82f6",
          "&:hover": { bgcolor: "#2563eb" },
        }}
      >
        Quay về trang chủ
      </Button>
    </Box>
  );
};

const InfoRow = ({ icon, label, value, highlight = false, bold = false }) => (
  <Box display="flex" alignItems="center" mb={2}>
    <Box sx={{ color: "#3b82f6", mr: 1.5 }}>{icon}</Box>
    <Typography
      variant="body1"
      sx={{
        fontWeight: bold ? 600 : 500,
        color: highlight ? "#1e293b" : "#475569",
      }}
    >
      <b>{label}:</b> <span style={{ fontWeight: bold ? 600 : 500 }}>{value}</span>
    </Typography>
  </Box>
);

export default SuccessPaymentPage;
