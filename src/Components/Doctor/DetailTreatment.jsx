// src/Components/Doctor/DetailTreatment.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import treatmentService from "../../Services/DoctorService/treatmentService";
import DetailPersonalARV from "./DetailPersonalARV"; // 👈 Thêm dòng này
import {
  Box,
  Typography,
  CircularProgress,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import moment from "moment";

const DetailTreatment = () => {
  const { id } = useParams();
  const [treatment, setTreatment] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchTreatment = async () => {
      try {
        const response = await treatmentService.getTreatmentById(id, token);
        setTreatment(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy treatment:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTreatment();
  }, [id, token]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  if (!treatment) {
    return (
      <Typography color="error" align="center" mt={5}>
        Không tìm thấy thông tin điều trị.
      </Typography>
    );
  }

  return (
    <>
      <Paper elevation={3} sx={{ p: 4, maxWidth: 800, mx: "auto", mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Chi tiết điều trị
        </Typography>
        <Divider sx={{ mb: 2 }} />

        <Typography>
          <strong>Ngày điều trị:</strong>{" "}
          {moment(treatment.treatmentDate).format("DD/MM/YYYY HH:mm")}
        </Typography>

        <Typography>
          <strong>Trạng thái:</strong> {treatment.status}
        </Typography>

        <Typography>
          <strong>Ghi chú:</strong> {treatment.note}
        </Typography>

        <Typography>
          <strong>Mã hồ sơ y tế:</strong> {treatment.medicalRecordID}
        </Typography>

        <Typography>
          <strong>Bác sĩ ID:</strong> {treatment.doctorID?._id}
        </Typography>

        <Typography>
          <strong>Người tạo:</strong> {treatment.createdBy?.email}
        </Typography>

        <Typography sx={{ mt: 2 }} variant="h6">
          Kết quả xét nghiệm
        </Typography>

        <List>
          {treatment.testResultID.map((test, index) => (
            <ListItem key={test._id}>
              <ListItemText
                primary={`Lần ${index + 1}`}
                secondary={moment(test.test_date).format("DD/MM/YYYY HH:mm")}
              />
            </ListItem>
          ))}
        </List>

        <Typography sx={{ mt: 2 }} variant="body2" color="text.secondary">
          Tạo lúc: {moment(treatment.createdAt).format("DD/MM/YYYY HH:mm")}{" "}
          <br />
          Cập nhật lúc: {moment(treatment.updatedAt).format("DD/MM/YYYY HH:mm")}
        </Typography>
      </Paper>

      {/* 👉 Nếu có prescribedRegimentID thì render DetailPersonalARV */}
      {treatment.prescribedRegimentID?._id && (
        <DetailPersonalARV
          regimenId={treatment.prescribedRegimentID._id}
          token={token}
        />
      )}
    </>
  );
};

export default DetailTreatment;
