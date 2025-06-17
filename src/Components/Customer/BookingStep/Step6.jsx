import React from "react";
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
  Divider,
  Link,
  Paper,
  IconButton,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import PhoneIcon from "@mui/icons-material/Phone";
import ReplayIcon from "@mui/icons-material/Replay";
import QrCode2Icon from "@mui/icons-material/QrCode2";
import CloseIcon from "@mui/icons-material/Close";

const Step6 = ({ open, onClose, onReset, data }) => {
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
          Booking Confirmation
        </Typography>
        <IconButton onClick={onClose} sx={{ color: "grey.500" }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ p: 3 }}>
        <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
          <Grid container spacing={3}>
            {/* Left Column */}
            <Grid item xs={12} md={7}>
              <Box display="flex" alignItems="center" mb={2}>
                <CheckCircleOutlineIcon color="success" sx={{ mr: 1 }} />
                <Typography variant="h6" fontWeight={600}>
                  Booking Confirmed
                </Typography>
              </Box>

              <Box display="flex" alignItems="center" mb={2}>
                <Avatar
                  src="https://randomuser.me/api/portraits/men/32.jpg"
                  alt="Doctor"
                  sx={{ width: 56, height: 56, mr: 2 }}
                />
                <Typography>
                  Your Booking has been confirmed with{" "}
                  <strong>Dr. Michael Brown</strong>. Be on time, before{" "}
                  <strong>15 mins</strong> from the appointment time.
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Booking Info
              </Typography>

              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <Typography variant="body2" fontWeight={600}>
                    Specialty
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    {data.specialty || "Cardiology"}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" fontWeight={600}>
                    Additional Service
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    {data.service?.name || "Echocardiograms"}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" fontWeight={600}>
                    Date & Time
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    {formatDateTime(data.date, data.time)}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" fontWeight={600}>
                    Appointment Type
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    {data.appointmentType || "Clinic"}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" fontWeight={600}>
                    Clinic Name & Location
                  </Typography>
                  <Typography variant="body2">
                    {data.clinic?.name || "Wellness Path"} —{" "}
                    <Link href="#" underline="hover">
                      View Location
                    </Link>
                  </Typography>
                </Grid>
              </Grid>

              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mt={4}
                p={2}
                sx={{ background: "#F9FAFB", borderRadius: 2 }}
              >
                <Box>
                  <Typography variant="body1" fontWeight={600}>
                    Need Our Assistance
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Call us in case you face any issue on Booking / Cancellation
                  </Typography>
                </Box>
                <Button variant="outlined" startIcon={<PhoneIcon />}>
                  Call Us
                </Button>
              </Box>
            </Grid>

            {/* Right Column */}
            <Grid item xs={12} md={5}>
              <Box
                sx={{
                  border: "1px solid #eee",
                  borderRadius: 3,
                  textAlign: "center",
                  p: 3,
                }}
              >
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                  Booking Number
                </Typography>
                <Box
                  sx={{
                    border: "2px solid #B0EACD",
                    px: 2,
                    py: 0.5,
                    borderRadius: 1,
                    color: "#16A34A",
                    fontWeight: 600,
                    display: "inline-block",
                    mb: 2,
                  }}
                >
                  DCRA12565
                </Box>

                <Box mb={2}>
                  <QrCode2Icon sx={{ fontSize: 80 }} />
                </Box>

                <Typography variant="body2" color="text.secondary" mb={3}>
                  Scan this QR Code to download the details of appointment
                </Typography>

                <Button
                  fullWidth
                  variant="contained"
                  sx={{ mb: 1, background: "#1E293B" }}
                >
                  Add To Calendar
                </Button>
                <Button
                  fullWidth
                  variant="contained"
                  sx={{
                    background: "#06B6D4",
                    "&:hover": { background: "#0891B2" },
                  }}
                  startIcon={<ReplayIcon />}
                  onClick={() => {
                    onReset();
                    onClose();
                  }}
                >
                  Start New Booking
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button
          variant="text"
          sx={{ textTransform: "none" }}
          onClick={() => console.log("Back to Bookings clicked")}
        >
          ← Back to Bookings
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Step6;
