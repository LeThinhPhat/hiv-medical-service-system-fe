// src/Components/Doctor/CreateTreatment.jsx
import React, { useState } from "react";
import { Button, TextField, Box } from "@mui/material";
import treatmentService from "../../Services/DoctorService/treatmentService";

const CreateTreatment = ({ medicalRecordID, onSuccess }) => {
  const [treatmentData, setTreatmentData] = useState({
    note: "",
    treatmentDate: new Date().toISOString().slice(0, 16),
  });

  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const treatmentPayload = {
        note: treatmentData.note,
        treatmentDate: new Date(treatmentData.treatmentDate).toISOString(),
        medicalRecordID,
      };

      await treatmentService.createTreatment(treatmentPayload, token);
      alert("✅ Tạo treatment thành công");
      if (onSuccess) onSuccess(); // callback để reload data
    } catch (error) {
      console.error("❌ Lỗi khi tạo treatment:", error);
      alert("❌ Lỗi khi tạo treatment");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-4">
      <TextField
        label="Ghi chú (note)"
        name="note"
        value={treatmentData.note}
        onChange={(e) =>
          setTreatmentData({
            ...treatmentData,
            note: e.target.value,
          })
        }
        fullWidth
        required
      />

      <TextField
        label="Ngày điều trị"
        type="datetime-local"
        fullWidth
        required
        value={treatmentData.treatmentDate}
        onChange={(e) =>
          setTreatmentData({
            ...treatmentData,
            treatmentDate: e.target.value,
          })
        }
        InputLabelProps={{
          shrink: true,
        }}
      />

      <Box display="flex" justifyContent="flex-end">
        <Button variant="contained" type="submit" color="primary">
          ✅ Xác nhận tạo Treatment
        </Button>
      </Box>
    </form>
  );
};

export default CreateTreatment;
