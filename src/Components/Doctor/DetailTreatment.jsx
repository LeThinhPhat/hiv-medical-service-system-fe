// src/Components/Doctor/DetailTreatment.jsx

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import treatmentService from "../../Services/DoctorService/treatmentService";
import { Box, Typography, CircularProgress } from "@mui/material";

const DetailTreatment = () => {
  const { id } = useParams();
  const [treatment, setTreatment] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchTreatment = async () => {
      try {
        const response = await treatmentService.getTreatmentByID(id, token);
        setTreatment(response.data); // lấy từ response.data.data nếu cần
      } catch (error) {
        console.error("❌ Lỗi khi lấy treatment:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTreatment();
  }, [id, token]);

  if (loading) {
    return (
      <Box className="text-center mt-10">
        <CircularProgress />
        <Typography variant="body1">Đang tải chi tiết treatment...</Typography>
      </Box>
    );
  }

  if (!treatment) {
    return (
      <Typography className="text-red-500 mt-6 text-center">
        Không tìm thấy thông tin điều trị.
      </Typography>
    );
  }

  return (
    <Box className="max-w-xl mx-auto p-6 bg-white rounded shadow mt-6 space-y-4">
      <Typography variant="h5" className="text-blue-700 font-bold mb-2">
        📄 Chi tiết điều trị
      </Typography>

      <Typography>
        <strong>Mã Treatment:</strong> {treatment._id}
      </Typography>
      <Typography>
        <strong>Ngày điều trị:</strong>{" "}
        {new Date(treatment.treatmentDate).toLocaleString("vi-VN")}
      </Typography>
      <Typography>
        <strong>Ghi chú:</strong> {treatment.note}
      </Typography>
      <Typography>
        <strong>Trạng thái:</strong> {treatment.status}
      </Typography>
      <Typography>
        <strong>Người tạo:</strong> {treatment.createdBy?.email || "Không rõ"}
      </Typography>
      <Typography>
        <strong>Ngày tạo:</strong>{" "}
        {new Date(treatment.createdAt).toLocaleString("vi-VN")}
      </Typography>
      <Typography>
        <strong>Hồ sơ bệnh án:</strong> {treatment.medicalRecordID}
      </Typography>
      <Typography>
        <strong>Bác sĩ phụ trách:</strong>{" "}
        {treatment.doctorID?._id || "Không rõ"}
      </Typography>
    </Box>
  );
};

export default DetailTreatment;
