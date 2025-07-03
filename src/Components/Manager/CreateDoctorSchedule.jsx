// import React, { useEffect, useState } from "react";
// import {
//   Paper,
//   Typography,
//   Select,
//   MenuItem,
//   FormControl,
//   InputLabel,
//   Button,
//   Box,
//   OutlinedInput,
//   Chip,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
// } from "@mui/material";
// import doctorService from "../../Services/ManagerService/doctorService";
// import doctorScheduleService from "../../Services/ManagerService/createScheduleService";

// const CreateDoctorScheduleWeek = () => {
//   const [doctors, setDoctors] = useState([]);
//   const [startDate, setStartDate] = useState(() => {
//     const today = new Date();
//     today.setDate(today.getDate() - today.getDay());
//     return today;
//   });
//   const [scheduleData, setScheduleData] = useState({});
//   const [message, setMessage] = useState("");
//   const [errorDetails, setErrorDetails] = useState("");

//   useEffect(() => {
//     const fetchDoctors = async () => {
//       try {
//         const data = await doctorService.getAllDoctors();
//         setDoctors(data || []);
//       } catch (err) {
//         console.error("Lỗi khi lấy danh sách bác sĩ:", err);
//       }
//     };
//     fetchDoctors();
//   }, []);

//   const daysOfWeek = Array.from({ length: 7 }, (_, i) => {
//     const date = new Date(startDate);
//     date.setDate(startDate.getDate() + i);
//     const key = date.toISOString().slice(0, 10);
//     const label = date.toLocaleDateString("vi-VN", {
//       weekday: "long",
//       day: "2-digit",
//       month: "2-digit",
//     });
//     return { key, label };
//   });

//   const handleDoctorChange = (date, selectedDoctors) => {
//     setScheduleData((prev) => ({
//       ...prev,
//       [date]: selectedDoctors,
//     }));
//   };

//   const handleSubmit = async () => {
//     try {
//       const selectedDoctorIDs = new Set();
//       const selectedDates = [];

//       Object.entries(scheduleData).forEach(([date, doctorIDs]) => {
//         doctorIDs.forEach((id) => selectedDoctorIDs.add(id));
//         selectedDates.push(date);
//       });

//       const payload = {
//         doctorID: Array.from(selectedDoctorIDs),
//         dates: selectedDates,
//       };

//       await doctorScheduleService.createSchedule(payload);
//       setMessage("✅ Gửi lịch khám thành công!");
//       setErrorDetails("");
//     } catch (err) {
//       console.error("❌ API Error:", err.response?.data || err.message);
//       setMessage("❌ Gửi lịch khám thất bại");
//       setErrorDetails(JSON.stringify(err.response?.data || err.message));
//     }
//   };

//   const handlePreviousWeek = () => {
//     const newStart = new Date(startDate);
//     newStart.setDate(startDate.getDate() - 7);
//     setStartDate(newStart);
//     setScheduleData({});
//   };

//   const handleNextWeek = () => {
//     const newStart = new Date(startDate);
//     newStart.setDate(startDate.getDate() + 7);
//     setStartDate(newStart);
//     setScheduleData({});
//   };

//   return (
//     <Paper elevation={4} sx={{ p: 4, maxWidth: "100%", mx: "auto", mt: 4 }}>
//       <Typography variant="h5" fontWeight="bold" gutterBottom>
//         Tạo Lịch Khám Theo Tuần (Dạng Bảng)
//       </Typography>

//       <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
//         <Button variant="outlined" onClick={handlePreviousWeek}>
//           ← Tuần trước
//         </Button>
//         <Button variant="outlined" onClick={handleNextWeek}>
//           Tuần sau →
//         </Button>
//       </Box>

//       <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
//         <Table size="small">
//           <TableHead>
//             <TableRow>
//               <TableCell>Ca / Ngày</TableCell>
//               {daysOfWeek.map(({ key, label }) => (
//                 <TableCell key={key} align="center">
//                   {label}
//                 </TableCell>
//               ))}
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             <TableRow>
//               <TableCell sx={{ fontWeight: "bold" }}>Bác sĩ trực</TableCell>
//               {daysOfWeek.map(({ key }) => (
//                 <TableCell key={key}>
//                   <FormControl fullWidth size="small">
//                     <InputLabel>Chọn bác sĩ</InputLabel>
//                     <Select
//                       multiple
//                       value={scheduleData[key] || []}
//                       onChange={(e) => handleDoctorChange(key, e.target.value)}
//                       input={<OutlinedInput label="Chọn bác sĩ" />}
//                       renderValue={(selected) => (
//                         <Box
//                           sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}
//                         >
//                           {selected.map((id) => {
//                             const doc = doctors.find((d) => d._id === id);
//                             return (
//                               <Chip
//                                 key={id}
//                                 label={doc?.userID?.name || id}
//                                 color="primary"
//                               />
//                             );
//                           })}
//                         </Box>
//                       )}
//                     >
//                       {doctors.map((doc) => (
//                         <MenuItem key={doc._id} value={doc._id}>
//                           {doc.userID?.name || "Không rõ"}
//                         </MenuItem>
//                       ))}
//                     </Select>
//                   </FormControl>
//                 </TableCell>
//               ))}
//             </TableRow>
//           </TableBody>
//         </Table>
//       </TableContainer>

//       <Button
//         variant="contained"
//         color="success"
//         fullWidth
//         sx={{ mt: 3, fontWeight: "bold" }}
//         onClick={handleSubmit}
//         disabled={Object.keys(scheduleData).length === 0}
//       >
//         Gửi Lịch Khám
//       </Button>

//       {message && (
//         <Typography
//           sx={{ mt: 2 }}
//           color={message.startsWith("✅") ? "green" : "red"}
//         >
//           {message}
//         </Typography>
//       )}

//       {errorDetails && (
//         <Typography sx={{ mt: 1, fontSize: "0.875rem", color: "gray" }}>
//           Chi tiết lỗi: {errorDetails}
//         </Typography>
//       )}
//     </Paper>
//   );
// };

// export default CreateDoctorScheduleWeek;
import React, { useEffect, useState, useCallback } from "react";
import {
  Paper,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Box,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import doctorService from "../../Services/ManagerService/doctorService";
import doctorScheduleService from "../../Services/ManagerService/createScheduleService";

const CreateDoctorScheduleWeek = () => {
  const theme = useTheme();
  const [doctors, setDoctors] = useState([]);
  const [startDate, setStartDate] = useState(() => {
    const today = new Date();
    today.setDate(today.getDate() - today.getDay());
    return today;
  });
  const [scheduleData, setScheduleData] = useState({});
  const [message, setMessage] = useState("");
  const [errorDetails, setErrorDetails] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

  useEffect(() => {
    const fetchDoctors = async () => {
      setIsLoading(true);
      try {
        const data = await doctorService.getAllDoctors();
        setDoctors(data || []);
      } catch (err) {
        console.error("Lỗi khi lấy danh sách bác sĩ:", err);
        setMessage("❌ Lỗi khi tải danh sách bác sĩ");
      } finally {
        setIsLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  const daysOfWeek = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    const key = date.toISOString().slice(0, 10);
    const label = date.toLocaleDateString("vi-VN", {
      weekday: "long",
      day: "2-digit",
      month: "2-digit",
    });
    return { key, label };
  });

  const handleDoctorChange = useCallback((date, selectedDoctors) => {
    setScheduleData((prev) => ({
      ...prev,
      [date]: selectedDoctors,
    }));
  }, []);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const selectedDoctorIDs = new Set();
      const selectedDates = [];

      Object.entries(scheduleData).forEach(([date, doctorIDs]) => {
        doctorIDs.forEach((id) => selectedDoctorIDs.add(id));
        selectedDates.push(date);
      });

      if (selectedDoctorIDs.size === 0 || selectedDates.length === 0) {
        throw new Error("Vui lòng chọn ít nhất một bác sĩ và ngày!");
      }

      const payload = {
        doctorID: Array.from(selectedDoctorIDs),
        dates: selectedDates,
      };

      await doctorScheduleService.createSchedule(payload);
      setMessage("✅ Gửi lịch khám thành công!");
      setErrorDetails("");
      setScheduleData({});
    } catch (err) {
      console.error("❌ API Error:", err.response?.data || err.message);
      setMessage("❌ Gửi lịch khám thất bại");
      setErrorDetails(JSON.stringify(err.response?.data || err.message));
    } finally {
      setIsLoading(false);
      setOpenConfirmDialog(false);
    }
  };

  const handlePreviousWeek = () => {
    const newStart = new Date(startDate);
    newStart.setDate(startDate.getDate() - 7);
    setStartDate(newStart);
    setScheduleData({});
  };

  const handleNextWeek = () => {
    const newStart = new Date(startDate);
    newStart.setDate(startDate.getDate() + 7);
    setStartDate(newStart);
    setScheduleData({});
  };

  return (
    <Paper
      elevation={4}
      sx={{
        p: 4,
        maxWidth: "100%",
        mx: "auto",
        mt: 4,
        borderRadius: 2,
        backgroundColor: theme.palette.background.default,
      }}
    >
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Tạo Lịch Khám Theo Tuần
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Tuần từ {startDate.toLocaleDateString("vi-VN")} đến{" "}
        {new Date(
          startDate.getTime() + 6 * 24 * 60 * 60 * 1000
        ).toLocaleDateString("vi-VN")}
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Button
          variant="outlined"
          onClick={handlePreviousWeek}
          sx={{ "&:hover": { backgroundColor: theme.palette.action.hover } }}
        >
          ← Tuần trước
        </Button>
        <Button
          variant="outlined"
          onClick={handleNextWeek}
          sx={{ "&:hover": { backgroundColor: theme.palette.action.hover } }}
        >
          Tuần sau →
        </Button>
      </Box>

      {isLoading && (
        <CircularProgress sx={{ display: "block", mx: "auto", my: 2 }} />
      )}

      <TableContainer
        component={Paper}
        sx={{ overflowX: "auto", borderRadius: 2 }}
      >
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell
                sx={{ fontWeight: "bold", bgcolor: theme.palette.grey[100] }}
              >
                Ca / Ngày
              </TableCell>
              {daysOfWeek.map(({ key, label }) => (
                <TableCell
                  key={key}
                  align="center"
                  sx={{
                    fontWeight: "bold",
                    bgcolor: theme.palette.grey[100],
                    ...(new Date(key).toDateString() ===
                      new Date().toDateString() && {
                      border: `2px solid ${theme.palette.primary.main}`,
                    }),
                  }}
                >
                  {label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell
                sx={{ fontWeight: "bold", bgcolor: theme.palette.grey[50] }}
              >
                Bác sĩ trực
              </TableCell>
              {daysOfWeek.map(({ key }) => (
                <TableCell key={key} sx={{ bgcolor: theme.palette.grey[50] }}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Chọn bác sĩ</InputLabel>
                    <Select
                      multiple
                      value={scheduleData[key] || []}
                      onChange={(e) => handleDoctorChange(key, e.target.value)}
                      renderValue={(selected) => (
                        <Box
                          sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}
                        >
                          {selected.map((id) => {
                            const doc = doctors.find((d) => d._id === id);
                            return (
                              <Chip
                                key={id}
                                label={doc?.userID?.name || id}
                                color="primary"
                                size="small"
                              />
                            );
                          })}
                        </Box>
                      )}
                    >
                      {doctors.map((doc) => (
                        <MenuItem key={doc._id} value={doc._id}>
                          {doc.userID?.name || "Không rõ"}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </TableCell>
              ))}
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      <Button
        variant="contained"
        color="success"
        fullWidth
        sx={{ mt: 3, fontWeight: "bold" }}
        onClick={() => setOpenConfirmDialog(true)}
        disabled={Object.keys(scheduleData).length === 0 || isLoading}
      >
        Gửi Lịch Khám
      </Button>

      {message && (
        <Alert
          severity={message.startsWith("✅") ? "success" : "error"}
          sx={{ mt: 2 }}
        >
          {message}
          {errorDetails && (
            <Typography variant="caption" display="block" sx={{ mt: 1 }}>
              Chi tiết lỗi: {errorDetails}
            </Typography>
          )}
        </Alert>
      )}

      <Dialog
        open={openConfirmDialog}
        onClose={() => setOpenConfirmDialog(false)}
      >
        <DialogTitle>Xác nhận lịch khám</DialogTitle>
        <DialogContent>
          <Typography>Bạn có chắc chắn muốn gửi lịch khám sau?</Typography>
          <Box sx={{ mt: 2 }}>
            {Object.entries(scheduleData).map(([date, doctorIDs]) => (
              <Typography key={date}>
                {date}:{" "}
                {doctorIDs
                  .map(
                    (id) =>
                      doctors.find((d) => d._id === id)?.userID?.name || id
                  )
                  .join(", ")}
              </Typography>
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirmDialog(false)}>Hủy</Button>
          <Button onClick={handleSubmit} color="success" disabled={isLoading}>
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default CreateDoctorScheduleWeek;
