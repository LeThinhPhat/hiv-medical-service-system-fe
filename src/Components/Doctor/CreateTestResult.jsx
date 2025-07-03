// import React, { useState } from "react";
// import {
//   TextField,
//   Button,
//   Box,
//   Typography,
//   CircularProgress,
// } from "@mui/material";
// import { useParams } from "react-router-dom";
// import testResultsService from "../../Services/DoctorService/createTestResultService";

// const CreateTestResult = () => {
//   const { treatmentID } = useParams(); // Nhận từ URL nếu có
//   const token = localStorage.getItem("token");

//   const [form, setForm] = useState({
//     treatmentID: treatmentID || "",
//     test_type: "",
//     test_results: "",
//     description: "",
//   });

//   const [submitting, setSubmitting] = useState(false);

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSubmitting(true);
//     try {
//       await testResultsService.createTestResult(form, token);
//       alert("✅ Tạo kết quả xét nghiệm thành công");
//       setForm({
//         treatmentID: treatmentID || "",
//         test_type: "",
//         test_results: "",
//         description: "",
//       });
//     } catch (error) {
//       alert("❌ Lỗi khi tạo test result");
//       console.error(error);
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <div className="max-w-lg mx-auto mt-8 p-6 bg-white shadow rounded">
//       <Typography variant="h5" className="mb-4 text-blue-700">
//         🧪 Tạo kết quả xét nghiệm
//       </Typography>

//       <form onSubmit={handleSubmit} className="space-y-4">
//         <TextField
//           label="Mã điều trị (Treatment ID)"
//           name="treatmentID"
//           value={form.treatmentID}
//           onChange={handleChange}
//           fullWidth
//           required
//         />
//         <TextField
//           label="Loại xét nghiệm (VD: CD4Count)"
//           name="test_type"
//           value={form.test_type}
//           onChange={handleChange}
//           fullWidth
//           required
//         />
//         <TextField
//           label="Kết quả xét nghiệm"
//           name="test_results"
//           value={form.test_results}
//           onChange={handleChange}
//           fullWidth
//           required
//         />
//         <TextField
//           label="Mô tả"
//           name="description"
//           value={form.description}
//           onChange={handleChange}
//           fullWidth
//           multiline
//           minRows={2}
//         />

//         <Box display="flex" justifyContent="flex-end">
//           <Button
//             variant="contained"
//             color="primary"
//             type="submit"
//             disabled={submitting}
//           >
//             {submitting ? (
//               <CircularProgress size={24} color="inherit" />
//             ) : (
//               "✅ Tạo Test Result"
//             )}
//           </Button>
//         </Box>
//       </form>
//     </div>
//   );
// };

// export default CreateTestResult;

import React, { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useParams } from "react-router-dom";
import testResultsService from "../../Services/DoctorService/testResultService";

const CreateTestResult = ({ treatmentID: propTreatmentID }) => {
  const { treatmentID: paramID } = useParams(); // fallback nếu gọi qua route
  const token = localStorage.getItem("token");

  const [form, setForm] = useState({
    treatmentID: propTreatmentID || paramID || "",
    test_type: "",
    test_results: "",
    description: "",
  });

  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await testResultsService.createTestResult(form, token);
      alert("✅ Tạo kết quả xét nghiệm thành công");
      setForm({
        treatmentID: propTreatmentID || paramID || "",
        test_type: "",
        test_results: "",
        description: "",
      });
    } catch (error) {
      alert("❌ Lỗi khi tạo test result");
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-6 p-4 bg-gray-50 border rounded">
      <form onSubmit={handleSubmit} className="space-y-4">
        <TextField
          label="Mã điều trị (Treatment ID)"
          name="treatmentID"
          value={form.treatmentID}
          onChange={handleChange}
          fullWidth
          required
          disabled // không cho chỉnh nếu nhận từ props
        />

        <TextField
          label="Loại xét nghiệm (VD: CD4Count)"
          name="test_type"
          value={form.test_type}
          onChange={handleChange}
          fullWidth
          required
        />

        <TextField
          label="Kết quả xét nghiệm"
          name="test_results"
          value={form.test_results}
          onChange={handleChange}
          fullWidth
          required
        />

        <TextField
          label="Mô tả"
          name="description"
          value={form.description}
          onChange={handleChange}
          fullWidth
          multiline
          minRows={2}
        />

        <Box display="flex" justifyContent="flex-end">
          <Button
            variant="contained"
            color="secondary"
            type="submit"
            disabled={submitting}
          >
            {submitting ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "✅ Tạo Test Result"
            )}
          </Button>
        </Box>
      </form>
    </div>
  );
};

export default CreateTestResult;
