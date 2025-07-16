import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Grid,
  Button,
  Card,
  Alert,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import { LocalizationProvider, DateCalendar } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import doctorSlotService from "../../../Services/doctorSlotService";

// Định dạng giờ từ chuỗi ISO mà không điều chỉnh múi giờ
function formatTime(iso) {
  const dateObj = new Date(iso);
  const hour = dateObj.getUTCHours().toString().padStart(2, "0");
  const minute = dateObj.getUTCMinutes().toString().padStart(2, "0");
  return `${hour}:${minute}`;
}

// Chia slot thành ca sáng/chiều, và ẩn những slot đã qua nếu là hôm nay
function splitSlotsByPeriod(slots, selectedDate) {
  const morning = [];
  const afternoon = [];
  const now = new Date();

  const isToday = selectedDate.toDateString() === now.toDateString();

  slots.forEach((iso) => {
    const dateObj = new Date(iso);

    // Nếu là hôm nay và slot < thời gian hiện tại thì bỏ qua
    if (isToday && dateObj <= now) return;

    const hour = dateObj.getUTCHours();
    const time = formatTime(iso);
    if (hour >= 7 && hour <= 11) morning.push(time);
    else if (hour >= 13 && hour <= 17) afternoon.push(time);
  });

  return { Sáng: morning, Chiều: afternoon };
}

const Step2 = ({ open, onClose, onNext, onBack, data }) => {
  const [selectedDate, setSelectedDate] = useState(data.date || new Date());
  const [selectedTime, setSelectedTime] = useState(data.time || null);
  const [slots, setSlots] = useState({ Sáng: [], Chiều: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!selectedDate || !data.service._id) return;

    const fetchSlots = async () => {
      setLoading(true);
      setError(null);
      try {
        const dateStr = selectedDate.toISOString().slice(0, 10);
        const apiSlots = await doctorSlotService.getAvailableSlotsByDate(
          data.service._id,
          dateStr
        );
        setSlots(splitSlotsByPeriod(apiSlots.data || [], selectedDate));
      } catch (err) {
        setError("Không thể tải khung giờ. Vui lòng thử lại.",err);
        setSlots({ Sáng: [], Chiều: [] });
      } finally {
        setLoading(false);
      }
    };

    fetchSlots();
  }, [selectedDate, data.service._id]);

  const handleNext = () => {
    if (!selectedDate || !selectedTime) {
      setError("Vui lòng chọn ngày và giờ.");
      return;
    }
    setError(null);
    onNext({
      date: selectedDate,
      time: selectedTime,
    });
    onClose();
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
          Khung Thời Gian Khám
        </Typography>
        <IconButton onClick={onClose} sx={{ color: "#546e7a" }}>
          <CloseIcon sx={{ fontSize: 32 }} />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 5, backgroundColor: "#fff" }}>
        <Grid container spacing={4}>
          {/* Calendar */}
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                p: 3,
                borderRadius: 3,
                border: "1px solid #e0e0e0",
                minHeight: 400,
              }}
            >
              <Typography
                variant="h6"
                mb={3}
                sx={{ fontWeight: 500, color: "#374151" }}
              >
                Chọn ngày
              </Typography>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateCalendar
                  value={selectedDate}
                  onChange={(newValue) => {
                    setSelectedDate(newValue);
                    setSelectedTime(null); // reset khi đổi ngày
                  }}
                  minDate={new Date()}
                  sx={{
                    "& .MuiPickersDay-root": { fontSize: "1.1rem" },
                    "& .MuiPickersDay-root.Mui-selected": {
                      backgroundColor: "#1976d2",
                      color: "#fff",
                    },
                    "& .MuiPickersDay-root:hover": { backgroundColor: "#e3f2fd" },
                    "& .MuiPickersCalendarHeader-label": { fontSize: "1.2rem" },
                  }}
                />
              </LocalizationProvider>
            </Card>
          </Grid>

          {/* Time Slots */}
          <Grid item xs={12} md={8}>
            <Card
              sx={{
                p: 3,
                borderRadius: 3,
                border: "1px solid #e0e0e0",
                minHeight: 400,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <EventAvailableIcon
                  sx={{ color: "#1976d2", mr: 2, fontSize: 36 }}
                />
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 500, color: "#374151" }}
                >
                  Vui lòng chọn thời gian khám
                </Typography>
              </Box>
              {loading ? (
                <Typography>Đang tải khung giờ...</Typography>
              ) : (
                Object.entries(slots).map(([label, slotList]) => (
                  <Box key={label} mb={3}>
                    <Typography
                      variant="h6"
                      fontWeight={600}
                      gutterBottom
                      sx={{ color: "#374151" }}
                    >
                      {label}
                    </Typography>
                    <Grid container spacing={2}>
                      {slotList.length === 0 ? (
                        <Typography sx={{ ml: 2 }}>Không có khung giờ</Typography>
                      ) : (
                        slotList.map((time) => (
                          <Grid item key={time}>
                            <Button
                              variant={selectedTime === time ? "contained" : "outlined"}
                              onClick={() => setSelectedTime(time)}
                              sx={{
                                minWidth: 100,
                                minHeight: 48,
                                borderRadius: 2,
                                borderColor: "#e0e0e0",
                                backgroundColor:
                                  selectedTime === time ? "#1976d2" : "#fff",
                                color: selectedTime === time ? "#fff" : "#374151",
                                fontSize: "1.1rem",
                                "&:hover": {
                                  backgroundColor:
                                    selectedTime === time ? "#1565c0" : "#f1f5f9",
                                  borderColor: "#1976d2",
                                },
                                transition: "all 0.2s",
                              }}
                            >
                              {time}
                            </Button>
                          </Grid>
                        ))
                      )}
                    </Grid>
                  </Box>
                ))
              )}
            </Card>
          </Grid>
        </Grid>
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
          Trở lại
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleNext}
          disabled={!selectedDate || !selectedTime}
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
          Tiếp tục để chọn bác sĩ
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Step2;
