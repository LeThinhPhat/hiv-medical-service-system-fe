import React, { useState } from "react";
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
  CardContent,
  Alert,
  IconButton,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CloseIcon from "@mui/icons-material/Close";
import { LocalizationProvider, DateCalendar } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

const times = {
  Morning: ["09:45", "10:45", "11:00", "11:30", "-"],
  Afternoon: ["13:00", "-", "14:30", "15:00", "-"],
  Evening: ["17:00", "-", "-", "18:30", "19:00"],
};

const Step3 = ({ open, onClose, onNext, onBack, data }) => {
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
    console.log("Step3 sending:", stepData);
    onNext(stepData);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      sx={{ "& .MuiDialog-paper": { borderRadius: 2 } }}
    >
      <DialogTitle sx={{ m: 0, p: 2, display: "flex", alignItems: "center" }}>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Select Date & Time
        </Typography>
        <IconButton onClick={onClose} sx={{ color: "grey.500" }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ p: 3 }}>
        {/* Doctor Info */}
        <Box
          p={2}
          sx={{
            border: "1px solid #eee",
            borderRadius: 2,
            background: "#fff",
            mb: 3,
          }}
        >
          <Grid container spacing={2} alignItems="center">
            <Grid item>
              <Avatar
                src="https://randomuser.me/api/portraits/men/32.jpg"
                sx={{ width: 56, height: 56 }}
                alt="Dr. Michael Brown"
              />
            </Grid>
            <Grid item xs>
              <Typography variant="subtitle1">Dr. Michael Brown</Typography>
              <Typography variant="body2" color="primary">
                {data.specialty || "Psychologist"}
              </Typography>
              <Box display="flex" alignItems="center" mt={0.5}>
                <LocationOnIcon sx={{ fontSize: 16, mr: 0.5 }} />
                <Typography variant="caption">
                  1011 W 5th St, Suite 120, Austin, TX 78703
                </Typography>
              </Box>
            </Grid>
            <Grid item>
              <Box
                sx={{
                  backgroundColor: "#FF6B6B",
                  color: "white",
                  px: 1,
                  py: 0.5,
                  borderRadius: 1,
                  fontSize: "0.75rem",
                }}
              >
                ⭐ 5.0
              </Box>
            </Grid>
          </Grid>

          {/* Booking Info */}
          <Grid container spacing={2} mt={2}>
            <Grid item xs={12} sm={3}>
              <Typography variant="body2" fontWeight={500}>
                Specialty
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {data.specialty || "Cardiology"}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Typography variant="body2" fontWeight={500}>
                Service
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {data.service?.name || "Echocardiograms"}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Typography variant="body2" fontWeight={500}>
                Date & Time
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {selectedTime
                  ? `${selectedTime}, ${selectedDate.toLocaleDateString()}`
                  : "Not selected"}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Typography variant="body2" fontWeight={500}>
                Appointment type
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {data.appointmentType || "Clinic"}{" "}
                {data.clinic ? `(${data.clinic.name})` : ""}
              </Typography>
            </Grid>
          </Grid>
        </Box>

        {/* Date and Time Selection */}
        <Grid container spacing={3}>
          {/* Calendar */}
          <Grid item xs={12} md={4}>
            <Card elevation={3} sx={{ p: 2 }}>
              <Typography variant="subtitle1" mb={1}>
                Select Date
              </Typography>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateCalendar
                  value={selectedDate}
                  onChange={(newValue) => setSelectedDate(newValue)}
                  minDate={new Date()}
                />
              </LocalizationProvider>
            </Card>
          </Grid>

          {/* Time Slots */}
          <Grid item xs={12} md={8}>
            <Card elevation={3} sx={{ p: 2 }}>
              <Typography variant="subtitle1" mb={2}>
                Select Time
              </Typography>
              {Object.entries(times).map(([label, slots]) => (
                <Box key={label} mb={2}>
                  <Typography fontWeight={600} gutterBottom>
                    {label}
                  </Typography>
                  <Grid container spacing={1}>
                    {slots.map((time, idx) => (
                      <Grid item key={idx}>
                        <Button
                          variant={
                            selectedTime === time ? "contained" : "outlined"
                          }
                          disabled={time === "-"}
                          onClick={() => setSelectedTime(time)}
                          sx={{
                            minWidth: 80,
                            backgroundColor:
                              selectedTime === time ? "#00BFD8" : "#f0f0f0",
                            color:
                              selectedTime === time ? "#fff" : "text.primary",
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

        {/* Error Message */}
        {error && (
          <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
            {error}
          </Alert>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onBack} color="inherit">
          Back
        </Button>
        <Button
          variant="contained"
          color="info"
          onClick={handleNext}
          disabled={!selectedDate || !selectedTime}
        >
          Add Basic Information
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Step3;
