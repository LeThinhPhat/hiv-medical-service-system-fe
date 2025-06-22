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
import PatientService from "../../../Services/patientService";

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
        const patient = await PatientService.getPatientByToken();
        console.log("Patient data:", patient.medicalRecordID);
        let filteredServices = result;
        if (!patient || !patient.medicalRecordID || patient.medicalRecordID.length === 0) {
          filteredServices = result.filter(
            (service) =>
              service.name &&
              service.name.toLowerCase().includes("basic checkup")
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
          Vui lòng chọn dịch vụ khám
        </Typography>
        <IconButton onClick={onClose} sx={{ color: "#546e7a" }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ p: 4, backgroundColor: "#fff" }}>
        <Typography
          variant="subtitle1"
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
              height: 200,
            }}
          >
            <CircularProgress color="primary" />
            <Typography variant="body2" sx={{ ml: 2, color: "#546e7a" }}>
              Loading available services...
            </Typography>
          </Box>
        ) : services.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No services available at this time.
          </Typography>
        ) : (
          <Grid container spacing={2}>
            {services.map((service, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card
                  variant="outlined"
                  sx={{
                    border:
                      selectedService === index
                        ? "2px solid #1976d2"
                        : "1px solid #e0e0e0",
                    borderRadius: 2,
                    transition: "all 0.2s",
                    "&:hover": {
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                      transform: "translateY(-2px)",
                    },
                    backgroundColor:
                      selectedService === index ? "#e3f2fd" : "#fff",
                  }}
                  onClick={() => setSelectedService(index)}
                >
                  <CardActionArea>
                    <CardContent sx={{ display: "flex", alignItems: "center" }}>
                      <HealthAndSafetyIcon
                        sx={{
                          color: "#1976d2",
                          mr: 2,
                          fontSize: 28,
                        }}
                      />
                      <Box>
                        <Typography
                          variant="body1"
                          sx={{ fontWeight: 500, color: "#374151" }}
                        >
                          {service.name}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mt: 0.5 }}
                        >
                          ${service.price.toFixed(2)}
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
          onClick={onClose}
          color="inherit"
          sx={{
            textTransform: "none",
            color: "#546e7a",
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
          Tiếp tục để chọn thời gian
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Step1Dialog;