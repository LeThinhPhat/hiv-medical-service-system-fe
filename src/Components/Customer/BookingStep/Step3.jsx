import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Grid,
  Avatar,
  Button,
  Card,
  Chip,
  Alert,
  IconButton,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety";
import PersonIcon from "@mui/icons-material/Person";
import doctorSlotService from "../../../Services/doctorSlotService";

const Step3 = ({ open, onClose, onNext, onBack, data }) => {
  const [loading, setLoading] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [error, setError] = useState(null);

  // Hàm lấy endTime từ startTime
  function getEndTime(startTime) {
    const hour = parseInt(startTime.split(":")[0], 10);
    const minute = startTime.split(":")[1];
    const endHour = hour + 1;
    return endHour.toString().padStart(2, "0") + ":" + minute;
  }

  useEffect(() => {
    const endTime = getEndTime(data.time);
    if (!open) return;
    const fetchDoctors = async () => {
      setLoading(true);
      setError(null);
      setDoctors([]);
      try {
        const res = await doctorSlotService.getDoctorSlots({
          date: data.date.toISOString().split("T")[0],
          startTime: data.time,
          endTime: endTime,
        });
        setDoctors(res?.filter(Boolean));
      } catch (err) {
        setError("Không thể tải danh sách bác sĩ.");
        throw err;
      }
      setLoading(false);
    };
    fetchDoctors();
  }, [open, data.date, data.time]);

  const handleNext = () => {
    if (!selectedDoctor) {
      setError("Vui lòng chọn bác sĩ.");
      return;
    }
    setError(null);
    onNext({ ...data, doctor: selectedDoctor });
    onClose();
  };

  // Lấy avatar giả nếu chưa có ảnh thật
  const getAvatar = (doctor) => {
    if (doctor.userID?.avatar || doctor.avatar) {
      return (
        <Avatar
          sx={{ width: 64, height: 64, boxShadow: 2, mr: 2 }}
          src={doctor.userID?.avatar || doctor.avatar}
        >
          {doctor.userID?.name?.[0]?.toUpperCase() || "D"}
        </Avatar>
      );
    }
    const index =
      doctor._id?.charCodeAt(doctor._id.length - 1) % 2 ||
      Math.floor(Math.random() * 2);
    const fakeImg = `https://randomuser.me/api/portraits/${
      index === 0 ? "men" : "women"
    }/${Math.abs(doctor._id?.charCodeAt(0) % 99)}.jpg`;
    return (
      <Avatar
        sx={{ width: 64, height: 64, boxShadow: 2, mr: 2 }}
        src={fakeImg}
      >
        {doctor.userID?.name?.[0]?.toUpperCase() || "D"}
      </Avatar>
    );
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: 3,
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
          backgroundColor: "#f9fafb",
        },
      }}
    >
      <DialogTitle
        sx={{
          p: 3,
          display: "flex",
          alignItems: "center",
          backgroundColor: "#e3f2fd",
          borderBottom: "1px solid #e0e0e0",
        }}
      >
        <Typography
          variant="h6"
          sx={{ flexGrow: 1, fontWeight: 600, color: "#1976d2" }}
        >
          Select Your Doctor
        </Typography>
        <IconButton onClick={onClose} sx={{ color: "#546e7a" }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ p: 4, backgroundColor: "#fff" }}>
        {loading && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: 200,
            }}
          >
            <CircularProgress color="primary" />
            <Typography variant="body2" sx={{ ml: 2, color: "#546e7a" }}>
              Loading available doctors...
            </Typography>
          </Box>
        )}
        {error && (
          <Alert
            severity="error"
            sx={{
              mt: 3,
              mb: 2,
              borderRadius: 2,
              backgroundColor: "#fef2f2",
              color: "#b91c1c",
            }}
          >
            {error}
          </Alert>
        )}
        {!loading && doctors.length === 0 && !error && (
          <Alert
            severity="warning"
            sx={{
              mt: 3,
              mb: 2,
              borderRadius: 2,
              backgroundColor: "#fefce8",
              color: "#a16207",
            }}
          >
            Không có bác sĩ nào khả dụng ở khung giờ này.
          </Alert>
        )}
        <Grid container spacing={2}>
          {doctors.map((doctor) => (
            <Grid item xs={12} sm={6} md={4} key={doctor._id}>
              <Card
                onClick={() => setSelectedDoctor(doctor)}
                sx={{
                  borderRadius: 2,
                  p: 2,
                  cursor: "pointer",
                  border:
                    selectedDoctor?._id === doctor._id
                      ? "2px solid #1976d2"
                      : "1px solid #e0e0e0",
                  backgroundColor:
                    selectedDoctor?._id === doctor._id ? "#e3f2fd" : "#fff",
                  transition: "all 0.2s",
                  "&:hover": {
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                    transform: "translateY(-2px)",
                  },
                  position: "relative",
                }}
              >
                {selectedDoctor?._id === doctor._id && (
                  <Chip
                    icon={<HealthAndSafetyIcon />}
                    label="Đang chọn"
                    color="primary"
                    size="small"
                    sx={{
                      position: "absolute",
                      top: 12,
                      right: 12,
                      zIndex: 1,
                      backgroundColor: "#1976d2",
                      color: "#fff",
                    }}
                  />
                )}
                <Box display="flex" alignItems="center" mb={2}>
                  {getAvatar(doctor)}
                  <Box>
                    <Typography
                      fontWeight={500}
                      fontSize={18}
                      sx={{ color: "#374151" }}
                    >
                      {doctor.userID?.name || "Bác sĩ"}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ color: "#546e7a" }}
                    >
                      {doctor.specializations || "Chưa cập nhật chuyên môn"}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ color: "#546e7a" }}
                    >
                      Số phòng: <b>{doctor.room || "N/A"}</b>
                    </Typography>
                  </Box>
                </Box>
                <Box display="flex" alignItems="center">
                  <PersonIcon sx={{ color: "#1976d2", mr: 1, fontSize: 20 }} />
                  <Box>
                    {doctor.userID?.email && (
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ display: "block", color: "#546e7a" }}
                      >
                        📧 {doctor.userID.email}
                      </Typography>
                    )}
                    {doctor.userID?.phone && (
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ display: "block", color: "#546e7a" }}
                      >
                        ☎️ {doctor.userID.phone}
                      </Typography>
                    )}
                  </Box>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </DialogContent>
      <DialogActions
        sx={{
          p: 3,
          borderTop: "1px solid #e0e0e0",
          backgroundColor: "#f9fafb",
        }}
      >
        <Button
          onClick={onBack}
          color="inherit"
          sx={{
            textTransform: "none",
            color: "#546e7a",
            "&:hover": { backgroundColor: "#f1f5f9" },
          }}
        >
          Back
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleNext}
          disabled={!selectedDoctor}
          sx={{
            textTransform: "none",
            borderRadius: 2,
            px: 4,
            backgroundColor: "#1976d2",
            "&:hover": { backgroundColor: "#1565c0" },
            "&.Mui-disabled": {
              backgroundColor: "#e0e0e0",
              color: "#9e9e9e",
            },
          }}
        >
          Continue to Confirmation
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Step3;