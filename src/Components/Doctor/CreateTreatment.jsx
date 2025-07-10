import React, { useState } from "react";
import { useParams } from "react-router-dom";
import {
  TextField,
  Button,
  Box,
  Typography,
  CircularProgress,
  IconButton,
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import treatmentService from "../../Services/DoctorService/treatmentService";
import SuggestTreatment from "./SuggestTreatment"; // ✅ Gọi component gợi ý

const CreateTreatment = () => {
  const { recordID } = useParams();
  const token = localStorage.getItem("token");

  const [note, setNote] = useState("");
  const [testResults, setTestResults] = useState([
    { test_type: "", test_results: "", description: "" },
  ]);
  const [submitting, setSubmitting] = useState(false);
  const [treatmentID, setTreatmentID] = useState(null); // ✅ để truyền qua SuggestTreatment

  const handleTestResultChange = (index, field, value) => {
    const updated = [...testResults];
    updated[index][field] = value;
    setTestResults(updated);
  };

  const addTestResult = () => {
    setTestResults([
      ...testResults,
      { test_type: "", test_results: "", description: "" },
    ]);
  };

  const removeTestResult = (index) => {
    const updated = [...testResults];
    updated.splice(index, 1);
    setTestResults(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      medicalRecordID: recordID,
      note,
      testResults,
    };

    try {
      const res = await treatmentService.createTreatment(token, payload);
      const createdID = res.data?._id || res.data?.data?._id;

      if (!createdID) {
        throw new Error("Không tìm thấy treatmentID");
      }

      setTreatmentID(createdID);
      alert("✅ Tạo treatment thành công");

      // Reset form nếu muốn
      setNote("");
      setTestResults([{ test_type: "", test_results: "", description: "" }]);
    } catch (error) {
      console.error("❌ Lỗi khi tạo treatment:", error);
      alert("❌ Tạo treatment thất bại");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-8 p-6 bg-white shadow rounded">
      <Typography variant="h5" className="mb-4 text-blue-700">
        ➕ Tạo điều trị mới
      </Typography>

      <form onSubmit={handleSubmit} className="space-y-6">
        <TextField
          label="Ghi chú (note)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          fullWidth
          required
        />

        <Typography variant="h6" className="text-gray-800">
          🧪 Kết quả xét nghiệm
        </Typography>

        {testResults.map((result, index) => (
          <Box key={index} className="grid grid-cols-12 gap-4 items-center">
            <TextField
              label="Loại xét nghiệm"
              value={result.test_type}
              onChange={(e) =>
                handleTestResultChange(index, "test_type", e.target.value)
              }
              className="col-span-3"
              required
            />
            <TextField
              label="Kết quả"
              value={result.test_results}
              onChange={(e) =>
                handleTestResultChange(index, "test_results", e.target.value)
              }
              className="col-span-3"
              required
            />
            <TextField
              label="Mô tả"
              value={result.description}
              onChange={(e) =>
                handleTestResultChange(index, "description", e.target.value)
              }
              className="col-span-5"
            />
            <IconButton onClick={() => removeTestResult(index)}>
              <Delete color="error" />
            </IconButton>
          </Box>
        ))}

        <Button
          startIcon={<Add />}
          onClick={addTestResult}
          variant="outlined"
          color="primary"
        >
          Thêm xét nghiệm
        </Button>

        <Box display="flex" justifyContent="flex-end">
          <Button
            variant="contained"
            color="primary"
            type="submit"
            disabled={submitting}
          >
            {submitting ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "✅ Tạo Treatment"
            )}
          </Button>
        </Box>
      </form>

      {/* ✅ Hiển thị gợi ý nếu có treatmentID */}
      {treatmentID && (
        <SuggestTreatment treatmentID={treatmentID} token={token} />
      )}
    </div>
  );
};

export default CreateTreatment;
