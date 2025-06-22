import React, { useState } from "react";
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
  CardContent,
  Alert,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import { LocalizationProvider, DateCalendar } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

// Tạo time slots cách nhau 1 tiếng từ 07:00 đến 22:00
const generateSlots = () => {
  const slots = {
    Morning: [],
    Afternoon: [],
    Evening: []
  };
  for (let h = 7; h <= 22; h++) {
    const time = h.toString().padStart(2, "0") + ":00";
    if (h < 12) slots.Morning.push(time);
    else if (h < 17) slots.Afternoon.push(time);
    else slots.Evening.push(time);
  }
  return slots;
};
const times = generateSlots();

const Step2 = ({ open, onClose, onNext, onBack, data }) => {
  const [selectedDate, setSelectedDate] = useState(data.date || new Date());
  const [selectedTime, setSelectedTime] = useState(data.time || null);
  const [error, setError] = useState(null);

  const handleNext = () => {
    if (!selectedDate || !selectedTime) {
      setError("Please select both a date and a time.");
      return;
    }
    setError(null);
    const stepData = {
      date: selectedDate,
      time: selectedTime,
    };
    onNext(stepData);
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
          Khung Thời Gian Khám
        </Typography>
        <IconButton onClick={onClose} sx={{ color: "#546e7a" }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ p: 4, backgroundColor: "#fff" }}>
        <Grid container spacing={3}>
          {/* Calendar */}
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                p: 2,
                borderRadius: 2,
                border: "1px solid #e0e0e0",
                transition: "all 0.2s",
                "&:hover": {
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                },
              }}
            >
              <Typography
                variant="subtitle1"
                mb={2}
                sx={{ fontWeight: 500, color: "#374151" }}
              >
                Chọn ngày
              </Typography>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateCalendar
                  value={selectedDate}
                  onChange={(newValue) => setSelectedDate(newValue)}
                  minDate={new Date()}
                  sx={{
                    "& .MuiPickersDay-root.Mui-selected": {
                      backgroundColor: "#1976d2",
                      color: "#fff",
                    },
                    "& .MuiPickersDay-root:hover": {
                      backgroundColor: "#e3f2fd",
                    },
                  }}
                />
              </LocalizationProvider>
            </Card>
          </Grid>

          {/* Time Slots */}
          <Grid item xs={12} md={8}>
            <Card
              sx={{
                p: 2,
                borderRadius: 2,
                border: "1px solid #e0e0e0",
                transition: "all 0.2s",
                "&:hover": {
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <EventAvailableIcon
                  sx={{ color: "#1976d2", mr: 1, fontSize: 28 }}
                />
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 500, color: "#374151" }}
                >
                  Vui lòng chọn thời gian khám
                </Typography>
              </Box>
              {Object.entries(times).map(([label, slots]) => (
                <Box key={label} mb={2}>
                  <Typography
                    fontWeight={600}
                    gutterBottom
                    sx={{ color: "#374151" }}
                  >
                    {label}
                  </Typography>
                  <Grid container spacing={1}>
                    {slots.map((time) => (
                      <Grid item key={time}>
                        <Button
                          variant={
                            selectedTime === time ? "contained" : "outlined"
                          }
                          onClick={() => setSelectedTime(time)}
                          sx={{
                            minWidth: 80,
                            borderRadius: 1,
                            borderColor: "#e0e0e0",
                            backgroundColor:
                              selectedTime === time ? "#1976d2" : "#fff",
                            color:
                              selectedTime === time ? "#fff" : "#374151",
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
                    ))}
                  </Grid>
                </Box>
              ))}
            </Card>
          </Grid>
        </Grid>

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
          Trở lại
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleNext}
          disabled={!selectedDate || !selectedTime}
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
          Tiếp tục để chọn bác sĩ 
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Step2;