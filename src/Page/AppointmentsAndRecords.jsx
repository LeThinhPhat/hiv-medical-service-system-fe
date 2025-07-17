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
} from "@mui/material";
import PaymentIcon from "@mui/icons-material/Payment";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

export const AppointmentStatusChip = ({ status }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "Chờ thanh toán":
        return { color: "warning", bgcolor: "#fff8e1", textColor: "#ed6c02", borderColor: "#ed6c02" };
      case "Thanh toán thất bại":
        return { color: "error", bgcolor: "#ffebee", textColor: "#d32f2f", borderColor: "#d32f2f" };
      case "Đang xét duyệt":
        return { color: "default", bgcolor: "#f5f5f5", textColor: "#616161", borderColor: "#616161" };
      case "Hoàn tất đặt lịch":
        return { color: "success", bgcolor: "#e8f5e8", textColor: "#2e7d32", borderColor: "#2e7d32" };
      case "Hủy bởi người khách hàng":
        return { color: "error", bgcolor: "#ffcccb", textColor: "#b71c1c", borderColor: "#b71c1c" };
      case "Hủy bởi nhân viên":
        return { color: "error", bgcolor: "#ffcdd2", textColor: "#c62828", borderColor: "#c62828" };
      case "Đã hủy & hoàn tiền bởi nhân viên":
        return { color: "info", bgcolor: "#e0f7fa", textColor: "#0277bd", borderColor: "#0277bd" };
      case "Hoàn tất quá trình khám":
        return { color: "success", bgcolor: "#c8e6c9", textColor: "#1b5e20", borderColor: "#1b5e20" };
      default:
        return { color: "default", bgcolor: "#f5f5f5", textColor: "#616161", borderColor: "#616161" };
    }
  };

  const statusInfo = getStatusColor(status);
  return (
    <Chip 
      label={status || "Đang xử lý"} 
      size="small"
      sx={{ 
        bgcolor: statusInfo.bgcolor,
        color: statusInfo.textColor,
        border: `1px solid ${statusInfo.borderColor}`,
        fontWeight: "500"
      }} 
    />
  );
};

export const AppointmentsSection = ({ appointments, loadingAppointments, handlePayment, formatDate, formatTime }) => {
  const [currentPage, setCurrentPage] = useState(1);
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
                  ) : ap.status !== "Thanh toán thất bại" ? (
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
                  ) : null}
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
    </Paper>
  );
};