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
  ToggleButtonGroup,
  ToggleButton,
  Stack,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import {
  Event as EventIcon,
  Person as PersonIcon,
  MedicalServices as MedicalServicesIcon,
  Payment as PaymentIcon,
} from "@mui/icons-material";
import React, { useState } from "react";

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
  const [paymentMethod, setPaymentMethod] = useState("bank");
  const [openAddFundsDialog, setOpenAddFundsDialog] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState("");

  const patient = JSON.parse(localStorage.getItem("patient")) || {};
  const walletBalance = patient?.wallet || 0;
  const servicePrice = appointment.serviceID?.price || 0;

  const handlePayment = async () => {
    try {
      if (paymentMethod === "wallet") {
        if (walletBalance < servicePrice) {
          toast.info(
            `Số dư ví không đủ (${walletBalance.toLocaleString("vi-VN")} VNĐ) để thanh toán dịch vụ giá ${servicePrice.toLocaleString("vi-VN")} VNĐ.`
          );
          setOpenAddFundsDialog(true);
          return;
        }

        await paymentService.payWithWallet({
          appointmentID: appointment._id,
        });
        toast.success("Thanh toán bằng ví thành công!");
      } else {
        const { paymentUrl } = await paymentService.createPayment({
          appointmentID: appointment._id,
          method: paymentMethod,
        });
        window.location.href = paymentUrl;
      }
    } catch (err) {
      toast.error(`Tạo thanh toán thất bại vì ${err.message}`);
    }
  };

  const handleTopUp = async () => {
    const amount = parseFloat(topUpAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Vui lòng nhập số tiền hợp lệ.");
      return;
    }

    try {
      const data = await paymentService.fundWallet({ amount });
      toast.success("Đang chuyển đến cổng nạp tiền...");
      window.location.href = data; // Redirect đến cổng nạp tiền
    } catch (error) {
      toast.error(error.message || "Nạp tiền thất bại.");
    }
    setOpenAddFundsDialog(false);
  };

  const InfoRow = ({ icon: Icon, label, value, bold }) => (
    <Box display="flex" alignItems="center" gap={1.5} mb={1.5}>
      <Icon sx={{ color: "#2563eb", fontSize: 22 }} />
      <Typography
        variant="body1"
        sx={{
          color: "#475569",
          fontWeight: bold ? 600 : 500,
        }}
      >
        <b>{label}</b> {value}
      </Typography>
    </Box>
  );

  return (
    <Box sx={{ maxWidth: 700, mx: "auto", mt: 6, mb: 6, p: 3, bgcolor: "#f9fafb" }}>
      <Paper
        elevation={4}
        sx={{
          px: 4,
          py: 3,
          borderRadius: 3,
          background: "linear-gradient(to right, #3b82f6, #60a5fa)",
          color: "#fff",
          textAlign: "center",
          mb: 4,
        }}
      >
        <Typography variant="h5" fontWeight={700}>
          Thanh Toán Lịch Hẹn
        </Typography>
      </Paper>

      <Card sx={{ borderRadius: 3, bgcolor: "#ffffff", boxShadow: "0 2px 12px rgba(0,0,0,0.1)", mb: 4 }}>
        <CardContent sx={{ p: 4 }}>
          <Stack spacing={1.5}>
            <InfoRow
              icon={EventIcon}
              label="Mã lịch hẹn:"
              value={<span style={{ color: "#3b82f6" }}>{appointment._id}</span>}
              bold
            />
            <Divider />
            <InfoRow icon={PersonIcon} label="Bệnh nhân:" value={appointment.patientID?.userID?.name || appointment.patientID?.name} />
            <InfoRow icon={PersonIcon} label="CCCD:" value={appointment.patientID.personalID} />
            <InfoRow icon={PersonIcon} label="SĐT:" value={info?.phone || "Không có"} />
            <InfoRow icon={MedicalServicesIcon} label="Bác sĩ:" value={appointment.doctorSlotID[0].doctorID?.userID?.name} />
            <InfoRow icon={EventIcon} label="Ngày:" value={formatDate(appointment.date)} />
            <InfoRow
              icon={EventIcon}
              label="Giờ:"
              value={`${formatTime(appointment.startTime)} - ${
                formatTime(
                  appointment.doctorSlotID.length >= 2
                    ? appointment.doctorSlotID[1].endTime
                    : appointment.doctorSlotID[0].endTime
                )
              }`}
            />
            <InfoRow icon={MedicalServicesIcon} label="Dịch vụ:" value={appointment.serviceID.name} />
            <InfoRow
              icon={PaymentIcon}
              label="Giá tiền:"
              value={`${servicePrice.toLocaleString("vi-VN")} ₫`}
              bold
            />
           
          </Stack>
        </CardContent>
      </Card>

      <Box sx={{ mb: 4, textAlign: "center" }}>
        <Typography variant="h6" fontWeight={600} mb={2} color="#1e293b">
          Chọn phương thức thanh toán
        </Typography>
        <ToggleButtonGroup
          value={paymentMethod}
          exclusive
          onChange={(e, value) => {
            if (value !== null) setPaymentMethod(value);
          }}
          aria-label="Phương thức thanh toán"
        >
          <ToggleButton value="bank" sx={{ px: 4, py: 1.5, fontWeight: 600 }}>
            Chuyển khoản
          </ToggleButton>
          <ToggleButton value="wallet" sx={{ px: 4, py: 1.5, fontWeight: 600 }}>
            Ví Tài Khoản
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <Button
        variant="contained"
        onClick={handlePayment}
        fullWidth
        sx={{
          textTransform: "none",
          borderRadius: "12px",
          py: 1.5,
          fontSize: "1.1rem",
          fontWeight: 600,
          bgcolor: "#3b82f6",
          "&:hover": { bgcolor: "#2563eb" },
        }}
      >
        Thanh toán ngay
      </Button>

      {/* Dialog Nạp Tiền */}
      <Dialog open={openAddFundsDialog} onClose={() => setOpenAddFundsDialog(false)}>
        <DialogTitle sx={{ bgcolor: "#3b82f6", color: "white" }}>Nạp tiền vào ví</DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Typography>Nhập số tiền bạn muốn nạp (VNĐ):</Typography>
          <TextField
            type="number"
            fullWidth
            value={topUpAmount}
            onChange={(e) => setTopUpAmount(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddFundsDialog(false)}>Hủy</Button>
          <Button variant="contained" onClick={handleTopUp}>
            Nạp tiền
          </Button>
        </DialogActions>
      </Dialog>

      <ToastContainer position="top-center" autoClose={2000} />
    </Box>
  );
};

export default BookingPaymentPage;
