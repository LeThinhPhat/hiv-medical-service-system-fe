import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Typography,
  Box,
  Paper,
  CircularProgress,
  Divider,
  Chip,
  Container,
} from "@mui/material";
import { Toaster, toast } from "react-hot-toast";
import moment from "moment";
import scheduleManagerService from "../../Services/ManagerService/scheduleManagerService";

const DetailSchedule = () => {
  const { id } = useParams();
  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const data = await scheduleManagerService.getScheduleById(id, token);
        setSchedule(data);
      } catch (error) {
        console.error("Lỗi lấy chi tiết lịch:", error);
        toast.error(`Lỗi lấy chi tiết lịch: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id, token]);

  return (
    <Container maxWidth="md" sx={{ mt: 6, mb: 6 }}>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          success: {
            style: {
              background: "#2dd4bf",
              color: "#fff",
            },
          },
          error: {
            style: {
              background: "#f87171",
              color: "#fff",
            },
          },
        }}
      />
      <Box sx={{ bgcolor: "white", borderRadius: 3, boxShadow: 3, p: 4 }}>
        <Typography
          variant="h4"
          sx={{ color: "#0f766e", fontWeight: "bold", mb: 4 }}
        >
          Chi Tiết Lịch Làm Việc
        </Typography>

        {loading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight={200}
          >
            <CircularProgress sx={{ color: "#0f766e" }} />
          </Box>
        ) : !schedule ? (
          <Box textAlign="center" py={4}>
            <Typography variant="h6" color="error.main">
              Không tìm thấy lịch làm việc.
            </Typography>
          </Box>
        ) : (
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 2,
              bgcolor: "#f0fdfa",
              border: "1px solid #ccfbf1",
            }}
          >
            <Box display="flex" flexDirection="column" gap={2}>
              <Box display="flex" alignItems="center" gap={2}>
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: "medium", color: "#1f2937", width: 120 }}
                >
                  Mã bác sĩ:
                </Typography>
                <Typography variant="body1" sx={{ color: "#374151" }}>
                  {schedule.doctorID}
                </Typography>
              </Box>
              <Divider sx={{ bgcolor: "#ccfbf1" }} />
              <Box display="flex" alignItems="center" gap={2}>
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: "medium", color: "#1f2937", width: 120 }}
                >
                  Ngày:
                </Typography>
                <Typography variant="body1" sx={{ color: "#374151" }}>
                  {moment(schedule.date).format("DD/MM/YYYY")}
                </Typography>
              </Box>
              <Divider sx={{ bgcolor: "#ccfbf1" }} />
              <Box display="flex" alignItems="center" gap={2}>
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: "medium", color: "#1f2937", width: 120 }}
                >
                  Ca làm:
                </Typography>
                <Typography variant="body1" sx={{ color: "#374151" }}>
                  {schedule.shiftName}
                </Typography>
              </Box>
              <Divider sx={{ bgcolor: "#ccfbf1" }} />
              <Box display="flex" alignItems="center" gap={2}>
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: "medium", color: "#1f2937", width: 120 }}
                >
                  Trạng thái:
                </Typography>
                <Chip
                  label={schedule.status}
                  sx={{
                    bgcolor: "#f59e0b",
                    color: "white",
                    fontWeight: "medium",
                    borderRadius: 1,
                  }}
                  size="small"
                />
              </Box>
              <Divider sx={{ bgcolor: "#ccfbf1" }} />
              <Box display="flex" alignItems="center" gap={2}>
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: "medium", color: "#1f2937", width: 120 }}
                >
                  Xác nhận:
                </Typography>
                <Typography variant="body1" sx={{ color: "#374151" }}>
                  {schedule.isConfirmed ? "Đã xác nhận" : "Chưa xác nhận"}
                </Typography>
              </Box>
              <Divider sx={{ bgcolor: "#ccfbf1" }} />
              <Box display="flex" alignItems="center" gap={2}>
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: "medium", color: "#1f2937", width: 120 }}
                >
                  Người tạo:
                </Typography>
                <Typography variant="body1" sx={{ color: "#374151" }}>
                  {schedule.createdBy?.email || "Không rõ"}
                </Typography>
              </Box>
            </Box>
          </Paper>
        )}
      </Box>
    </Container>
  );
};

export default DetailSchedule;
