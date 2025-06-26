import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Chip,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import doctorScheduleService from "../../Services/ManagerService/createScheduleService";

const CreateDoctorSchedule = () => {
  const [doctorID, setDoctorID] = useState(""); // nhập ID bác sĩ
  const [dateInput, setDateInput] = useState(""); // ngày nhập vào
  const [dates, setDates] = useState([]); // mảng ngày
  const [message, setMessage] = useState("");

  const handleAddDate = () => {
    if (dateInput && !dates.includes(dateInput)) {
      setDates([...dates, dateInput]);
      setDateInput("");
    }
  };

  const handleRemoveDate = (dateToRemove) => {
    setDates(dates.filter((d) => d !== dateToRemove));
  };

  const handleSubmit = async () => {
    try {
      const result = await doctorScheduleService.createSchedule({
        doctorID,
        dates,
      });
      setMessage(result.message || "Tạo lịch khám thành công");
    } catch (err) {
      setMessage(
        "Tạo lịch khám thất bại: " + (err.message || "Lỗi không xác định")
      );
    }
  };

  return (
    <Paper elevation={4} sx={{ p: 4, maxWidth: 600, mx: "auto", mt: 4 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Tạo Lịch Khám Mới
      </Typography>

      <TextField
        fullWidth
        label="Doctor ID"
        value={doctorID}
        onChange={(e) => setDoctorID(e.target.value)}
        margin="normal"
      />

      <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
        <TextField
          label="Chọn ngày khám"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={dateInput}
          onChange={(e) => setDateInput(e.target.value)}
          fullWidth
        />
        <IconButton color="primary" onClick={handleAddDate}>
          <AddIcon />
        </IconButton>
      </Box>

      <Box sx={{ mt: 2, display: "flex", flexWrap: "wrap", gap: 1 }}>
        {dates.map((date) => (
          <Chip
            key={date}
            label={date}
            onDelete={() => handleRemoveDate(date)}
            deleteIcon={<DeleteIcon />}
            color="info"
          />
        ))}
      </Box>

      <Button
        variant="contained"
        color="success"
        fullWidth
        sx={{ mt: 3 }}
        onClick={handleSubmit}
        disabled={!doctorID || dates.length === 0}
      >
        Gửi Lịch Khám
      </Button>

      {message && (
        <Typography color="primary" sx={{ mt: 2 }}>
          {message}
        </Typography>
      )}
    </Paper>
  );
};

export default CreateDoctorSchedule;
