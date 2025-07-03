// import React, { useState } from "react";
// import { useParams } from "react-router-dom";
// import {
//   TextField,
//   Button,
//   Box,
//   Typography,
//   CircularProgress,
// } from "@mui/material";
// import treatmentService from "../../Services/DoctorService/treatmentService";
// import CreateTestResult from "./CreateTestResult";

// const CreateTreatment = () => {
//   const { recordID } = useParams();
//   const token = localStorage.getItem("token");

//   const [treatmentData, setTreatmentData] = useState({
//     note: "",
//     treatmentDate: new Date().toISOString().slice(0, 16),
//   });
//   const [submitting, setSubmitting] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSubmitting(true);

//     try {
//       const treatmentPayload = {
//         note: treatmentData.note,
//         treatmentDate: new Date(treatmentData.treatmentDate).toISOString(),
//         medicalRecordID: recordID,
//       };

//       await treatmentService.createTreatment(treatmentPayload, token);
//       alert("✅ Tạo treatment thành công");

//       // Reset form để tạo tiếp nếu muốn
//       setTreatmentData({
//         note: "",
//         treatmentDate: new Date().toISOString().slice(0, 16),
//       });
//     } catch (error) {
//       console.error("❌ Lỗi khi tạo treatment:", error);
//       alert("❌ Lỗi khi tạo treatment");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <div className="max-w-lg mx-auto mt-8 p-6 bg-white shadow rounded">
//       <Typography variant="h5" className="mb-4 text-blue-700">
//         ➕ Tạo điều trị mới
//       </Typography>

//       <form onSubmit={handleSubmit} className="space-y-4">
//         <TextField
//           label="Ghi chú (note)"
//           name="note"
//           value={treatmentData.note}
//           onChange={(e) =>
//             setTreatmentData({ ...treatmentData, note: e.target.value })
//           }
//           fullWidth
//           required
//         />

//         <TextField
//           label="Ngày điều trị"
//           type="datetime-local"
//           value={treatmentData.treatmentDate}
//           onChange={(e) =>
//             setTreatmentData({
//               ...treatmentData,
//               treatmentDate: e.target.value,
//             })
//           }
//           fullWidth
//           required
//           InputLabelProps={{
//             shrink: true,
//           }}
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
//               "✅ Tạo Treatment"
//             )}
//           </Button>
//         </Box>
//       </form>
//       <CreateTestResult />
//     </div>
//   );
// };

// export default CreateTreatment;

import React, { useState } from "react";
import { useParams } from "react-router-dom";
import {
  TextField,
  Button,
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";
import treatmentService from "../../Services/DoctorService/treatmentService";
import CreateTestResult from "./CreateTestResult";

const CreateTreatment = () => {
  const { recordID } = useParams();
  const token = localStorage.getItem("token");

  const [treatmentData, setTreatmentData] = useState({
    note: "",
    treatmentDate: new Date().toISOString().slice(0, 16),
  });
  const [submitting, setSubmitting] = useState(false);
  const [newTreatmentID, setNewTreatmentID] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const treatmentPayload = {
        note: treatmentData.note,
        treatmentDate: new Date(treatmentData.treatmentDate).toISOString(),
        medicalRecordID: recordID,
      };

      const res = await treatmentService.createTreatment(
        treatmentPayload,
        token
      );
      const createdTreatment = res.data || res;

      setNewTreatmentID(createdTreatment._id);

      alert("✅ Tạo treatment thành công");

      setTreatmentData({
        note: "",
        treatmentDate: new Date().toISOString().slice(0, 16),
      });
    } catch (error) {
      console.error("❌ Lỗi khi tạo treatment:", error);
      alert("❌ Lỗi khi tạo treatment");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-8 p-6 bg-white shadow rounded">
      <Typography variant="h5" className="mb-4 text-blue-700">
        ➕ Tạo điều trị mới
      </Typography>

      <form onSubmit={handleSubmit} className="space-y-4">
        <TextField
          label="Ghi chú (note)"
          name="note"
          value={treatmentData.note}
          onChange={(e) =>
            setTreatmentData({ ...treatmentData, note: e.target.value })
          }
          fullWidth
          required
        />

        <TextField
          label="Ngày điều trị"
          type="datetime-local"
          value={treatmentData.treatmentDate}
          onChange={(e) =>
            setTreatmentData({
              ...treatmentData,
              treatmentDate: e.target.value,
            })
          }
          fullWidth
          required
          InputLabelProps={{
            shrink: true,
          }}
        />

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

      {newTreatmentID && (
        <div className="mt-8">
          <Typography variant="h6" className="text-green-700 mb-2">
            🧪 Nhập kết quả xét nghiệm cho treatment vừa tạo:
          </Typography>
          <CreateTestResult treatmentID={newTreatmentID} />
        </div>
      )}
    </div>
  );
};

export default CreateTreatment;
