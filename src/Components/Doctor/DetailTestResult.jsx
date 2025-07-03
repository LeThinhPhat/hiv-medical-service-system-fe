import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Typography,
  Box,
  CircularProgress,
  Paper,
  Divider,
} from "@mui/material";
import testResultsService from "../../Services//DoctorService/testResultService";

const DetailTestResult = () => {
  const { resultID } = useParams();
  const token = localStorage.getItem("token");

  const [testResult, setTestResult] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchResult = async () => {
    try {
      const response = await testResultsService.getTestResultsByTreatmentID(
        resultID,
        token
      );
      setTestResult(response.data);
    } catch (error) {
      console.error("❌ Lỗi khi lấy chi tiết test result:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResult();
  }, [resultID]);

  if (loading) {
    return (
      <Box className="flex justify-center mt-10">
        <CircularProgress />
      </Box>
    );
  }

  if (!testResult) {
    return (
      <p className="text-center mt-8 text-red-600">
        Không tìm thấy kết quả xét nghiệm.
      </p>
    );
  }

  return (
    <div className="max-w-xl mx-auto mt-8 p-6">
      <Paper elevation={3} className="p-6">
        <Typography variant="h5" className="text-blue-700 font-bold mb-4">
          📄 Chi tiết kết quả xét nghiệm
        </Typography>

        <Divider className="mb-4" />

        <Typography>
          <strong>Mã kết quả:</strong> {testResult._id}
        </Typography>
        <Typography>
          <strong>Mã điều trị:</strong> {testResult.treatmentID}
        </Typography>
        <Typography>
          <strong>Loại xét nghiệm:</strong> {testResult.test_type}
        </Typography>
        <Typography>
          <strong>Kết quả:</strong> {testResult.test_results}
        </Typography>
        <Typography>
          <strong>Mô tả:</strong> {testResult.description}
        </Typography>
        <Typography>
          <strong>Trạng thái:</strong> {testResult.status}
        </Typography>
        <Typography>
          <strong>Ngày xét nghiệm:</strong>{" "}
          {new Date(testResult.test_date).toLocaleString("vi-VN")}
        </Typography>
        <Typography>
          <strong>Người tạo:</strong> {testResult.createdBy?.email}
        </Typography>
        <Typography>
          <strong>Ngày tạo:</strong>{" "}
          {new Date(testResult.createdAt).toLocaleString("vi-VN")}
        </Typography>
      </Paper>
    </div>
  );
};

export default DetailTestResult;
