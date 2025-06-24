import React, { useState } from "react";
import { TextField, Button, Typography, Box } from "@mui/material";
import medicalRecordService from "../../Services/DoctorService/medicalRecordService";

const MedicalRecord = () => {
  const [formData, setFormData] = useState({
    patientID: "",
    diagnosis: "",
    symptoms: "",
    clinicalNotes: "",
    createdBy: "", // ID bác sĩ tạo bệnh án
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await medicalRecordService.createMedicalRecord(formData);
      console.log("Tạo thành công:", response);
      setMessage("✅ Tạo hồ sơ bệnh án thành công!");
      setFormData({
        patientID: "",
        diagnosis: "",
        symptoms: "",
        clinicalNotes: "",
        createdBy: "",
      });
    } catch (error) {
      setMessage("❌ Có lỗi xảy ra khi tạo hồ sơ.");
      console.error("Lỗi tạo hồ sơ:", error);
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 600,
        mx: "auto",
        mt: 4,
        p: 3,
        boxShadow: 3,
        borderRadius: 2,
        backgroundColor: "#fff",
      }}
    >
      <Typography variant="h5" gutterBottom>
        Tạo Hồ Sơ Bệnh Án
      </Typography>

      <form onSubmit={handleSubmit}>
        <TextField
          label="Mã bệnh nhân (patientID)"
          name="patientID"
          fullWidth
          margin="normal"
          value={formData.patientID}
          onChange={handleChange}
          required
        />

        <TextField
          label="Chẩn đoán (diagnosis)"
          name="diagnosis"
          fullWidth
          margin="normal"
          value={formData.diagnosis}
          onChange={handleChange}
          required
        />

        <TextField
          label="Triệu chứng (symptoms)"
          name="symptoms"
          fullWidth
          margin="normal"
          value={formData.symptoms}
          onChange={handleChange}
          required
        />

        <TextField
          label="Ghi chú lâm sàng (clinicalNotes)"
          name="clinicalNotes"
          fullWidth
          margin="normal"
          multiline
          rows={4}
          value={formData.clinicalNotes}
          onChange={handleChange}
          required
        />

        <TextField
          label="Mã bác sĩ tạo (createdBy)"
          name="createdBy"
          fullWidth
          margin="normal"
          value={formData.createdBy}
          onChange={handleChange}
          required
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
        >
          Tạo Hồ Sơ
        </Button>
      </form>

      {message && (
        <Typography
          variant="body1"
          sx={{
            mt: 2,
            color: message.includes("thành công") ? "green" : "red",
          }}
        >
          {message}
        </Typography>
      )}
    </Box>
  );
};

export default MedicalRecord;
