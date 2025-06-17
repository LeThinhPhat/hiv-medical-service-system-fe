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
  Button,
  ToggleButtonGroup,
  ToggleButton,
  Divider,
  Avatar,
  Alert,
  IconButton,
} from "@mui/material";
import {
  CreditCard as CreditCardIcon,
  AccountCircle as PersonIcon,
  CalendarToday,
  Lock,
  Payment,
} from "@mui/icons-material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CloseIcon from "@mui/icons-material/Close";

const Step5 = ({ open, onClose, onNext, onBack, data }) => {
  const [paymentMethod, setPaymentMethod] = useState(
    data.paymentMethod?.name || "credit"
  );
  const [paymentDetails, setPaymentDetails] = useState({
    cardHolderName: data.paymentMethod?.cardHolderName || "",
    cardNumber: data.paymentMethod?.cardNumber || "",
    expiryDate: data.paymentMethod?.expiryDate || "",
    cvv: data.paymentMethod?.cvv || "",
    paypalEmail: data.paymentMethod?.paypalEmail || "",
    stripeId: data.paymentMethod?.stripeId || "",
  });
  const [error, setError] = useState(null);

  const handlePaymentMethodChange = (event, newMethod) => {
    if (newMethod) {
      setPaymentMethod(newMethod);
      setError(null);
    }
  };

  const handleDetailChange = (e) => {
    const { name, value } = e.target;
    setPaymentDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNext = () => {
    if (!paymentMethod) {
      setError("Please select a payment method.");
      return;
    }
    if (paymentMethod === "credit") {
      if (
        !paymentDetails.cardHolderName ||
        !paymentDetails.cardNumber ||
        !paymentDetails.expiryDate ||
        !paymentDetails.cvv
      ) {
        setError("Please complete all credit card fields.");
        return;
      }
      if (!/^\d{16}$/.test(paymentDetails.cardNumber)) {
        setError("Please enter a valid 16-digit card number.");
        return;
      }
      if (!/^\d{2}\/\d{2}$/.test(paymentDetails.expiryDate)) {
        setError("Please enter a valid expiry date (MM/YY).");
        return;
      }
      if (!/^\d{3}$/.test(paymentDetails.cvv)) {
        setError("Please enter a valid 3-digit CVV.");
        return;
      }
    } else if (paymentMethod === "paypal") {
      if (
        !paymentDetails.paypalEmail ||
        !/^\S+@\S+\.\S+$/.test(paymentDetails.paypalEmail)
      ) {
        setError("Please enter a valid PayPal email address.");
        return;
      }
    } else if (paymentMethod === "stripe") {
      if (!paymentDetails.stripeId) {
        setError("Please enter a valid Stripe ID.");
        return;
      }
    }

    const stepData = {
      paymentMethod: {
        name: paymentMethod,
        cardHolderName: paymentDetails.cardHolderName,
        cardNumber: paymentDetails.cardNumber,
        expiryDate: paymentDetails.expiryDate,
        cvv: paymentDetails.cvv,
        paypalEmail: paymentDetails.paypalEmail,
        stripeId: paymentDetails.stripeId,
      },
      paymentInfo: {
        serviceAmount: data.service?.price || 200,
        bookingFee: 20,
        tax: 18,
        discount: 15,
        total: 320, // Hardcoded for now, can be dynamic
      },
    };
    console.log("Step5 sending:", stepData);
    onNext(stepData);
    onClose();
  };

  const formatDateTime = (date, time) => {
    if (!date || !time) return "Not selected";
    const dateObj = new Date(date);
    return `${time}, ${dateObj.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })}`;
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
          Payment
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
            background: "white",
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
        </Box>

        {/* Payment and Booking Info */}
        <Grid container spacing={3}>
          {/* Payment Gateway */}
          <Grid item xs={12} md={6}>
            <Box
              p={2}
              sx={{
                border: "1px solid #eee",
                borderRadius: 2,
                background: "white",
              }}
            >
              <Typography variant="h6" mb={2}>
                Payment Gateway
              </Typography>

              <ToggleButtonGroup
                fullWidth
                value={paymentMethod}
                exclusive
                onChange={handlePaymentMethodChange}
                sx={{ mb: 3 }}
              >
                <ToggleButton value="credit" sx={{ flex: 1 }}>
                  <CreditCardIcon sx={{ mr: 1 }} />
                  Credit Card
                </ToggleButton>
                <ToggleButton value="paypal" sx={{ flex: 1 }}>
                  <img
                    src="https://www.paypalobjects.com/webstatic/icon/pp258.png"
                    alt="PayPal"
                    style={{ height: 20, marginRight: 8 }}
                  />
                  PayPal
                </ToggleButton>
                <ToggleButton value="stripe" sx={{ flex: 1 }}>
                  <img
                    src="https://logos-world.net/wp-content/uploads/2021/03/Stripe-Emblem.png"
                    alt="Stripe"
                    style={{ height: 20, marginRight: 8 }}
                  />
                  Stripe
                </ToggleButton>
              </ToggleButtonGroup>

              {/* Payment Fields */}
              {paymentMethod === "credit" && (
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Card Holder Name"
                      name="cardHolderName"
                      value={paymentDetails.cardHolderName}
                      onChange={handleDetailChange}
                      InputProps={{
                        startAdornment: <PersonIcon sx={{ mr: 1 }} />,
                      }}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Card Number"
                      name="cardNumber"
                      value={paymentDetails.cardNumber}
                      onChange={handleDetailChange}
                      InputProps={{
                        startAdornment: <Payment sx={{ mr: 1 }} />,
                      }}
                      required
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Expiry Date"
                      name="expiryDate"
                      value={paymentDetails.expiryDate}
                      onChange={handleDetailChange}
                      placeholder="MM/YY"
                      InputProps={{
                        startAdornment: <CalendarToday sx={{ mr: 1 }} />,
                      }}
                      required
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="CVV"
                      name="cvv"
                      value={paymentDetails.cvv}
                      onChange={handleDetailChange}
                      InputProps={{
                        startAdornment: <Lock sx={{ mr: 1 }} />,
                      }}
                      required
                    />
                  </Grid>
                </Grid>
              )}
              {paymentMethod === "paypal" && (
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="PayPal Email"
                      name="paypalEmail"
                      value={paymentDetails.paypalEmail}
                      onChange={handleDetailChange}
                      InputProps={{
                        startAdornment: <PersonIcon sx={{ mr: 1 }} />,
                      }}
                      required
                    />
                  </Grid>
                </Grid>
              )}
              {paymentMethod === "stripe" && (
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Stripe ID"
                      name="stripeId"
                      value={paymentDetails.stripeId}
                      onChange={handleDetailChange}
                      InputProps={{
                        startAdornment: <Payment sx={{ mr: 1 }} />,
                      }}
                      required
                    />
                  </Grid>
                </Grid>
              )}
            </Box>
          </Grid>

          {/* Booking Info */}
          <Grid item xs={12} md={6}>
            <Box
              p={2}
              sx={{
                border: "1px solid #eee",
                borderRadius: 2,
                background: "white",
              }}
            >
              <Typography variant="h6" mb={2}>
                Booking Info
              </Typography>

              <Typography variant="body2" fontWeight={500}>
                Date & Time
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={1}>
                {formatDateTime(data.date, data.time)}
              </Typography>

              <Typography variant="body2" fontWeight={500}>
                Appointment Type
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={2}>
                {data.appointmentType || "Clinic"}{" "}
                {data.clinic ? `(${data.clinic.name})` : ""}
              </Typography>

              <Divider sx={{ mb: 2 }} />

              <Typography variant="body2" fontWeight={500}>
                Payment Info
              </Typography>

              <Grid container>
                <Grid item xs={6}>
                  <Typography variant="body2">
                    {data.service?.name || "Echocardiograms"}
                  </Typography>
                  <Typography variant="body2">Booking Fees</Typography>
                  <Typography variant="body2">Tax</Typography>
                  <Typography variant="body2" color="error">
                    Discount
                  </Typography>
                </Grid>
                <Grid item xs={6} textAlign="right">
                  <Typography variant="body2">
                    ${data.service?.price || 200}
                  </Typography>
                  <Typography variant="body2">$20</Typography>
                  <Typography variant="body2">$18</Typography>
                  <Typography variant="body2" color="error">
                    -$15
                  </Typography>
                </Grid>
              </Grid>

              <Divider sx={{ my: 2 }} />

              <Grid container>
                <Grid item xs={6}>
                  <Typography fontWeight={600}>Total</Typography>
                </Grid>
                <Grid item xs={6} textAlign="right">
                  <Typography fontWeight={600} color="primary">
                    ${data.service?.price + 20 + 18 - 15 || 320}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
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
          disabled={
            !paymentMethod ||
            (paymentMethod === "credit" &&
              (!paymentDetails.cardHolderName ||
                !paymentDetails.cardNumber ||
                !paymentDetails.expiryDate ||
                !paymentDetails.cvv)) ||
            (paymentMethod === "paypal" && !paymentDetails.paypalEmail) ||
            (paymentMethod === "stripe" && !paymentDetails.stripeId)
          }
        >
          Confirm & Pay
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Step5;
