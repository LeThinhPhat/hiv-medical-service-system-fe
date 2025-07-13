import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AnonymousService from "../../Services/CusService/AnonymousService";

const AnonymousAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [confirmDialog, setConfirmDialog] = useState({ open: false, id: null });

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await AnonymousService.getAllAnonymousAppointments();
      if (response && response.data) {
        setAppointments(response.data);
      } else {
        setError("Dữ liệu trả về không hợp lệ");
      }
    } catch (err) {
      setError(err.message || "Đã xảy ra lỗi khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateStr, rawDate, rawTime) => {
    if (rawDate && rawTime) return `${rawDate} ${rawTime}`;
    const date = new Date(dateStr);
    return date.toLocaleString("vi-VN", {
      dateStyle: "short",
      timeStyle: "short",
    });
  };

  const handleApproveClick = (id) => {
    setConfirmDialog({ open: true, id });
  };

  const handleConfirm = async () => {
    try {
      await AnonymousService.confirmAnonymousAppointment(confirmDialog.id);
      toast.success("✔️ Duyệt lịch hẹn thành công!");
      setConfirmDialog({ open: false, id: null });
      fetchAppointments();
    } catch (err) {
      toast.error("❌ Duyệt lịch hẹn thất bại: " + (err.message || "Lỗi không xác định"));
    }
  };

  const handleCancel = () => {
    setConfirmDialog({ open: false, id: null });
  };

  const pendingAppointments = appointments.filter((item) => item.status === "Đang xét duyệt");
  const otherAppointments = appointments.filter((item) => item.status !== "Đang xét duyệt");

  const renderTable = (data, includeApproveButton = false) => (
    <TableContainer component={Paper} sx={{ mt: 3 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell><strong>STT</strong></TableCell>
            <TableCell><strong>Ngày giờ hẹn</strong></TableCell>
            <TableCell><strong>Email người tạo</strong></TableCell>
            <TableCell><strong>Trạng thái</strong></TableCell>
            <TableCell><strong>ID Dịch vụ</strong></TableCell>
            {includeApproveButton && <TableCell><strong>Thao tác</strong></TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((item, index) => (
            <TableRow key={item._id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{formatDateTime(item.date, item.rawDate, item.rawTime)}</TableCell>
              <TableCell>{item.createdBy?.email || "Không có"}</TableCell>
              <TableCell>{item.status}</TableCell>
              <TableCell>{item.serviceID}</TableCell>
              {includeApproveButton && (
                <TableCell>
                  <Button
                    variant="contained"
                    color="success"
                    onClick={() => handleApproveClick(item._id)}
                  >
                    Duyệt lịch hẹn
                  </Button>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Danh sách cuộc hẹn ẩn danh
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <>
          <Typography variant="h6" gutterBottom>
            ⏳ Cuộc hẹn đang chờ xét duyệt
          </Typography>
          {pendingAppointments.length > 0 ? (
            renderTable(pendingAppointments, true)
          ) : (
            <Typography>Không có cuộc hẹn đang chờ.</Typography>
          )}

          <Typography variant="h6" gutterBottom sx={{ mt: 5 }}>
            📋 Các cuộc hẹn khác
          </Typography>
          {otherAppointments.length > 0 ? (
            renderTable(otherAppointments)
          ) : (
            <Typography>Không có cuộc hẹn nào khác.</Typography>
          )}
        </>
      )}

      {/* Dialog xác nhận duyệt */}
      <Dialog open={confirmDialog.open} onClose={handleCancel}>
        <DialogTitle>Xác nhận duyệt lịch hẹn</DialogTitle>
        <DialogContent>Bạn có chắc muốn duyệt lịch hẹn này?</DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>Hủy</Button>
          <Button onClick={handleConfirm} variant="contained" color="success">
            Duyệt
          </Button>
        </DialogActions>
      </Dialog>

      {/* Toast Notification */}
      <ToastContainer position="top-right" autoClose={3000} />
    </Container>
  );
};

export default AnonymousAppointments;
