import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Typography,
  TextField,
  MenuItem,
  Button,
  Alert,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PersonIcon from "@mui/icons-material/Person";

const Step4 = ({ open, onClose, onNext, onBack, data, hasProfile }) => {
  const [form, setForm] = useState({
    personalID: data.personalID || "",
    name: data.name || "",
    gender: data.gender || "",
    dob: data.dob || "",
    contactEmails: data.contactEmails?.[0] || "",
    contactPhones: data.contactPhones?.[0] || "",
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNext = () => {
    if (!form.personalID) {
      setError("Vui lòng nhập căn cước công dân.");
      return;
    }
    if (!hasProfile) {
      if (
        !form.name ||
        !form.gender ||
        !form.dob ||
        !form.contactEmails ||
        !form.contactPhones
      ) {
        setError("Vui lòng điền đầy đủ thông tin cá nhân.");
        return;
      }
    }
    setError(null);
    let stepData;
    if (hasProfile) {
      stepData = { personalID: form.personalID };
    } else {
      stepData = {
        personalID: form.personalID,
        name: form.name,
        gender: form.gender,
        dob: form.dob,
        contactEmails: [form.contactEmails],
        contactPhones: [form.contactPhones],
      };
    }
    onNext(stepData);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
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
        <PersonIcon sx={{ color: "#1976d2", mr: 1, fontSize: 28 }} />
        <Typography
          variant="h6"
          sx={{ flexGrow: 1, fontWeight: 600, color: "#1976d2" }}
        >
          {hasProfile ? "Verify Identity" : "Patient Information"}
        </Typography>
        <IconButton onClick={onClose} sx={{ color: "#546e7a" }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ p: 4, backgroundColor: "#fff" }}>
        {hasProfile ? (
          <Alert
            severity="info"
            sx={{
              mb: 3,
              borderRadius: 2,
              backgroundColor: "#e3f2fd",
              color: "#1976d2",
            }}
          >
            Bạn đã cung cấp đủ thông tin cá nhân. Vui lòng nhập căn cước công dân để tiếp tục đặt lịch.
          </Alert>
        ) : (
          <Alert
            severity="warning"
            sx={{
              mb: 3,
              borderRadius: 2,
              backgroundColor: "#fefce8",
              color: "#a16207",
            }}
          >
            Bạn chưa từng cung cấp thông tin cá nhân. Vui lòng điền đầy đủ thông tin bên dưới.
          </Alert>
        )}
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Căn cước công dân"
              name="personalID"
              value={form.personalID}
              onChange={handleChange}
              required
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#e0e0e0",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#1976d2",
                },
                "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#1976d2",
                },
              }}
            />
          </Grid>
          {!hasProfile && (
            <>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Họ và tên"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#e0e0e0",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#1976d2",
                    },
                    "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#1976d2",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  select
                  fullWidth
                  label="Giới tính"
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  required
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#e0e0e0",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#1976d2",
                    },
                    "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#1976d2",
                    },
                  }}
                >
                  <MenuItem value="Male">Nam</MenuItem>
                  <MenuItem value="Female">Nữ</MenuItem>
                  <MenuItem value="Other">Khác</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="date"
                  label="Ngày sinh"
                  name="dob"
                  value={form.dob}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  required
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#e0e0e0",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#1976d2",
                    },
                    "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#1976d2",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email liên hệ"
                  name="contactEmails"
                  value={form.contactEmails}
                  onChange={handleChange}
                  required
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#e0e0e0",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#1976d2",
                    },
                    "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#1976d2",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Số điện thoại liên hệ"
                  name="contactPhones"
                  value={form.contactPhones}
                  onChange={handleChange}
                  required
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#e0e0e0",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#1976d2",
                    },
                    "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#1976d2",
                    },
                  }}
                />
              </Grid>
            </>
          )}
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
          Back
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleNext}
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
          Confirm Appointment
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Step4;