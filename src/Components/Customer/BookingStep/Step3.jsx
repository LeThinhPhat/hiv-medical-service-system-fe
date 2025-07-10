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
    setSelectedDoctor(null);
    setDoctorSlots(null);
    setSlotError(null);
    const fetchDoctors = async () => {
      setLoading(true);
      setError(null);
      setDoctors([]);
      try {
        const res = await doctorSlotService.getDoctorSlots({ startTime: Starttime });
        setDoctors(res?.filter(Boolean));
      } catch (err) {
        setError("Không thể tải danh sách bác sĩ.");
      }
      setLoading(false);
    };
    fetchDoctors();
  }, [open, data.date, data.time]);

  const handleSelectDoctor = async (doctor) => {
    setSelectedDoctor(doctor);
    setLoadingDoctorSlot(true);
    setSlotError(null);
    setDoctorSlots(null);
    try {
      const slots = await doctorSlotService.getDoctorSlotByDoctor(doctor._id, Starttime);
      setDoctorSlots(slots);
      if (!slots || slots.length === 0) {
        setSlotError("Bác sĩ này không có slot trống ở thời điểm này.");
      }
    } catch (err) {
      setSlotError("Bác sĩ này không có slot trống ở thời điểm này.");
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

  const getAvatar = (doctor) => {
    const initials = doctor.userID?.name?.[0]?.toUpperCase() || "D";
    return (
      <Avatar
        src={doctor.userID?.avatar || doctor.avatar}
        sx={{
          width: 72,
          height: 72,
          bgcolor: "#e0f2fe",
          fontSize: "1.8rem",
          fontWeight: "bold",
          boxShadow: 2,
          mr: 2,
        }}
      >
        {initials}
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
          boxShadow: "0 12px 40px rgba(0,0,0,0.15)",
          backgroundColor: "#f9fafb",
        },
      }}
    >
      <DialogTitle
        sx={{
          p: 3,
          display: "flex",
          alignItems: "center",
          background: "linear-gradient(to right, #3b82f6, #60a5fa)",
          color: "#fff",
        }}
      >
        <Typography variant="h5" sx={{ flexGrow: 1, fontWeight: 700 }}>
          Chọn bác sĩ khám
        </Typography>
        <IconButton onClick={onClose} sx={{ color: "#fff" }}>
          <CloseIcon sx={{ fontSize: 28 }} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 4, backgroundColor: "#fff" }}>
        {loading && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: 200,
              flexDirection: "column",
              gap: 2,
            }}
          >
            <CircularProgress color="primary" size={50} />
            <Typography variant="body1" sx={{ color: "#475569", fontWeight: 500 }}>
              Đang tải danh sách bác sĩ...
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
              bgcolor: "#fee2e2",
              color: "#b91c1c",
              fontSize: "1rem",
              fontWeight: 500,
              p: 2,
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
              bgcolor: "#fefce8",
              color: "#a16207",
              fontSize: "1rem",
              fontWeight: 500,
              p: 2,
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
                  p: 3,
                  borderRadius: 3,
                  transition: "all 0.3s ease",
                  border: selectedDoctor?._id === doctor._id ? "2px solid #2563eb" : "1px solid #e2e8f0",
                  bgcolor: selectedDoctor?._id === doctor._id ? "#eff6ff" : "#ffffff",
                  cursor: "pointer",
                  "&:hover": {
                    boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
                    transform: "translateY(-4px)",
                  },
                  position: "relative",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                {selectedDoctor?._id === doctor._id && (
                  <Chip
                    icon={<HealthAndSafetyIcon sx={{ color: "#fff !important", fontSize: 20 }} />}
                    label="Đã chọn"
                    sx={{
                      position: "absolute",
                      top: 16,
                      right: 16,
                      bgcolor: "#3b82f6",
                      color: "#fff",
                      fontWeight: 600,
                      fontSize: "0.9rem",
                      px: 1,
                    }}
                  />
                )}
                <Box display="flex" alignItems="center" mb={2}>
                  {getAvatar(doctor)}
                  <Box>
                    <Typography variant="h6" fontWeight={700} color="primary.dark">
                      {doctor.userID?.name || "Bác sĩ"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {doctor.specializations || "Chuyên môn chưa cập nhật"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" mt={0.5}>
                      Số phòng: <strong>{doctor.room || "N/A"}</strong>
                    </Typography>
                  </Box>
                </Box>

                <Box mt={1}>
                  {doctor.userID?.email && (
                    <Typography variant="body2" color="text.secondary" mb={0.5}>
                      📧 {doctor.userID.email}
                    </Typography>
                  )}
                  {doctor.userID?.phone && (
                    <Typography variant="body2" color="text.secondary">
                      ☎️ {doctor.userID.phone}
                    </Typography>
                  )}
                </Box>

                {selectedDoctor?._id === doctor._id && (
                  <Box mt={2}>
                    {loadingDoctorSlot ? (
                      <Typography color="primary" fontWeight={500}>
                        Đang kiểm tra slot trống...
                      </Typography>
                    ) : slotError ? (
                      <Typography color="error" fontWeight={500}>
                        {slotError}
                      </Typography>
                    ) : doctorSlots?.length > 0 ? (
                      <Typography color="success.main" fontWeight={500}>
                        {doctorSlots.length} slot khả dụng
                      </Typography>
                    ) : null}
                  </Box>
                )}
              </Card>
            </Grid>
          ))}
        </Grid>
      </DialogContent>

      <DialogActions
        sx={{
          p: 3,
          borderTop: "1px solid #e5e7eb",
          bgcolor: "#f8fafc",
          justifyContent: "space-between",
        }}
      >
        <Button
          onClick={onBack}
          sx={{
            textTransform: "none",
            color: "#475569",
            fontSize: "1rem",
            fontWeight: 600,
            px: 4,
            py: 1,
            borderRadius: "8px",
            "&:hover": { bgcolor: "#e5e7eb" },
          }}
        >
          Quay lại
        </Button>
        <Button
          variant="contained"
          onClick={handleNext}
          disabled={!selectedDoctor || loadingDoctorSlot || (doctorSlots && doctorSlots.length === 0)}
          sx={{
            px: 5,
            py: 1.5,
            borderRadius: 2,
            fontWeight: 600,
            fontSize: "1rem",
            textTransform: "none",
            bgcolor: "#3b82f6",
            "&:hover": { bgcolor: "#1d4ed8" },
            "&.Mui-disabled": {
              bgcolor: "#d1d5db",
              color: "#6b7280",
            },
          }}
        >
          Tiếp tục
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Step3;
