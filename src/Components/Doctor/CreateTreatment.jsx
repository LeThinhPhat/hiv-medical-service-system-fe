import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
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
  AgeGroup: "Nhóm tuổi",
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

    // Validation
    const hasInvalidInputs = testResults.some((result) => {
      if (result.test_type === "CD4Count") {
        const value = parseFloat(result.test_results);
        return (
          result.test_results === "" ||
          isNaN(value) ||
          value < 0 ||
          value > 10000
        );
      }
      if (result.test_type === "HIV_ViralLoad") {
        const value = parseFloat(result.test_results);
        return (
          result.test_results === "" ||
          isNaN(value) ||
          value < 0 ||
          value > 10000
        );
      }
      if (result.test_type === "LiverFunction") {
        const value = parseFloat(result.test_results);
        return (
          result.test_results === "" || isNaN(value) || value < 12 || value > 70
        );
      }
      if (["HIV_Antibody", "PregnancyTest"].includes(result.test_type)) {
        return !["Positive", "Negative"].includes(result.test_results);
      }
      if (result.test_type === "AgeGroup") {
        return !["Adult", "Child"].includes(result.test_results);
      }
      return result.test_results === "";
    });

    if (hasInvalidInputs) {
      toast.error(
        "Vui lòng nhập kết quả hợp lệ: CD4 Count và HIV Viral Load từ 0 đến 10000, Liver Function từ 12 đến 70, và các trường khác phải được chọn hoặc điền."
      );
      setSubmitting(false);
      return;
    }

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
      toast.success("Đã tạo treatment thành công!");
    } catch (error) {
      console.error("Lỗi khi tạo treatment:", error);
      toast.error(`Tạo treatment thất bại: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  // Render result field
  const renderResultField = (type, value, index) => {
    const handleChange = (e) =>
      handleTestResultChange(index, "test_results", e.target.value);

    if (["HIV_Antibody", "PregnancyTest"].includes(type)) {
      return (
        <select
          value={value}
          onChange={handleChange}
          className="w-full bg-white border border-teal-100 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600"
          disabled={isSubmitted}
          required
        >
          <option value="" disabled>
            Chọn kết quả
          </option>
          <option value="Positive">Positive</option>
          <option value="Negative">Negative</option>
        </select>
      );
    }

    if (type === "AgeGroup") {
      return (
        <select
          value={value}
          onChange={handleChange}
          className="w-full bg-white border border-teal-100 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600"
          disabled={isSubmitted}
          required
        >
          <option value="" disabled>
            Chọn nhóm tuổi
          </option>
          <option value="Adult">Adult</option>
          <option value="Child">Child</option>
        </select>
      );
    }

    return (
      <input
        type="number"
        value={value}
        onChange={handleChange}
        className="w-full bg-white border border-teal-100 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600"
        disabled={isSubmitted}
        required
      />
    );
  };

  return (
    <div className="Container mx-auto mt-10 px-4 mb-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 bg-white p-6 rounded-2xl shadow-lg">
          <h2 className="text-xl font-semibold text-teal-600 mb-4">
            Tạo điều trị
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Ghi chú */}
            <div>
              <label className="font-medium text-gray-800 mb-1 block">
                Ghi chú
              </label>
              {isSubmitted ? (
                <p className="text-gray-800 border p-2 rounded-lg bg-teal-50">
                  {note}
                </p>
              ) : (
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full bg-white border border-teal-100 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600"
                  rows="4"
                  required
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
                    <p className="text-gray-800 border p-2 rounded-lg bg-teal-50">
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
                    <p className="text-gray-800 border p-2 rounded-lg bg-teal-50">
                      {result.description}
                    </p>
                  ) : (
                    <input
                      type="text"
                      value={result.description}
                      onChange={(e) =>
                        handleTestResultChange(
                          index,
                          "description",
                          e.target.value
                        )
                      }
                      className="w-full bg-white border border-teal-100 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600"
                    />
                  )}
                </div>
              </div>
            ))}

            {/* Submit */}
            {!isSubmitted && (
              <div className="flex justify-end">
                <button
                  type="submit"
                  className={`flex items-center gap-2 bg-teal-600 text-white rounded-lg px-4 py-2 hover:bg-teal-700 transition-colors ${
                    submitting ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={submitting}
                >
                  {submitting ? (
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  ) : (
                    "Tạo Treatment"
                  )}
                </button>
              </div>
            )}
          </form>
        </div>

        {/* Gợi ý điều trị */}
        <div className="md:col-span-2 bg-white p-6 rounded-2xl shadow-lg h-fit">
          <h3 className="text-xl font-semibold text-teal-600 mb-4">
            Gợi ý điều trị
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
