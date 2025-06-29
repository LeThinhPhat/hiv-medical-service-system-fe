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

  // State mới cho API slot riêng từng bác sĩ
  const [doctorSlots, setDoctorSlots] = useState(null);
  const [loadingDoctorSlot, setLoadingDoctorSlot] = useState(false);
  const [slotError, setSlotError] = useState(null);

  function combineDateAndTime(dateObj, timeStr) {
    const [hours, minutes] = timeStr.split(":").map(Number);
    const d = new Date(dateObj);
    d.setHours(hours, minutes, 0, 0);
    return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString();
  }

  const Starttime = combineDateAndTime(data.date, data.time);

  useEffect(() => {
    if (!open) return;
    setSelectedDoctor(null); // reset khi mở lại dialog
    setDoctorSlots(null);
    setSlotError(null);
    const fetchDoctors = async () => {
      setLoading(true);
      setError(null);
      setDoctors([]);
      try {
        // Giả định hàm này lấy về danh sách bác sĩ rảnh (hoặc tất cả bác sĩ, tùy logic cũ)
        const res = await doctorSlotService.getDoctorSlots({
          startTime: Starttime,
        });
        setDoctors(res?.filter(Boolean));
      } catch (err) {
        setError("Không thể tải danh sách bác sĩ.",err);
      }
      setLoading(false);
    };
    fetchDoctors();
    // eslint-disable-next-line
  }, [open, data.date, data.time]);

  // Khi chọn bác sĩ, kiểm tra slot ở thời điểm này
  const handleSelectDoctor = async (doctor) => {
    setSelectedDoctor(doctor);
    setLoadingDoctorSlot(true);
    setSlotError(null);
    setDoctorSlots(null);
    try {
      const slots = await doctorSlotService.getDoctorSlotByDoctor(
        doctor._id,
        Starttime
      );
      setDoctorSlots(slots);
      if (!slots || slots.length === 0) {
        setSlotError("Bác sĩ này không có slot trống ở thời điểm này.");
      }
    } catch (err) {
      setSlotError("Bác sĩ này không có slot trống ở thời điểm này.",err);
    }
    setLoadingDoctorSlot(false);
  };

  const handleNext = () => {
    if (!selectedDoctor || (doctorSlots && doctorSlots.length === 0)) {
      setError("Vui lòng chọn bác sĩ có slot trống.");
      return;
    }
    setError(null);
    onNext({ ...data, slot: doctorSlots, doctor: selectedDoctor });
    onClose();
  };

  // Lấy avatar giả nếu chưa có ảnh thật
  const getAvatar = (doctor) => {
    if (doctor.userID?.avatar || doctor.avatar) {
      return (
        <Avatar
          sx={{ width: 80, height: 80, boxShadow: 2, mr: 3 }}
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
        sx={{ width: 80, height: 80, boxShadow: 2, mr: 3 }}
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
      maxWidth="lg"
      fullWidth
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: 4,
          boxShadow: "0 6px 24px rgba(0, 0, 0, 0.15)",
          backgroundColor: "#f9fafb",
          width: "90%",
          maxHeight: "90vh",
        },
      }}
    >
      <DialogTitle
        sx={{
          p: 4,
          display: "flex",
          alignItems: "center",
          backgroundColor: "#e3f2fd",
          borderBottom: "1px solid #e0e0e0",
        }}
      >
        <Typography
          variant="h5"
          sx={{ flexGrow: 1, fontWeight: 600, color: "#1976d2" }}
        >
          Vui lòng chọn bác sĩ khám
        </Typography>
        <IconButton onClick={onClose} sx={{ color: "#546e7a" }}>
          <CloseIcon sx={{ fontSize: 32 }} />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ p: 5, backgroundColor: "#fff" }}>
        {loading && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: 300,
            }}
          >
            <CircularProgress color="primary" size={60} />
            <Typography variant="body1" sx={{ ml: 3, color: "#546e7a" }}>
              Loading available doctors...
            </Typography>
          </Box>
        )}
        {error && (
          <Alert
            severity="error"
            sx={{
              mt: 4,
              mb: 3,
              borderRadius: 3,
              backgroundColor: "#fef2f2",
              color: "#b91c1c",
              fontSize: "1.1rem",
            }}
          >
            {error}
          </Alert>
        )}
        {!loading && doctors.length === 0 && !error && (
          <Alert
            severity="warning"
            sx={{
              mt: 4,
              mb: 3,
              borderRadius: 3,
              backgroundColor: "#fefce8",
              color: "#a16207",
              fontSize: "1.1rem",
            }}
          >
            Không có bác sĩ nào khả dụng ở khung giờ này.
          </Alert>
        )}
        <Grid container spacing={3}>
          {doctors.map((doctor) => (
            <Grid item xs={12} sm={6} md={4} key={doctor._id}>
              <Card
                onClick={() => handleSelectDoctor(doctor)}
                sx={{
                  borderRadius: 3,
                  p: 3,
                  cursor: "pointer",
                  border:
                    selectedDoctor?._id === doctor._id
                      ? "3px solid #1976d2"
                      : "1px solid #e0e0e0",
                  backgroundColor:
                    selectedDoctor?._id === doctor._id ? "#e3f2fd" : "#fff",
                  transition: "all 0.2s",
                  "&:hover": {
                    boxShadow: "0 6px 16px rgba(0, 0, 0, 0.15)",
                    transform: "translateY(-3px)",
                  },
                  position: "relative",
                  minHeight: 200,
                }}
              >
                {selectedDoctor?._id === doctor._id && (
                  <Chip
                    icon={<HealthAndSafetyIcon sx={{ fontSize: 24 }} />}
                    label="Đang chọn"
                    color="primary"
                    size="medium"
                    sx={{
                      position: "absolute",
                      top: 16,
                      right: 16,
                      zIndex: 1,
                      backgroundColor: "#1976d2",
                      color: "#fff",
                      fontSize: "1rem",
                    }}
                  />
                )}
                <Box display="flex" alignItems="center" mb={3}>
                  {getAvatar(doctor)}
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 500, color: "#374151" }}
                    >
                      {doctor.userID?.name || "Bác sĩ"}
                    </Typography>
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      sx={{ color: "#546e7a" }}
                    >
                      {doctor.specializations || "Chưa cập nhật chuyên môn"}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ color: "#546e7a" }}
                    >
                      Số phòng: <b>{doctor.room || "N/A"}</b>
                    </Typography>
                  </Box>
                </Box>
                <Box display="flex" alignItems="center">
                  <PersonIcon sx={{ color: "#1976d2", mr: 1, fontSize: 24 }} />
                  <Box>
                    {doctor.userID?.email && (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ display: "block", color: "#546e7a" }}
                      >
                        📧 {doctor.userID.email}
                      </Typography>
                    )}
                    {doctor.userID?.phone && (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ display: "block", color: "#546e7a" }}
                      >
                        ☎️ {doctor.userID.phone}
                      </Typography>
                    )}
                  </Box>
                </Box>
                {/* Thêm phần thông báo slot */}
                {selectedDoctor?._id === doctor._id && (
                  <Box mt={2}>
                    {loadingDoctorSlot && (
                      <Typography color="primary">
                        Đang kiểm tra slot trống...
                      </Typography>
                    )}
                    {slotError && (
                      <Typography color="error">{slotError}</Typography>
                    )}
                    {doctorSlots && doctorSlots.length > 0 && (
                      <Typography color="success.main">
                        Bác sĩ này còn {doctorSlots.length} slot khả dụng.
                      </Typography>
                    )}
                  </Box>
                )}
              </Card>
            </Grid>
          ))}
        </Grid>
      </DialogContent>
      <DialogActions
        sx={{
          p: 4,
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
            fontSize: "1.1rem",
            px: 4,
            "&:hover": { backgroundColor: "#f1f5f9" },
          }}
        >
          Back
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleNext}
          disabled={
            !selectedDoctor ||
            loadingDoctorSlot ||
            (doctorSlots && doctorSlots.length === 0)
          }
          sx={{
            textTransform: "none",
            borderRadius: 3,
            px: 6,
            fontSize: "1.1rem",
            backgroundColor: "#1976d2",
            "&:hover": { backgroundColor: "#1565c0" },
            "&.Mui-disabled": {
              backgroundColor: "#e0e0e0",
              color: "#9e9e9e",
            },
          }}
        >
          Tiếp tục đến xác nhận
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Step3;
