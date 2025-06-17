import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Avatar,
  Grid,
  Button,
  Card,
  CardContent,
  CardActionArea,
  Alert,
  IconButton,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import VideoCallIcon from "@mui/icons-material/VideoCall";
import CallIcon from "@mui/icons-material/Call";
import ChatIcon from "@mui/icons-material/Chat";
import HomeIcon from "@mui/icons-material/Home";
import CloseIcon from "@mui/icons-material/Close";

const appointmentTypes = [
  { label: "Clinic", icon: <LocalHospitalIcon /> },
  { label: "Video Call", icon: <VideoCallIcon /> },
  { label: "Audio Call", icon: <CallIcon /> },
  { label: "Chat", icon: <ChatIcon /> },
  { label: "Home Visit", icon: <HomeIcon /> },
];

const clinics = [
  {
    name: "AllCare Family Medicine",
    address: "3343 Private Lane, Valdosta",
    distance: "500 Meters",
    image: "https://cdn-icons-png.flaticon.com/512/1077/1077012.png",
  },
  {
    name: "Vitalplus Clinic",
    address: "4223 Pleasant Hill Road, Miami, FL 33169",
    distance: "12 KM",
    image: "https://cdn-icons-png.flaticon.com/512/3873/3873177.png",
  },
  {
    name: "Wellness Path Chiropractic",
    address: "418 Patton Lane, Garner, NC 27529, FL 33169",
    distance: "16 KM",
    image: "https://cdn-icons-png.flaticon.com/512/4320/4320337.png",
  },
];

const Step2 = ({ open, onClose, onNext, onBack, data }) => {
  const [selectedType, setSelectedType] = useState(
    data.appointmentType || "Clinic"
  );
  const [selectedClinic, setSelectedClinic] = useState(
    data.selectedClinic || null
  );
  const [error, setError] = useState(null);

  const handleNext = () => {
    if (selectedType === "Clinic" && selectedClinic === null) {
      setError("Please select a clinic.");
      return;
    }
    if (!selectedType) {
      setError("Please select an appointment type.");
      return;
    }
    setError(null);
    const stepData = {
      appointmentType: selectedType,
    };
    if (selectedType === "Clinic") {
      stepData.clinic = clinics[selectedClinic];
    }
    console.log("Step2 sending:", stepData);
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
          Select Appointment Type
        </Typography>
        <IconButton onClick={onClose} sx={{ color: "grey.500" }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ p: 3 }}>
        {/* Doctor Profile */}
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
                Psychologist
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
        </Box>

        {/* Appointment Type */}
        <Typography variant="subtitle1" gutterBottom>
          Select Appointment Type
        </Typography>
        <Grid container spacing={2} mb={3}>
          {appointmentTypes.map((type) => (
            <Grid item key={type.label}>
              <Button
                variant={selectedType === type.label ? "outlined" : "contained"}
                onClick={() => setSelectedType(type.label)}
                startIcon={type.icon}
                sx={{
                  minWidth: 120,
                  borderRadius: 2,
                  textTransform: "none",
                  backgroundColor:
                    selectedType === type.label ? "#fff" : "#f4f4f4",
                }}
              >
                {type.label}
              </Button>
            </Grid>
          ))}
        </Grid>

        {/* Clinics */}
        {selectedType === "Clinic" && (
          <>
            <Typography variant="subtitle1" gutterBottom>
              Select Clinics
            </Typography>
            <Grid container direction="column" spacing={2}>
              {clinics.map((clinic, index) => (
                <Grid item key={index}>
                  <Card
                    onClick={() => setSelectedClinic(index)}
                    sx={{
                      border:
                        selectedClinic === index
                          ? "2px solid #1976d2"
                          : "1px solid #e0e0e0",
                      boxShadow:
                        selectedClinic === index ? "0 0 0 2px #bbdefb" : "none",
                      borderRadius: 2,
                    }}
                  >
                    <CardActionArea>
                      <CardContent
                        sx={{ display: "flex", alignItems: "center" }}
                      >
                        <Avatar
                          src={clinic.image}
                          sx={{ width: 56, height: 56, mr: 2 }}
                        />
                        <Box>
                          <Typography fontWeight={600}>
                            {clinic.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {clinic.address} • {clinic.distance}
                          </Typography>
                        </Box>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </>
        )}

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
            selectedType === null ||
            (selectedType === "Clinic" && selectedClinic === null)
          }
        >
          Select Date & Time
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Step2;
