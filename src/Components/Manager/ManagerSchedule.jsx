// src/Components/Manager/ManagerSchedule.jsx
import React, { useEffect, useState } from "react";
import {
  Paper,
  Typography,
  Box,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  Snackbar,
  Alert,
} from "@mui/material";
import moment from "moment";
import { Link } from "react-router-dom";
import scheduleManagerService from "../../Services/ManagerService/scheduleManagerService";

const ManagerSchedule = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const token = localStorage.getItem("token");

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await scheduleManagerService.getAllSchedules(token);
      setSchedules(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch schedules", error);
      setSchedules([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  const handleDelete = async () => {
    try {
      await scheduleManagerService.deleteScheduleById(selectedId, token);
      setSnackbar({
        open: true,
        message: "Xoá thành công",
        severity: "success",
      });
      fetchData();
    } catch (error) {
      setSnackbar({ open: true, message: "Xoá thất bại", severity: "error" });
    } finally {
      setOpenConfirm(false);
      setSelectedId(null);
    }
  };

  const confirmDelete = (id) => {
    setSelectedId(id);
    setOpenConfirm(true);
  };

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>
        Lịch làm việc của bác sĩ
      </Typography>

      {loading ? (
        <Box textAlign="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead sx={{ backgroundColor: "#f0f0f0" }}>
              <TableRow>
                <TableCell>STT</TableCell>
                <TableCell>Tên bác sĩ</TableCell>
                <TableCell>Ngày</TableCell>
                <TableCell>Ca làm</TableCell>
                <TableCell>Phòng</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Người tạo</TableCell>
                <TableCell>Chi tiết</TableCell>
                <TableCell>Xoá</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {schedules.map((item, index) => (
                <TableRow key={item._id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    {item.doctorID?.userID?.name || "Không rõ"}
                  </TableCell>
                  <TableCell>
                    {moment(item.date).format("DD/MM/YYYY")}
                  </TableCell>
                  <TableCell>{item.shiftName}</TableCell>
                  <TableCell>{item.doctorID?.room || "N/A"}</TableCell>
                  <TableCell>
                    <Chip
                      label={item.status}
                      color="warning"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>{item.createdBy?.email || "Không rõ"}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      size="small"
                      component={Link}
                      to={`/manager/schedule/${item._id}`}
                    >
                      Xem
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={() => confirmDelete(item._id)}
                    >
                      Xoá
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Hộp thoại xác nhận xoá */}
      <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
        <DialogTitle>Bạn có chắc chắn muốn xoá lịch này?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setOpenConfirm(false)}>Huỷ</Button>
          <Button color="error" onClick={handleDelete}>
            Xoá
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar thông báo */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ManagerSchedule;
