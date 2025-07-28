import React, { useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Chip,
  Paper,
  ListItemSecondaryAction,
  Button,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  Alert,
} from "@mui/material";
import PaymentIcon from "@mui/icons-material/Payment";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import CancelIcon from "@mui/icons-material/Cancel";
import AppointmentService from "../Services/CusService/AppointmentService";

export const AppointmentStatusChip = ({ status }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "Chờ thanh toán":
        return { color: "warning", bgcolor: "#fff8e1", textColor: "#ed6c02", borderColor: "#ed6c02" };
      case "Thanh toán thất bại":
        return { color: "error", bgcolor: "#ffebee", textColor: "#d32f2f", borderColor: "#d32f2f" };
      case "Đang xét duyệt":
        return { color: "default", bgcolor: "#f5f5f5", textColor: "#616161", borderColor: "#616161" };
      case "Đã đặt lịch và đã được duyệt":
        return { color: "success", bgcolor: "#e8f5e8", textColor: "#2e7d32", borderColor: "#2e7d32" };
      case "Hủy bởi người khách hàng":
      case "Hủy bởi nhân viên":
      case "Đã hủy & hoàn tiền bởi nhân viên":
        return { color: "info", bgcolor: "#e0f7fa", textColor: "#0277bd", borderColor: "#0277bd" };
      case "Hoàn tất quá trình khám":
        return { color: "success", bgcolor: "#c8e6c9", textColor: "#1b5e20", borderColor: "#1b5e20" };
      default:
        return { color: "default", bgcolor: "#f5f5f5", textColor: "#616161", borderColor: "#616161" };
    }
  };

  const displayStatus = status && status.includes("Hủy") ? "Đã hoàn tiền" : status;

  return (
    <Chip 
      label={displayStatus || "Đang xử lý"} 
      size="small"
      sx={{ 
        bgcolor: getStatusColor(status).bgcolor,
        color: getStatusColor(status).textColor,
        border: `1px solid ${getStatusColor(status).borderColor}`,
        fontWeight: "500"
      }} 
    />
  );
};

export const AppointmentsSection = ({ appointments, loadingAppointments, handlePayment, formatDate, formatTime }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [openCancelDialog, setOpenCancelDialog] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [cancelReason, setCancelReason] = useState("");
  const [toast, setToast] = useState({ open: false, message: "", severity: "success" });
  const appointmentsPerPage = 5;

  // Sort appointments by startTime (most recent first)
  const sortedAppointments = [...appointments].sort((a, b) => 
    new Date(b.startTime) - new Date(a.startTime)
  );

  // Calculate pagination
  const totalPages = Math.ceil(sortedAppointments.length / appointmentsPerPage);
  const startIndex = (currentPage - 1) * appointmentsPerPage;
  const endIndex = startIndex + appointmentsPerPage;
  const currentAppointments = sortedAppointments.slice(startIndex, endIndex);

  // Handle page change
  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  // Handle cancel dialog open
  const handleOpenCancelDialog = (appointment) => {
    setSelectedAppointment(appointment);
    setCancelReason("");
    setOpenCancelDialog(true);
  };

  // Handle cancel dialog close
  const handleCloseCancelDialog = () => {
    setOpenCancelDialog(false);
    setSelectedAppointment(null);
    setCancelReason("");
  };

  // Handle cancel appointment
  const handleCancelAppointment = async () => {
    try {
      await AppointmentService.cancelAppointmentByPatient(selectedAppointment._id, cancelReason);
      setToast({
        open: true,
        message: "Hủy cuộc hẹn và hoàn tiền thành công!",
        severity: "success",
      });
      handleCloseCancelDialog();
      // Optionally, refresh appointments list here
      window.location.reload(); // Simple way to refresh data, consider using state management instead
    } catch (error) {
      setToast({
        open: true,
        message: "Hủy cuộc hẹn thất bại. Vui lòng thử lại.",
        severity: "error",
      });
      console.error(error);
    }
  };

  // Handle toast close
  const handleCloseToast = () => {
    setToast({ ...toast, open: false });
  };

  return (
    <Paper 
      elevation={2} 
      sx={{ 
        p: 4, 
        borderRadius: 2, 
        bgcolor: "white",
        border: "1px solid #e3f2fd",
        mb: 3
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <CalendarTodayIcon sx={{ color: "#0277bd", mr: 2, fontSize: 28 }} />
        <Typography variant="h5" sx={{ color: "#0277bd", fontWeight: 600 }}>
          Lịch khám bệnh
        </Typography>
      </Box>
      
      {loadingAppointments ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress size={32} sx={{ color: "#0277bd" }} />
        </Box>
      ) : sortedAppointments.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 4, color: "text.secondary" }}>
          <CalendarTodayIcon sx={{ fontSize: 48, color: "#bdbdbd", mb: 2 }} />
          <Typography variant="h6">Chưa có lịch khám</Typography>
          <Typography variant="body2">
            Hiện tại chưa có lịch khám nào được đặt.
          </Typography>
        </Box>
      ) : (
        <>
          <List disablePadding>
            {currentAppointments.map((ap, idx) => (
              <ListItem 
                key={ap._id || idx} 
                sx={{ 
                  py: 2, 
                  px: 3,
                  mb: 2,
                  bgcolor: "#fafafa",
                  borderRadius: 1,
                  border: "1px solid #e0e0e0",
                  "&:hover": { 
                    bgcolor: "#f5f5f5"
                  },
                  position: "relative",
                  alignItems: "flex-start"
                }}
              >
                <ListItemText
                  primary={
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
                      <Typography variant="subtitle1" fontWeight="600" color="#212121">
                        {ap.serviceID?.name || "Không xác định"}
                      </Typography>
                      <AppointmentStatusChip status={ap.status} />
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                        <strong>Bác sĩ:</strong> {ap.doctorID?.userID?.name || "Chưa chỉ định"}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Thời gian:</strong> {formatDate(ap.startTime)} - {formatTime(ap.startTime)}
                      </Typography>
                    </Box>
                  }
                />
                <ListItemSecondaryAction sx={{ top: 16, transform: "none" }}>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    {ap.status === "Chờ thanh toán" ? (
                      <Button 
                        variant="contained" 
                        startIcon={<PaymentIcon />} 
                        onClick={() => handlePayment(ap)} 
                        sx={{ 
                          bgcolor: "#0277bd",
                          "&:hover": { bgcolor: "#01579b" },
                          borderRadius: 2,
                          textTransform: "none",
                          fontWeight: 500
                        }}
                      >
                        Thanh toán
                      </Button>
                    ) : ap.status === "Thanh toán thất bại" ? null : ap.status.toLowerCase().includes("hủy") ? (
                      <Chip
                        label="Đã hoàn tiền"
                        size="small"
                        sx={{
                          bgcolor: "#e0f7fa",
                          color: "#0277bd",
                          border: "1px solid #0277bd",
                          fontWeight: "500",
                          borderRadius: 2,
                        }}
                      />
                    ) : (
                      <Chip
                        label="Đã thanh toán"
                        size="small"
                        sx={{
                          bgcolor: "#e8f5e8",
                          color: "#2e7d32",
                          border: "1px solid #2e7d32",
                          fontWeight: "500",
                          borderRadius: 2,
                        }}
                      />
                    )}
                    {(ap.status === "Đang xét duyệt" || ap.status === "Đã đặt lịch và đã được duyệt") && (
                      <Button 
                        variant="outlined" 
                        startIcon={<CancelIcon />} 
                        onClick={() => handleOpenCancelDialog(ap)} 
                        sx={{ 
                          color: "#b71c1c",
                          borderColor: "#b71c1c",
                          "&:hover": { borderColor: "#b71c1c", bgcolor: "#ffcccb" },
                          borderRadius: 2,
                          textTransform: "none",
                          fontWeight: 500
                        }}
                      >
                        Hủy
                      </Button>
                    )}
                  </Box>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
          {totalPages > 1 && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
              <Pagination
                page={currentPage}
                count={totalPages}
                onChange={handlePageChange}
                color="primary"
                sx={{
                  "& .MuiPaginationItem-root": {
                    color: "#0277bd",
                    "&:hover": {
                      bgcolor: "#e3f2fd",
                    },
                    "&.Mui-selected": {
                      bgcolor: "#0277bd",
                      color: "white",
                      "&:hover": {
                        bgcolor: "#01579b",
                      },
                    },
                  },
                }}
              />
            </Box>
          )}
        </>
      )}

      <Dialog
        open={openCancelDialog}
        onClose={handleCloseCancelDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ bgcolor: "#0277bd", color: "white" }}>
          Hủy cuộc hẹn
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {selectedAppointment?.status === "Đang xét duyệt"
              ? "Khi bạn hủy, bạn chỉ sẽ được hoàn 80% số tiền. Bạn có chắc chắn muốn hủy không?"
              : selectedAppointment?.status === "Đã đặt lịch và đã được duyệt"
              ? "Bạn sẽ không được hoàn tiền. Bạn có chắc chắn muốn hủy không?"
              : "Vui lòng nhập lý do hủy cuộc hẹn:"}
          </Typography>
          <TextField
            label="Lý do hủy"
            multiline
            rows={4}
            fullWidth
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            sx={{ "& .MuiOutlinedInput-root": { "&.Mui-focused fieldset": { borderColor: "#0277bd" } } }}
          />
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleCloseCancelDialog} 
            sx={{ color: "#0277bd" }}
          >
            Hủy bỏ
          </Button>
          <Button 
            variant="contained"
            onClick={handleCancelAppointment}
            sx={{ bgcolor: "#b71c1c", "&:hover": { bgcolor: "#c62828" } }}
            disabled={!cancelReason.trim()}
          >
            Xác nhận hủy
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={toast.open}
        autoHideDuration={6000}
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseToast}
          severity={toast.severity}
          sx={{ width: "100%" }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
};