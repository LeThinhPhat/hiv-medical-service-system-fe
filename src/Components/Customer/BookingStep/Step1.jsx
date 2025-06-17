import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Button,
  Typography,
  Avatar,
  Grid,
  MenuItem,
  Select,
  Card,
  CardContent,
  CardActionArea,
  Alert,
  IconButton,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CloseIcon from "@mui/icons-material/Close";

const doctor = {
  name: "Dr. Michael Brown",
  rating: 5.0,
  specialty: "Psychologist",
  address: "5th Street - 1011 W 5th St, Suite 120, Austin, TX 78703",
  image: "https://randomuser.me/api/portraits/men/32.jpg",
};

const services = [
  { name: "Echocardiograms", price: 310 },
  { name: "Stress tests", price: 754 },
  { name: "Heart Catheterization", price: 150 },
  { name: "Echocardiograms", price: 200 },
  { name: "Stress tests", price: 754 },
  { name: "Echocardiograms", price: 200 },
];

const Step1Dialog = ({ open, onClose, onNext, data }) => {
  const [selectedService, setSelectedService] = useState(
    data.selectedService || null
  );
  const [specialty, setSpecialty] = useState(data.specialty || "Cardiology");
  const [error, setError] = useState(null);

  const handleNext = () => {
    if (selectedService === null || !specialty) {
      setError("Please select a specialty and a service.");
      return;
    }
    setError(null);
    const stepData = {
      specialty,
      service: services[selectedService],
    };
    console.log("DoctorApp sending:", stepData);
    onNext(stepData);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      sx={{ "& .MuiDialog-paper": { borderRadius: 2 } }}
    >
      <DialogTitle sx={{ m: 0, p: 2, display: "flex", alignItems: "center" }}>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Select Service and Specialty
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
                src={doctor.image}
                sx={{ width: 56, height: 56 }}
                alt={doctor.name}
              />
            </Grid>
            <Grid item xs>
              <Typography variant="subtitle1">{doctor.name}</Typography>
              <Typography variant="body2" color="primary">
                {doctor.specialty}
              </Typography>
              <Box display="flex" alignItems="center" mt={0.5}>
                <LocationOnIcon sx={{ fontSize: 16, mr: 0.5 }} />
                <Typography variant="caption">{doctor.address}</Typography>
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
                ⭐ {doctor.rating}
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Specialty Selection */}
        <Typography variant="subtitle1" gutterBottom>
          Select Specialty
        </Typography>
        <Select
          fullWidth
          value={specialty}
          onChange={(e) => setSpecialty(e.target.value)}
          sx={{ mb: 3 }}
        >
          <MenuItem value="Cardiology">Cardiology</MenuItem>
          <MenuItem value="Neurology">Neurology</MenuItem>
          <MenuItem value="Orthopedics">Orthopedics</MenuItem>
        </Select>

        {/* Services Selection */}
        <Typography variant="subtitle1" gutterBottom>
          Services
        </Typography>
        <Grid container spacing={2}>
          {services.map((service, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                variant="outlined"
                sx={{
                  border:
                    selectedService === index
                      ? "2px solid #1976d2"
                      : "1px solid #ddd",
                  boxShadow:
                    selectedService === index ? "0 0 0 2px #bbdefb" : "none",
                }}
                onClick={() => setSelectedService(index)}
              >
                <CardActionArea>
                  <CardContent>
                    <Typography variant="body1">{service.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      ${service.price}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Error Message */}
        {error && (
          <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
            {error}
          </Alert>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button
          variant="contained"
          color="info"
          onClick={handleNext}
          disabled={selectedService === null || !specialty}
        >
          Select Appointment Type
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Step1Dialog;
