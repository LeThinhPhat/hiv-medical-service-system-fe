import React, { useEffect, useState } from "react";
import medicalRecordService from "../../Services/DoctorService/medicalRecordService";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
} from "@mui/material";

const MedicalRecords = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const result = await medicalRecordService.getAllMedicalRecords();
        setRecords(result);
      } catch (err) {
        console.error("Không thể lấy danh sách bệnh án:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <Typography variant="h5" gutterBottom>
        Danh sách hồ sơ bệnh án
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 800 }} aria-label="medical record table">
            <TableHead>
              <TableRow>
                <TableCell>
                  <strong>ID</strong>
                </TableCell>
                <TableCell>
                  <strong>Patient ID</strong>
                </TableCell>
                <TableCell>
                  <strong>Diagnosis</strong>
                </TableCell>
                <TableCell>
                  <strong>Symptoms</strong>
                </TableCell>
                <TableCell>
                  <strong>Notes</strong>
                </TableCell>
                <TableCell>
                  <strong>Doctor Email</strong>
                </TableCell>
                <TableCell>
                  <strong>Created At</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {records.map((record) => (
                <TableRow key={record._id}>
                  <TableCell>{record._id}</TableCell>
                  <TableCell>{record.patientID}</TableCell>
                  <TableCell>{record.diagnosis}</TableCell>
                  <TableCell>{record.symptoms}</TableCell>
                  <TableCell>{record.clinicalNotes}</TableCell>
                  <TableCell>{record.createdBy?.email}</TableCell>
                  <TableCell>
                    {new Date(record.createdAt).toLocaleString("vi-VN")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
};

export default MedicalRecords;
