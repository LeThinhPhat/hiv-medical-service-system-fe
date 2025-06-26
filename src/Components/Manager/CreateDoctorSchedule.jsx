import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Chip,
  IconButton,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import doctorScheduleService from "../../Services/ManagerService/createScheduleService";
import doctorService from "../../Services/ManagerService/doctorService"; // ✅ import

const CreateDoctorSchedule = () => {
  const [doctorID, setDoctorID] = useState("");
  const [doctors, setDoctors] = useState([]); // ✅ danh sách bác sĩ
  const [dateInput, setDateInput] = useState("");
  const [dates, setDates] = useState([]);
  const [message, setMessage] = useState("");

  // ✅ Gọi API để lấy danh sách bác sĩ
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const data = await doctorService.getAllDoctors();
        setDoctors(data);
      } catch (err) {
        console.error("Lỗi khi lấy bác sĩ:", err);
      }
    };
    fetchDoctors();
  }, []);

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

      {/* ✅ Select chọn bác sĩ */}
      <FormControl fullWidth margin="normal">
        <InputLabel>Chọn Bác sĩ</InputLabel>
        <Select
          value={doctorID}
          label="Chọn Bác sĩ"
          onChange={(e) => setDoctorID(e.target.value)}
        >
          {doctors.map((doc) => (
            <MenuItem key={doc._id} value={doc._id}>
              {doc.userID?.name || "Không rõ"} — {doc._id}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

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
