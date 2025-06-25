import React, { useEffect, useState } from "react";
import doctorSlotService from "../../Services/DoctorService/doctorSlotService";
import {
  Box,
  Typography,
  Button,
  IconButton,
  Paper,
  Stack,
  TextField,
} from "@mui/material";
import { ArrowBack, ArrowForward, CalendarToday } from "@mui/icons-material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import viLocale from "date-fns/locale/vi";

const DoctorSlotList = () => {
  const [slots, setSlots] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());

  const fetchSlots = async (date) => {
    const isoDate = date.toISOString().split("T")[0];
    try {
      const response = await doctorSlotService.getSlotsByDate(isoDate);
      setSlots(response.data);
    } catch (err) {
      console.error("Failed to fetch slots", err);
      setSlots([]);
    }
  };

  useEffect(() => {
    fetchSlots(currentDate);
  }, [currentDate]);

  const handleNextDay = () => {
    setCurrentDate((prev) => new Date(prev.getTime() + 86400000));
  };

  const handlePrevDay = () => {
    setCurrentDate((prev) => new Date(prev.getTime() - 86400000));
  };

  const formatDate = (date) =>
    date.toLocaleDateString("vi-VN", {
      weekday: "long",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={viLocale}>
      <Box p={3}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          alignItems="center"
          mb={2}
          flexWrap="wrap"
        >
          <IconButton onClick={handlePrevDay} color="primary">
            <ArrowBack />
          </IconButton>

          <CalendarToday color="action" />

          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            {formatDate(currentDate)}
          </Typography>

          <IconButton onClick={handleNextDay} color="primary">
            <ArrowForward />
          </IconButton>

          <DatePicker
            label="Chọn ngày"
            value={currentDate}
            onChange={(newValue) => {
              if (newValue) setCurrentDate(newValue);
            }}
            renderInput={(params) => <TextField {...params} size="small" />}
          />
        </Stack>

        {slots.length > 0 ? (
          <Stack spacing={2}>
            {slots.map((slot) => (
              <Paper
                key={slot._id}
                elevation={3}
                sx={{ p: 2, backgroundColor: "#f1f9ff" }}
              >
                <Typography>
                  🕒 <strong>Bắt đầu:</strong>{" "}
                  {new Date(slot.startTime).toLocaleTimeString("vi-VN")}
                </Typography>
                <Typography>
                  ⏰ <strong>Kết thúc:</strong>{" "}
                  {new Date(slot.endTime).toLocaleTimeString("vi-VN")}
                </Typography>
                <Typography>
                  📌 <strong>Trạng thái:</strong> {slot.status}
                </Typography>
              </Paper>
            ))}
          </Stack>
        ) : (
          <Typography color="error">
            Không có slot khám trong ngày này.
          </Typography>
        )}
      </Box>
    </LocalizationProvider>
  );
};

export default DoctorSlotList;
