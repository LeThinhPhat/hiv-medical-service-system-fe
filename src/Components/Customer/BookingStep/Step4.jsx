import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Grid,
  Typography,
  TextField,
  MenuItem,
  Button,
  Avatar,
  Alert,
  IconButton,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CloseIcon from "@mui/icons-material/Close";

const Step4 = ({ open, onClose, onNext, onBack, data }) => {
  const [form, setForm] = useState({
    firstName: data.firstName || "",
    lastName: data.lastName || "",
    phone: data.phone || "",
    email: data.email || "",
    patient: data.patient || "Andrew Fletcher",
    symptoms: data.symptoms || "",
    file: data.file || null,
    reason: data.reason || "",
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleNext = () => {
    if (
      !form.firstName ||
      !form.lastName ||
      !form.phone ||
      !form.email ||
      !form.reason
    ) {
      setError(
        "Please fill in all required fields (First Name, Last Name, Phone, Email, Reason)."
      );
      return;
    }
    setError(null);
    const stepData = { ...form };
    console.log("Step4 sending:", stepData);
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
          Add Basic Information
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
                  5th Street - 1011 W 5th St, Suite 120, Austin, TX 78703
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
                {data.time && data.date
                  ? `${data.time}, ${data.date.toLocaleDateString()}`
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

        {/* Basic Info Form */}
        <Box
          p={2}
          sx={{
            border: "1px solid #eee",
            borderRadius: 2,
            background: "#fff",
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="First Name"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Last Name"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Phone Number"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Email Address"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                select
                fullWidth
                label="Select Patient"
                name="patient"
                value={form.patient}
                onChange={handleChange}
              >
                <MenuItem value="Andrew Fletcher">Andrew Fletcher</MenuItem>
                <MenuItem value="New Patient">New Patient</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Symptoms"
                name="symptoms"
                value={form.symptoms}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="body2" gutterBottom>
                Attachment
              </Typography>
              <input type="file" name="file" onChange={handleChange} />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Reason for Visit"
                name="reason"
                value={form.reason}
                onChange={handleChange}
                required
              />
            </Grid>
          </Grid>
        </Box>

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
          disabled={
            !form.firstName ||
            !form.lastName ||
            !form.phone ||
            !form.email ||
            !form.reason
          }
        >
          Select Payment
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Step4;
