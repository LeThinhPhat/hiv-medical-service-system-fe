import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { TextField, Button, CircularProgress, IconButton } from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import treatmentService from "../../Services/DoctorService/treatmentService";
import SuggestTreatment from "./SuggestTreatment";

const CreateTreatment = () => {
  const { recordID } = useParams();
  const token = localStorage.getItem("token");

  const [note, setNote] = useState("");
  const [testResults, setTestResults] = useState([
    { test_type: "", test_results: "", description: "" },
  ]);
  const [submitting, setSubmitting] = useState(false);
  const [treatmentID, setTreatmentID] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

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
      setIsSubmitted(true);
      alert("✅ Tạo treatment thành công");
    } catch (error) {
      console.error("❌ Lỗi khi tạo treatment:", error);
      alert("❌ Tạo treatment thất bại");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto mt-10 px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 🔹 Form nhỏ hơn */}
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
                {isSubmitted ? (
                  <>
                    <div className="col-span-4">
                      <p className="text-gray-700">{result.test_type}</p>
                    </div>
                    <div className="col-span-4">
                      <p className="text-gray-700">{result.test_results}</p>
                    </div>
                    <div className="col-span-4">
                      <p className="text-gray-700">{result.description}</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="col-span-4">
                      <TextField
                        label="Loại xét nghiệm"
                        value={result.test_type}
                        onChange={(e) =>
                          handleTestResultChange(
                            index,
                            "test_type",
                            e.target.value
                          )
                        }
                        fullWidth
                        required
                        variant="outlined"
                      />
                    </div>
                    <div className="col-span-4">
                      <TextField
                        label="Kết quả"
                        value={result.test_results}
                        onChange={(e) =>
                          handleTestResultChange(
                            index,
                            "test_results",
                            e.target.value
                          )
                        }
                        fullWidth
                        required
                        variant="outlined"
                      />
                    </div>
                    <div className="col-span-3">
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
                    </div>
                    <div className="col-span-1">
                      <IconButton onClick={() => removeTestResult(index)}>
                        <Delete color="error" />
                      </IconButton>
                    </div>
                  </>
                )}
              </div>
            ))}

            {/* Nút Thêm và Submit */}
            {!isSubmitted && (
              <>
                <Button
                  startIcon={<Add />}
                  onClick={addTestResult}
                  variant="outlined"
                  color="primary"
                >
                  Thêm xét nghiệm
                </Button>

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
              </>
            )}
          </form>
        </div>

        {/* 🔹 Gợi ý điều trị lớn hơn */}
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
