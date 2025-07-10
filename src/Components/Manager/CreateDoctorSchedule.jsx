// import React, { useEffect, useState, useCallback } from "react";
// import {
//   Paper,
//   Typography,
//   Select,
//   MenuItem,
//   FormControl,
//   InputLabel,
//   Button,
//   Box,
//   Chip,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Alert,
//   CircularProgress,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
// } from "@mui/material";
// import { useTheme } from "@mui/material/styles";
// import doctorService from "../../Services/ManagerService/doctorService";
// import doctorScheduleService from "../../Services/ManagerService/createScheduleService";

// const CreateDoctorScheduleWeek = () => {
//   const theme = useTheme();
//   const [doctors, setDoctors] = useState([]);
//   const [startDate, setStartDate] = useState(() => {
//     const today = new Date();
//     today.setDate(today.getDate() - today.getDay());
//     return today;
//   });
//   const [scheduleData, setScheduleData] = useState({});
//   const [message, setMessage] = useState("");
//   const [errorDetails, setErrorDetails] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

//   useEffect(() => {
//     const fetchDoctors = async () => {
//       setIsLoading(true);
//       try {
//         const data = await doctorService.getAllDoctors();
//         setDoctors(data || []);
//       } catch (err) {
//         console.error("Lỗi khi lấy danh sách bác sĩ:", err);
//         setMessage("❌ Lỗi khi tải danh sách bác sĩ");
//       } finally {
//         setIsLoading(false);
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

//   const handleDoctorChange = useCallback((date, selectedDoctors) => {
//     setScheduleData((prev) => ({
//       ...prev,
//       [date]: selectedDoctors,
//     }));
//   }, []);

//   const handleSubmit = async () => {
//     setIsLoading(true);
//     try {
//       const selectedDoctorIDs = new Set();
//       const selectedDates = [];

//       Object.entries(scheduleData).forEach(([date, doctorIDs]) => {
//         doctorIDs.forEach((id) => selectedDoctorIDs.add(id));
//         selectedDates.push(date);
//       });

//       if (selectedDoctorIDs.size === 0 || selectedDates.length === 0) {
//         throw new Error("Vui lòng chọn ít nhất một bác sĩ và ngày!");
//       }

//       const payload = {
//         doctorID: Array.from(selectedDoctorIDs),
//         dates: selectedDates,
//       };

//       await doctorScheduleService.createSchedule(payload);
//       setMessage("✅ Gửi lịch khám thành công!");
//       setErrorDetails("");
//       setScheduleData({});
//     } catch (err) {
//       console.error("❌ API Error:", err.response?.data || err.message);
//       setMessage("❌ Gửi lịch khám thất bại");
//       setErrorDetails(JSON.stringify(err.response?.data || err.message));
//     } finally {
//       setIsLoading(false);
//       setOpenConfirmDialog(false);
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
//     <Paper
//       elevation={4}
//       sx={{
//         p: 4,
//         maxWidth: "100%",
//         mx: "auto",
//         mt: 4,
//         borderRadius: 2,
//         backgroundColor: theme.palette.background.default,
//       }}
//     >
//       <Typography variant="h5" fontWeight="bold" gutterBottom>
//         Tạo Lịch Khám Theo Tuần
//       </Typography>
//       <Typography variant="subtitle1" color="text.secondary" gutterBottom>
//         Tuần từ {startDate.toLocaleDateString("vi-VN")} đến{" "}
//         {new Date(
//           startDate.getTime() + 6 * 24 * 60 * 60 * 1000
//         ).toLocaleDateString("vi-VN")}
//       </Typography>

//       <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
//         <Button
//           variant="outlined"
//           onClick={handlePreviousWeek}
//           sx={{ "&:hover": { backgroundColor: theme.palette.action.hover } }}
//         >
//           ← Tuần trước
//         </Button>
//         <Button
//           variant="outlined"
//           onClick={handleNextWeek}
//           sx={{ "&:hover": { backgroundColor: theme.palette.action.hover } }}
//         >
//           Tuần sau →
//         </Button>
//       </Box>

//       {isLoading && (
//         <CircularProgress sx={{ display: "block", mx: "auto", my: 2 }} />
//       )}

//       <TableContainer
//         component={Paper}
//         sx={{ overflowX: "auto", borderRadius: 2 }}
//       >
//         <Table size="small">
//           <TableHead>
//             <TableRow>
//               <TableCell
//                 sx={{ fontWeight: "bold", bgcolor: theme.palette.grey[100] }}
//               >
//                 Ca / Ngày
//               </TableCell>
//               {daysOfWeek.map(({ key, label }) => (
//                 <TableCell
//                   key={key}
//                   align="center"
//                   sx={{
//                     fontWeight: "bold",
//                     bgcolor: theme.palette.grey[100],
//                     ...(new Date(key).toDateString() ===
//                       new Date().toDateString() && {
//                       border: `2px solid ${theme.palette.primary.main}`,
//                     }),
//                   }}
//                 >
//                   {label}
//                 </TableCell>
//               ))}
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             <TableRow>
//               <TableCell
//                 sx={{ fontWeight: "bold", bgcolor: theme.palette.grey[50] }}
//               >
//                 Bác sĩ trực
//               </TableCell>
//               {daysOfWeek.map(({ key }) => (
//                 <TableCell key={key} sx={{ bgcolor: theme.palette.grey[50] }}>
//                   <FormControl fullWidth size="small">
//                     <InputLabel>Chọn bác sĩ</InputLabel>
//                     <Select
//                       multiple
//                       value={scheduleData[key] || []}
//                       onChange={(e) => handleDoctorChange(key, e.target.value)}
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
//                                 size="small"
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
//         onClick={() => setOpenConfirmDialog(true)}
//         disabled={Object.keys(scheduleData).length === 0 || isLoading}
//       >
//         Gửi Lịch Khám
//       </Button>

//       {message && (
//         <Alert
//           severity={message.startsWith("✅") ? "success" : "error"}
//           sx={{ mt: 2 }}
//         >
//           {message}
//           {errorDetails && (
//             <Typography variant="caption" display="block" sx={{ mt: 1 }}>
//               Chi tiết lỗi: {errorDetails}
//             </Typography>
//           )}
//         </Alert>
//       )}

//       <Dialog
//         open={openConfirmDialog}
//         onClose={() => setOpenConfirmDialog(false)}
//       >
//         <DialogTitle>Xác nhận lịch khám</DialogTitle>
//         <DialogContent>
//           <Typography>Bạn có chắc chắn muốn gửi lịch khám sau?</Typography>
//           <Box sx={{ mt: 2 }}>
//             {Object.entries(scheduleData).map(([date, doctorIDs]) => (
//               <Typography key={date}>
//                 {date}:{" "}
//                 {doctorIDs
//                   .map(
//                     (id) =>
//                       doctors.find((d) => d._id === id)?.userID?.name || id
//                   )
//                   .join(", ")}
//               </Typography>
//             ))}
//           </Box>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setOpenConfirmDialog(false)}>Hủy</Button>
//           <Button onClick={handleSubmit} color="success" disabled={isLoading}>
//             Xác nhận
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Paper>
//   );
// };

// export default CreateDoctorScheduleWeek;

import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import doctorService from "../../Services/ManagerService/doctorService";
import doctorScheduleService from "../../Services/ManagerService/createScheduleService";

const CreateDoctorScheduleWeek = () => {
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
  const [openEventModal, setOpenEventModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDoctors, setSelectedDoctors] = useState([]);

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
      weekday: "short",
      day: "2-digit",
      month: "2-digit",
    });
    return { key, label, date };
  });

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const doctorId = result.draggableId;
    const date = result.destination.droppableId;
    if (scheduleData[date]?.includes(doctorId)) return;
    setScheduleData((prev) => ({
      ...prev,
      [date]: [...(prev[date] || []), doctorId],
    }));
  };

  const handleRemoveDoctor = (date, doctorId) => {
    setScheduleData((prev) => ({
      ...prev,
      [date]: (prev[date] || []).filter((id) => id !== doctorId),
    }));
  };

  const handleAddEvent = () => {
    if (selectedDate && selectedDoctors.length > 0) {
      setScheduleData((prev) => {
        const currentDoctors = prev[selectedDate] || [];
        const newDoctors = selectedDoctors.filter(
          (id) => !currentDoctors.includes(id)
        );
        return {
          ...prev,
          [selectedDate]: [...currentDoctors, ...newDoctors],
        };
      });
      setOpenEventModal(false);
      setSelectedDoctors([]);
      setSelectedDate(null);
    }
  };

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

  const availableDoctors = selectedDate
    ? doctors.filter((doc) => !scheduleData[selectedDate]?.includes(doc._id))
    : doctors;

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <div className=" container mx-auto mt-8 p-6 bg-white shadow-lg rounded-lg relative">
        <h1 className="text-2xl font-bold mb-6">Lịch Khám Bác Sĩ</h1>
        <div className="flex items-center mb-6 space-x-4">
          <DatePicker
            label="Chọn tuần"
            value={startDate}
            onChange={(newDate) => {
              if (newDate) {
                const adjustedDate = new Date(newDate);
                adjustedDate.setDate(newDate.getDate() - newDate.getDay());
                setStartDate(adjustedDate);
                setScheduleData({});
              }
            }}
            slotProps={{ textField: { className: "w-40" } }}
          />
          <button
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
            onClick={handlePreviousWeek}
          >
            ← Tuần trước
          </button>
          <button
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
            onClick={handleNextWeek}
          >
            Tuần sau →
          </button>
        </div>

        {isLoading && (
          <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}

        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex space-x-4">
            <Droppable droppableId="doctors">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="w-48 p-4 bg-gray-100 rounded-lg"
                >
                  <h2 className="text-lg font-bold mb-4">Danh Sách Bác Sĩ</h2>
                  {doctors.map((doc, index) => (
                    <Draggable
                      key={doc._id}
                      draggableId={doc._id}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRefнин}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="bg-blue-500 text-white rounded-full px-3 py-1 mb-2 text-sm"
                        >
                          {doc.userID?.name || "Không rõ"}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>

            <div className="flex-1 grid grid-cols-7 gap-2 bg-gray-100 p-4 rounded-lg">
              {daysOfWeek.map(({ key, label, date }) => (
                <Droppable key={key} droppableId={key}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`p-4 rounded-lg border ${
                        scheduleData[key]?.length > 0
                          ? "bg-green-100"
                          : "bg-white"
                      } ${
                        date.toDateString() === new Date().toDateString()
                          ? "border-blue-500 border-2"
                          : "border-gray-300"
                      } hover:bg-gray-50 min-h-[150px]`}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-bold">{label}</span>
                        <button
                          className="text-blue-500 hover:text-blue-700"
                          onClick={() => {
                            setSelectedDate(key);
                            setOpenEventModal(true);
                          }}
                          title="Thêm bác sĩ"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 4v16m8-8H4"
                            />
                          </svg>
                        </button>
                      </div>
                      {(scheduleData[key] || []).map((doctorId) => {
                        const doc = doctors.find((d) => d._id === doctorId);
                        return (
                          <div
                            key={doctorId}
                            className="flex items-center mb-1"
                          >
                            <span className="bg-blue-500 text-white rounded-full px-2 py-1 text-xs flex-1">
                              {doc?.userID?.name || doctorId}
                            </span>
                            <button
                              className="ml-2 text-red-500 hover:text-red-700"
                              onClick={() => handleRemoveDoctor(key, doctorId)}
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            </button>
                          </div>
                        );
                      })}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              ))}
            </div>
          </div>
        </DragDropContext>

        <button
          className={`w-full mt-6 py-2 text-white rounded-md font-bold ${
            Object.keys(scheduleData).length === 0 || isLoading
              ? "bg-green-300 cursor-not-allowed"
              : "bg-green-500 hover:bg-green-600"
          }`}
          onClick={() => setOpenConfirmDialog(true)}
          disabled={Object.keys(scheduleData).length === 0 || isLoading}
        >
          Gửi Lịch Khám
        </button>

        {message && (
          <div
            className={`mt-4 p-4 rounded-md ${
              message.startsWith("✅") ? "bg-green-100" : "bg-red-100"
            }`}
          >
            <p>{message}</p>
            {errorDetails && (
              <p className="mt-2 text-sm">Chi tiết lỗi: {errorDetails}</p>
            )}
          </div>
        )}

        {openEventModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-96">
              <h2 className="text-lg font-bold mb-4">
                Thêm Bác Sĩ Cho Ngày {selectedDate}
              </h2>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Chọn bác sĩ (giữ Ctrl/Cmd để chọn nhiều)
                </label>
                <select
                  multiple
                  value={selectedDoctors}
                  onChange={(e) =>
                    setSelectedDoctors(
                      Array.from(
                        e.target.selectedOptions,
                        (option) => option.value
                      )
                    )
                  }
                  className="w-full border rounded-md p-2 h-40 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {availableDoctors.length > 0 ? (
                    availableDoctors.map((doc) => (
                      <option key={doc._id} value={doc._id}>
                        {doc.userID?.name || "Không rõ"}
                      </option>
                    ))
                  ) : (
                    <option disabled>Không còn bác sĩ nào để chọn</option>
                  )}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Sử dụng Ctrl/Cmd + click để chọn nhiều bác sĩ hoặc Shift để
                  chọn một dãy.
                </p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {selectedDoctors.map((id) => {
                    const doc = doctors.find((d) => d._id === id);
                    return (
                      <span
                        key={id}
                        className="bg-blue-500 text-white rounded-full px-2 py-1 text-xs"
                      >
                        {doc?.userID?.name || id}
                      </span>
                    );
                  })}
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
                  onClick={() => {
                    setOpenEventModal(false);
                    setSelectedDoctors([]);
                  }}
                >
                  Hủy
                </button>
                <button
                  className={`px-4 py-2 text-white rounded-md ${
                    selectedDoctors.length === 0
                      ? "bg-green-300 cursor-not-allowed"
                      : "bg-green-500 hover:bg-green-600"
                  }`}
                  onClick={handleAddEvent}
                  disabled={selectedDoctors.length === 0}
                >
                  Thêm
                </button>
              </div>
            </div>
          </div>
        )}

        {openConfirmDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-96">
              <h2 className="text-lg font-bold mb-4">Xác nhận lịch khám</h2>
              <p className="mb-4">Bạn có chắc chắn muốn gửi lịch khám sau?</p>
              <div className="mb-4">
                {Object.entries(scheduleData).map(([date, doctorIDs]) => (
                  <div key={date} className="mb-2">
                    <p className="text-sm font-bold">
                      {new Date(date).toLocaleDateString("vi-VN", {
                        weekday: "long",
                        day: "2-digit",
                        month: "2-digit",
                      })}
                    </p>
                    <p className="text-sm">
                      {doctorIDs
                        .map(
                          (id) =>
                            doctors.find((d) => d._id === id)?.userID?.name ||
                            id
                        )
                        .join(", ")}
                    </p>
                  </div>
                ))}
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
                  onClick={() => setOpenConfirmDialog(false)}
                >
                  Hủy
                </button>
                <button
                  className={`px-4 py-2 text-white rounded-md ${
                    isLoading
                      ? "bg-green-300 cursor-not-allowed"
                      : "bg-green-500 hover:bg-green-600"
                  }`}
                  onClick={handleSubmit}
                  disabled={isLoading}
                >
                  Xác nhận
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </LocalizationProvider>
  );
};

export default CreateDoctorScheduleWeek;
