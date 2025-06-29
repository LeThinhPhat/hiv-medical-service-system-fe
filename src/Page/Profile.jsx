import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Grid,
  Divider,
  Button,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Chip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

// Data user fake
const FAKE_USER = {
  name: "Nguyễn Văn A",
  email: "nguyenvana@gmail.com",
  phone: "0987654321",
  gender: "Nam",
  address: "123 Đường ABC, Quận 1, TP.HCM",
  avatar: ""
};

// Data lịch khám fake
const FAKE_APPOINTMENTS = [
  {
    _id: "1",
    serviceName: "Khám tổng quát",
    status: "Đã xác nhận",
    doctorName: "BS. Nguyễn Văn A",
    date: "2025-07-01T00:00:00.000Z",
    time: "2025-07-01T08:30:00.000Z"
  },
  {
    _id: "2",
    serviceName: "Tư vấn HIV",
    status: "Đang chờ",
    doctorName: "BS. Trần Thị B",
    date: "2025-07-03T00:00:00.000Z",
    time: "2025-07-03T10:00:00.000Z"
  },
  {
    _id: "3",
    serviceName: "Lấy mẫu máu",
    status: "Đã hủy",
    doctorName: "BS. Nguyễn Văn C",
    date: "2025-07-05T00:00:00.000Z",
    time: "2025-07-05T15:00:00.000Z"
  }
];

function formatDate(dateStr) {
  if (!dateStr) return "Không xác định";
  const date = new Date(dateStr);
  const d = String(date.getDate()).padStart(2, "0");
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const y = date.getFullYear();
  return `${d}/${m}/${y}`;
}
function formatTime(timeStr) {
  if (!timeStr) return "--:--";
  const date = new Date(timeStr);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Lịch khám
  const [appointments, setAppointments] = useState([]);
  const [loadingAppointments, setLoadingAppointments] = useState(true);

  useEffect(() => {
    // Fake loading user 0.6s
    setTimeout(() => {
      setUser(FAKE_USER);
      setLoading(false);
    }, 600);

    // Fake loading lịch khám 0.8s
    setTimeout(() => {
      setAppointments(FAKE_APPOINTMENTS);
      setLoadingAppointments(false);
    }, 800);
  }, []);

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
    <Box sx={{ p: 4, backgroundColor: "#f4f6f8", minHeight: "100vh" }}>
      <Card sx={{ maxWidth: 700, margin: "auto", boxShadow: 3, borderRadius: 4 }}>
        <CardContent>
          <Box display="flex" alignItems="center" gap={3}>
            <Avatar
              src={
                user.avatar ||
                "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=100"
              }
              alt={user.name || ""}
              sx={{ width: 100, height: 100 }}
            />
            <Box>
              <Typography variant="h5" fontWeight="bold">
                {user.name}
              </Typography>
            </Box>
          </Box>
          <Divider sx={{ my: 3 }} />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Email
              </Typography>
              <Typography>{user.email || "Chưa cập nhật"}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Số điện thoại
              </Typography>
              <Typography>{user.phone || "Chưa cập nhật"}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Giới tính
              </Typography>
              <Typography>{user.gender || "Chưa cập nhật"}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Địa chỉ
              </Typography>
              <Typography>{user.address || "Chưa cập nhật"}</Typography>
            </Grid>
          </Grid>

          <Box textAlign="right" mt={4}>
            <Button variant="contained" startIcon={<EditIcon />} sx={{ borderRadius: 2 }}>
              Chỉnh sửa hồ sơ
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* DANH SÁCH LỊCH KHÁM */}
      <Card sx={{ maxWidth: 700, margin: "32px auto 0 auto", boxShadow: 1, borderRadius: 3 }}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" mb={2}>
            Lịch khám đã đặt
          </Typography>
          {loadingAppointments ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
              <CircularProgress size={28} />
            </Box>
          ) : appointments.length === 0 ? (
            <Typography>Chưa có lịch khám nào.</Typography>
          ) : (
            <List>
              {appointments.map((ap, idx) => (
                <ListItem key={ap._id || idx} divider>
                  <ListItemText
                    primary={
                      <span>
                        <b>Dịch vụ:</b> {ap.serviceName || "Không xác định"}{" "}
                        <Chip label={ap.status || "Đang xử lý"} size="small" sx={{ ml: 1 }} />
                      </span>
                    }
                    secondary={
                      <>
                        <div><b>Bác sĩ:</b> {ap.doctorName || "Chưa chỉ định"}</div>
                        <div>
                          <b>Ngày khám:</b> {formatDate(ap.date)}
                          {" | "}
                          <b>Giờ:</b> {formatTime(ap.time)}
                        </div>
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default Profile;
