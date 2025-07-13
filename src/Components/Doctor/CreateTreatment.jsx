import React, { useState } from "react";
import { useParams } from "react-router-dom";
import {
  TextField,
  Button,
  CircularProgress,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import treatmentService from "../../Services/DoctorService/treatmentService";
import SuggestTreatment from "./SuggestTreatment";

const defaultTestResults = [
  { test_type: "CD4Count", test_results: "", description: "" },
  { test_type: "HIV_ViralLoad", test_results: "", description: "" },
  { test_type: "HIV_Antibody", test_results: "", description: "" },
  { test_type: "PregnancyTest", test_results: "", description: "" },
  { test_type: "LiverFunction", test_results: "", description: "" },
  { test_type: "AgeGroup", test_results: "", description: "" },
];

const TestTypeLabels = {
  CD4Count: "CD4 Count",
  HIV_ViralLoad: "HIV Viral Load",
  HIV_Antibody: "HIV Antibody",
  PregnancyTest: "Pregnancy Test",
  LiverFunction: "Liver Function",
  AgeGroup: "Age Group",
};

const CreateTreatment = () => {
  const { recordID } = useParams();
  const token = localStorage.getItem("token");

  const [note, setNote] = useState("");
  const [testResults, setTestResults] = useState(defaultTestResults);
  const [submitting, setSubmitting] = useState(false);
  const [treatmentID, setTreatmentID] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleTestResultChange = (index, field, value) => {
    const updated = [...testResults];
    updated[index][field] = value;
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
      setIsSubmitted(true);
      alert("✅ Tạo treatment thành công");
    } catch (error) {
      console.error("❌ Lỗi khi tạo treatment:", error);
      alert("❌ Tạo treatment thất bại");
    } finally {
      setSubmitting(false);
    }
  };

  // Option dropdown
  const renderResultField = (type, value, index) => {
    const handleChange = (e) =>
      handleTestResultChange(index, "test_results", e.target.value);

    if (["HIV_Antibody", "PregnancyTest"].includes(type)) {
      return (
        <FormControl fullWidth>
          <InputLabel>Kết quả</InputLabel>
          <Select
            value={value}
            onChange={handleChange}
            label="Kết quả"
            required
          >
            <MenuItem value="Positive">Positive</MenuItem>
            <MenuItem value="Negative">Negative</MenuItem>
          </Select>
        </FormControl>
      );
    }

    if (type === "AgeGroup") {
      return (
        <FormControl fullWidth>
          <InputLabel>Nhóm tuổi</InputLabel>
          <Select
            value={value}
            onChange={handleChange}
            label="Nhóm tuổi"
            required
          >
            <MenuItem value="Adult">Adult</MenuItem>
            <MenuItem value="Child">Child</MenuItem>
          </Select>
        </FormControl>
      );
    }

    return (
      <TextField
        label="Kết quả"
        value={value}
        onChange={(e) =>
          handleTestResultChange(index, "test_results", e.target.value)
        }
        fullWidth
        required
        variant="outlined"
      />
    );
  };

  return (
    <div className="container mx-auto mt-10 px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold text-blue-700 mb-4">
            Tạo điều trị
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Ghi chú */}
            <div>
              <label className="font-medium text-gray-800 mb-1 block">
                Ghi chú (Note)
              </label>
              {isSubmitted ? (
                <p className="text-gray-800 border p-2 rounded bg-gray-50">
                  {note}
                </p>
              ) : (
                <TextField
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  fullWidth
                  required
                  variant="outlined"
                  margin="normal"
                />
              )}
            </div>

            {/* Xét nghiệm */}
            <h3 className="text-lg font-medium text-gray-800">
              🧪 Kết quả xét nghiệm
            </h3>

            {testResults.map((result, index) => (
              <div
                key={index}
                className="grid grid-cols-12 gap-4 items-center mb-2"
              >
                {/* Loại xét nghiệm */}
                <div className="col-span-3">
                  <p className="text-gray-700 font-medium">
                    {TestTypeLabels[result.test_type] || result.test_type}
                  </p>
                </div>

                {/* Kết quả */}
                <div className="col-span-4">
                  {isSubmitted ? (
                    <p className="text-gray-800 border p-2 rounded bg-gray-50">
                      {result.test_results}
                    </p>
                  ) : (
                    renderResultField(
                      result.test_type,
                      result.test_results,
                      index
                    )
                  )}
                </div>

                {/* Mô tả */}
                <div className="col-span-5">
                  {isSubmitted ? (
                    <p className="text-gray-800 border p-2 rounded bg-gray-50">
                      {result.description}
                    </p>
                  ) : (
                    <TextField
                      label="Mô tả"
                      value={result.description}
                      onChange={(e) =>
                        handleTestResultChange(
                          index,
                          "description",
                          e.target.value
                        )
                      }
                      fullWidth
                      variant="outlined"
                    />
                  )}
                </div>
              </div>
            ))}

            {/* Submit */}
            {!isSubmitted && (
              <div className="flex justify-end">
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={submitting}
                >
                  {submitting ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "✅ Tạo Treatment"
                  )}
                </Button>
              </div>
            )}
          </form>
        </div>

        {/* Gợi ý điều trị */}
        <div className="md:col-span-2 bg-gray-100 p-6 rounded shadow h-fit">
          <h3 className="text-xl font-semibold text-green-600 mb-4">
            💡 Gợi ý điều trị
          </h3>
          {treatmentID ? (
            <SuggestTreatment treatmentID={treatmentID} token={token} />
          ) : (
            <p className="text-gray-500 italic">
              Vui lòng tạo điều trị để xem gợi ý...
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateTreatment;
