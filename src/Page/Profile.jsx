import React, { useEffect, useState } from "react";
import {
  Box,
  CardHeader,
  Avatar,
  Typography,
  Grid,
  Divider,
  Button,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Chip,
  Container,
  Paper,
  ListItemSecondaryAction,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import PaymentIcon from "@mui/icons-material/Payment";
import appointmentService from "../Services/CusService/AppointmentService";
import { useNavigate } from "react-router-dom";

function formatDate(dateStr) {
  if (!dateStr) return "Không xác định";
  const date = new Date(dateStr);
  return `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()}`;
}

function formatTime(isoString) {
  const date = new Date(isoString);
  const adjustedDate = new Date(date.getTime() - 7 * 60 * 60 * 1000);
  return adjustedDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
}

const Profile = () => {
   const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState([]);
  const [loadingAppointments, setLoadingAppointments] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const data = await appointmentService.getAppointmentByToken();
        console.log("Appointments data:", data);
        setAppointments(data?.data || []);
      } catch (error) {
        console.error("Lỗi lấy lịch hẹn:", error);
      } finally {
        setLoadingAppointments(false);
      }
    };

    // Fake loading user
    setTimeout(() => setLoading(false), 600);

    // Gọi lịch hẹn thực tế
    fetchAppointments();
  }, []);

  const handlePayment = (appointment) => {
      navigate("/booking-payment", {
          state: {
            appointment
          }
        });
  };

  const patient = JSON.parse(localStorage.getItem("patient")) || {};
  const user = JSON.parse(localStorage.getItem("user")) || {};

  if (loading) {
    return (
      <Box sx={{ p: 4, minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return (
      <Box sx={{ p: 4, minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Typography color="error">Không có dữ liệu user</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ backgroundColor: "#f5f7fa", minHeight: "100vh", py: 6 }}>
      <Container maxWidth="lg">
        <Paper
          elevation={4}
          sx={{
            p: 4,
            borderRadius: 3,
            background: "linear-gradient(145deg, #ffffff, #f9f9f9)",
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          }}
        >
          <CardHeader
            avatar={
              <Avatar
                src={user.avatar || "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=100"}
                sx={{ width: 100, height: 100, border: "2px solid #1976d2" }}
              />
            }
            title={
              <Typography variant="h4" fontWeight="bold" color="primary.main">
                {user.name || "Chưa có tên"}
              </Typography>
            }
            subheader={
              <Typography variant="subtitle1" color="text.secondary">
                {user.email}
              </Typography>
            }
            action={
              <Button
                variant="contained"
                startIcon={<EditIcon />}
                sx={{
                  borderRadius: 2,
                  px: 3,
                  py: 1,
                  bgcolor: "#1976d2",
                  "&:hover": { bgcolor: "#1565c0" },
                }}
              >
                Chỉnh sửa
              </Button>
            }
          />
          <Divider sx={{ my: 3, borderColor: "#e0e0e0" }} />
          <Grid container spacing={4}>
            {[
              { label: "Số điện thoại", value: patient.contactPhones },
              { label: "Giới tính", value: user.gender },
              { label: "Địa chỉ", value: user.address },
              { label: "CCCD", value: patient.personalID },
            ].map((item, idx) => (
              <Grid key={idx} item xs={12} sm={6} md={3}>
                <Typography variant="subtitle2" color="text.secondary" fontWeight="medium">
                  {item.label}
                </Typography>
                <Typography variant="body1" sx={{ mt: 0.5 }}>
                  {item.value || "Chưa cập nhật"}
                </Typography>
              </Grid>
            ))}
          </Grid>
        </Paper>

        {/* DANH SÁCH LỊCH KHÁM */}
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 3,
            mt: 4,
            background: "linear-gradient(145deg, #ffffff, #f9f9f9)",
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          }}
        >
          <Typography variant="h5" fontWeight="bold" mb={3} color="primary.main">
            Lịch khám đã đặt
          </Typography>
          {loadingAppointments ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
              <CircularProgress size={32} />
            </Box>
          ) : appointments.length === 0 ? (
            <Typography color="text.secondary" sx={{ fontStyle: "italic" }}>
              Chưa có lịch khám nào.
            </Typography>
          ) : (
            <List disablePadding>
              {appointments.map((ap, idx) => (
                <ListItem
                  key={ap._id || idx}
                  divider
                  sx={{
                    py: 2,
                    borderRadius: 2,
                    "&:hover": { backgroundColor: "#f0f4f8" },
                    transition: "background-color 0.3s",
                  }}
                >
                  <ListItemText
                    primary={
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Typography variant="subtitle1" fontWeight="medium">
                          {ap.serviceID.name || "Không xác định"}
                        </Typography>
                        <Chip
                          label={ap.status || "Đang xử lý"}
                          size="small"
                          color={ap.status === "Đang chờ thanh toán" ? "warning" : "primary"}
                          sx={{
                            fontWeight: "medium",
                            bgcolor: ap.status === "Đang chờ thanh toán" ? "#fff3e0" : "#e3f2fd",
                          }}
                        />
                      </Box>
                    }
                    secondary={
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                          <b>Bác sĩ:</b> {ap.doctorID.userID.name || "Chưa chỉ định"}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                          <b>Ngày khám:</b> {formatDate(ap.date)} | <b>Giờ:</b> {formatTime(ap.startTime)}
                        </Typography>
                      </Box>
                    }
                  />
                  {ap.status === "Chờ thanh toán" && (
                    <ListItemSecondaryAction>
                      <Button
                        variant="contained"
                        color="success"
                        startIcon={<PaymentIcon />}
                        onClick={() => handlePayment(ap)}
                        sx={{
                          borderRadius: 2,
                          px: 2,
                          py: 0.5,
                          fontSize: "0.875rem",
                          "&:hover": { bgcolor: "#2e7d32" },
                        }}
                      >
                        Thanh toán
                      </Button>
                    </ListItemSecondaryAction>
                  )}
                </ListItem>
              ))}
            </List>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default Profile;