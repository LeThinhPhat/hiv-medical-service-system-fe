import React, { useState, useEffect } from "react";
import Step1 from "./BookingStep/Step1";
import Step2 from "./BookingStep/Step2";
import Step3 from "./BookingStep/Step3";
import Step4 from "./BookingStep/Step4";
import Step5 from "./BookingStep/Step5";
import Step6 from "./BookingStep/Step6";
import { Stepper, Step, StepLabel, Box, Alert, Button } from "@mui/material";

const steps = [
  "Chọn Dịch Vụ",
  "Chọn Thời Gian",
  "Chọn Bác Sĩ",
  "Thông tin cơ bản",
  "Thanh toán",
  "Xác nhận",
];

const BookingStepper = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleNext = (stepData) => {
    if (!stepData || Object.keys(stepData).length === 0) {
      setError("Please complete all required fields.");
      return;
    }
    setError(null);
    setFormData((prev) => ({ ...prev, ...stepData }));
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep((prevStep) => prevStep - 1);
    }
  };

  const handleReset = () => {
    setActiveStep(0);
    setFormData({});
    setError(null);
    setDialogOpen(false);
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ textAlign: "center", mt: 4 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleDialogOpen}
              sx={{ fontSize: "1rem", py: 1.5, px: 4 }}
            >
              Đặt Lịch Khám
            </Button>
            <Step1
              open={dialogOpen}
              onClose={handleDialogClose}
              onNext={handleNext}
              data={formData}
            />
          </Box>
        );
      case 1:
        return (
          <Step2
            open={true}
            onClose={() => {}}
            onNext={handleNext}
            onBack={handleBack}
            data={formData}
          />
        );
      case 2:
        return (
          <Step3
            open={true}
            onClose={() => {}}
            onNext={handleNext}
            onBack={handleBack}
            data={formData}
          />
        );
      case 3:
        return (
          <Step4
            open={true}
            onClose={() => {}}
            onNext={handleNext}
            onBack={handleBack}
            data={formData}
          />
        );
      case 4:
        return (
          <Step5
            open={true}
            onClose={() => {}}
            onNext={handleNext}
            onBack={handleBack}
            data={formData}
          />
        );
      case 5:
        return (
          <Step6
            open={true}
            onClose={() => {}}
            onReset={handleReset}
            data={formData}
          />
        );
      default:
        return <div>Finish!</div>;
    }
  };

  useEffect(() => {
    console.log("Current formData:", formData);
  }, [formData]);

  return (
    <Box sx={{ width: "100%", p: { xs: 1, sm: 2, md: 3 } }}>
      <Stepper
        activeStep={activeStep}
        alternativeLabel
        aria-label="Booking process"
      >
        {steps.map((label, index) => (
          <Step key={label}>
            <StepLabel aria-label={`Step ${index + 1}: ${label}`}>
              {label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
      <Box mt={4}>{renderStepContent(activeStep)}</Box>
    </Box>
  );
};

export default BookingStepper;
