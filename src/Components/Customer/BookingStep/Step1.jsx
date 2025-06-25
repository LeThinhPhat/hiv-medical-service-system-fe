import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Button,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Alert,
  IconButton,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety";
import ServicesService from "../../../Services/ServicesService";

const Step1Dialog = ({ open, onClose, onNext, data, getAllService }) => {
  const [services, setServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [selectedService, setSelectedService] = useState(data.selectedService || null);
  const [error, setError] = useState(null);
  const specialty = "Cardiology";

  // Fetch service list from API
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoadingServices(true);
        const result = await ServicesService.getAllService();
        const patient = JSON.parse(localStorage.getItem("patient"));
        console.log("Patient data:", patient.medicalRecordID);
        let filteredServices = result;
        if (!patient || !patient.medicalRecordID || patient.medicalRecordID.length === 0) {
          filteredServices = result.filter(
        (service) =>
          service.name &&
          service.name.toLowerCase().includes("tổng quát")
          );
        }
        setServices(filteredServices);
      } catch (err) {
        console.error("Error fetching services:", err);
        setError("Failed to load services. Please try again.");
      } finally {
        setLoadingServices(false);
      }
    };
    if (open) fetchServices();
  }, [open, getAllService]);

  const handleNext = () => {
    if (selectedService === null) {
      setError("Please select a service.");
      return;
    }
    setError(null);
    const stepData = {
      specialty,
      service: services[selectedService],
    };
    onNext(stepData);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg" // Increased from 'md' to 'lg'
      fullWidth
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: 4,
          boxShadow: "0 6px 24px rgba(0, 0, 0, 0.15)",
          backgroundColor: "#f9fafb",
          width: "90%", // Custom width for larger dialog
          maxHeight: "90vh", // Ensure it fits within viewport
        },
      }}
    >
      <DialogTitle
        sx={{
          p: 4, // Increased padding
          display: "flex",
          alignItems: "center",
          backgroundColor: "#e3f2fd",
          borderBottom: "1px solid #e0e0e0",
        }}
      >
        <Typography
          variant="h5" // Increased from h6 to h5
          sx={{ flexGrow: 1, fontWeight: 600, color: "#1976d2" }}
        >
          Vui lòng chọn dịch vụ khám
        </Typography>
        <IconButton onClick={onClose} sx={{ color: "#546e7a" }}>
          <CloseIcon sx={{ fontSize: 32 }} /> {/* Increased icon size */}
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ p: 5, backgroundColor: "#fff" }}> {/* Increased padding */}
        <Typography
          variant="h6" // Increased from subtitle1 to h6
          gutterBottom
          sx={{ fontWeight: 500, color: "#374151" }}
        >
          Dịch vụ có sẵn
        </Typography>
        {loadingServices ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: 300, // Increased height for loading area
            }}
          >
            <CircularProgress color="primary" size={60} /> {/* Increased spinner size */}
            <Typography variant="body1" sx={{ ml: 3, color: "#546e7a" }}> {/* Increased font size */}
              Loading available services...
            </Typography>
          </Box>
        ) : services.length === 0 ? (
          <Typography variant="body1" color="text.secondary"> {/* Increased font size */}
            No services available at this time.
          </Typography>
        ) : (
          <Grid container spacing={3}> {/* Increased spacing */}
            {services.map((service, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card
                  variant="outlined"
                  sx={{
                    border:
                      selectedService === index
                        ? "3px solid #1976d2" // Thicker border
                        : "1px solid #e0e0e0",
                    borderRadius: 3, // Increased border radius
                    transition: "all 0.2s",
                    "&:hover": {
                      boxShadow: "0 6px 16px rgba(0, 0, 0, 0.15)",
                      transform: "translateY(-3px)",
                    },
                    backgroundColor:
                      selectedService === index ? "#e3f2fd" : "#fff",
                    minHeight: 140, // Increased card height
                  }}
                  onClick={() => setSelectedService(index)}
                >
                  <CardActionArea>
                    <CardContent sx={{ display: "flex", alignItems: "center", p: 3 }}> {/* Increased padding */}
                      <HealthAndSafetyIcon
                        sx={{
                          color: "#1976d2",
                          mr: 3, // Increased margin
                          fontSize: 36, // Increased icon size
                        }}
                      />
                      <Box>
                        <Typography
                          variant="h6" // Increased from body1 to h6
                          sx={{ fontWeight: 500, color: "#374151" }}
                        >
                          {service.name}
                        </Typography>
                       <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{ mt: 1 }}
                      >
                        {service.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                      </Typography>
                      </Box>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {error && (
          <Alert
            severity="error"
            sx={{
              mt: 4, // Increased margin
              mb: 3,
              borderRadius: 3,
              backgroundColor: "#fef2f2",
              color: "#b91c1c",
              fontSize: "1.1rem", // Increased font size
            }}
          >
            {error}
          </Alert>
        )}
      </DialogContent>
      <DialogActions
        sx={{
          p: 4, // Increased padding
          borderTop: "1px solid #e0e0e0",
          backgroundColor: "#f9fafb",
        }}
      >
        <Button
          onClick={onClose}
          color="inherit"
          sx={{
            textTransform: "none",
            color: "#546e7a",
            fontSize: "1.1rem", // Increased font size
            px: 4, // Increased padding
            "&:hover": { backgroundColor: "#f1f5f9" },
          }}
        >
          Hủy
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleNext}
          disabled={selectedService === null}
          sx={{
            textTransform: "none",
            borderRadius: 3,
            px: 6, // Increased padding
            fontSize: "1.1rem", // Increased font size
            backgroundColor: "#1976d2",
            "&:hover": { backgroundColor: "#1565c0" },
            "&.Mui-disabled": {
              backgroundColor: "#e0e0e0",
              color: "#9e9e9e",
            },
          }}
        >
          Tiếp tục để chọn thời gian
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Step1Dialog;