import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Container, Typography, Button, Box } from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import paymentService from "../../Services/CusService/PaymentService";
import { toast } from "react-toastify";

const PaymentCancelled = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Parse query params để lấy vnp_TxnRef
  const searchParams = new URLSearchParams(location.search);
  const appointmentID = searchParams.get("vnp_TxnRef");

  const handleRetryPayment = async () => {
    try {
      // Giả định mặc định thanh toán lại bằng chuyển khoản
      const paymentMethod = "bank";

      const { paymentUrl } = await paymentService.createPayment({
        appointmentID,
        method: paymentMethod,
      });

      // Điều hướng sang cổng thanh toán
      window.location.href = paymentUrl;
    } catch (err) {
      toast.error(`Tạo thanh toán thất bại vì ${err.message}`);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ textAlign: "center", mt: 8 }}>
      <CancelIcon color="error" sx={{ fontSize: 80, mb: 2 }} />
      <Typography variant="h4" gutterBottom color="error">
        Thanh toán đã bị hủy
      </Typography>
      <Typography variant="body1" color="textSecondary" sx={{ mb: 4 }}>
        Giao dịch chưa được thực hiện. Vui lòng thử lại hoặc liên hệ hỗ trợ nếu cần.
      </Typography>
      <Box display="flex" justifyContent="center" gap={2}>
        <Button variant="contained" color="primary" onClick={() => navigate("/")}>
          Về trang chủ
        </Button>
        <Button variant="outlined" color="primary" onClick={handleRetryPayment}>
          Thử lại thanh toán
        </Button>
      </Box>
    </Container>
  );
};

export default PaymentCancelled;
