// Đã lấy được appointment

// import React, { useEffect, useState } from "react";
// import { Toaster, toast } from "react-hot-toast";
// import personalARVService from "../../Services/DoctorService/personalARVService";
// import treatmentService from "../../Services/DoctorService/treatmentService";
// import VisibilityIcon from "@mui/icons-material/Visibility";
// import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
// import SaveIcon from "@mui/icons-material/Save";

// const SuggestTreatment = ({ treatmentID, token, appointmentId }) => {
//   const [regimens, setRegimens] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [customRegimens, setCustomRegimens] = useState([]);
//   const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
//   const [selectedRegimenId, setSelectedRegimenId] = useState(null);
//   const [saving, setSaving] = useState(false);
//   const [showCriteria, setShowCriteria] = useState({});
//   const [isLocked, setIsLocked] = useState(false);
//   const [showFollowUpField, setShowFollowUpField] = useState(false);
//   const [followUpDate, setFollowUpDate] = useState("");

//   useEffect(() => {
//     const fetchSuggestion = async () => {
//       setLoading(true);
//       setError("");

//       try {
//         const res = await personalARVService.suggestRegimen(token, treatmentID);
//         if (Array.isArray(res.data)) {
//           setRegimens(res.data);
//           const initial = res.data.map((regimen) => ({
//             _id: regimen._id,
//             customDrugs: regimen.drugs.map((d) => ({
//               drugId: d.drugId._id,
//               genericName: d.drugId.genericName,
//               manufacturer: d.drugId.manufacturer,
//               dosage: parseFloat(d.dosage.replace("mg", "")) || 0,
//               frequency: Array.isArray(d.frequency)
//                 ? parseInt(d.frequency[0]) || 1
//                 : 1,
//             })),
//           }));
//           setCustomRegimens(initial);
//           setShowCriteria(
//             res.data.reduce((acc, regimen) => {
//               acc[regimen._id] = false;
//               return acc;
//             }, {})
//           );
//         }
//       } catch (err) {
//         setError("Không thể lấy gợi ý phác đồ.");
//         toast.error("Không thể lấy gợi ý phác đồ.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (treatmentID && token) {
//       fetchSuggestion();
//     }
//   }, [treatmentID, token]);

//   const handleDosageChange = (regimenId, index, value) => {
//     const updated = [...customRegimens];
//     const regimen = updated.find((r) => r._id === regimenId);
//     if (regimen) {
//       regimen.customDrugs[index].dosage = parseFloat(value) || "";
//       setCustomRegimens(updated);
//     }
//   };

//   const handleFrequencyChange = (regimenId, index, value) => {
//     const updated = [...customRegimens];
//     const regimen = updated.find((r) => r._id === regimenId);
//     if (regimen) {
//       regimen.customDrugs[index].frequency = parseInt(value) || "";
//       setCustomRegimens(updated);
//     }
//   };

//   const handleToggleCriteria = (regimenId) => {
//     setShowCriteria((prev) => ({
//       ...prev,
//       [regimenId]: !prev[regimenId],
//     }));
//   };

//   const handleOpenConfirmDialog = (regimenId) => {
//     setSelectedRegimenId(regimenId);
//     setOpenConfirmDialog(true);
//   };

//   const handleCloseConfirmDialog = () => {
//     setOpenConfirmDialog(false);
//     setSelectedRegimenId(null);
//   };

//   const handleSaveRegimen = async () => {
//     const regimen = customRegimens.find((r) => r._id === selectedRegimenId);
//     if (!regimen) {
//       toast.error("Phác đồ không hợp lệ.");
//       return;
//     }

//     const invalid = regimen.customDrugs.some(
//       (d) =>
//         d.dosage < 10 || d.dosage > 1000 || d.frequency < 1 || d.frequency > 6
//     );
//     if (invalid) {
//       toast.error("Liều lượng phải từ 10–1000mg, tần suất 1–6 lần/ngày.");
//       return;
//     }

//     const payload = {
//       treatmentID,
//       baseRegimentID: selectedRegimenId,
//       customDrugs: regimen.customDrugs.map((d) => ({
//         drugId: d.drugId,
//         dosage: `${d.dosage}mg`,
//         frequency: [`${d.frequency} lần/ngày`],
//       })),
//       notes: "Phác đồ cá nhân hóa bởi bác sĩ",
//     };

//     try {
//       setSaving(true);
//       await personalARVService.createPrescribedRegimen(token, payload);
//       toast.success("Đã lưu phác đồ!");
//       setIsLocked(true);
//       setShowFollowUpField(true);
//       handleCloseConfirmDialog();
//     } catch (err) {
//       toast.error("Lỗi khi lưu phác đồ.");
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleSaveFollowUpDate = async () => {
//     if (!followUpDate) {
//       toast.error("Vui lòng chọn ngày tái khám.");
//       return;
//     }

//     try {
//       await treatmentService.updateTreatment(treatmentID, token, {
//         followUpDate: new Date(followUpDate).toISOString(),
//       });
//       toast.success("Đã lưu ngày tái khám!");
//       setShowFollowUpField(false);
//     } catch (err) {
//       toast.error("Lỗi khi cập nhật ngày tái khám.");
//     }
//   };

//   return (
//     <div className="Container mx-auto mt-10 mb-10">
//       {/* 👉 Hiển thị appointmentId nếu có */}
//       {appointmentId && (
//         <div className="bg-yellow-50 p-3 mb-4 rounded-lg border border-yellow-300">
//           <p className="text-gray-700">
//             <strong className="text-yellow-800">Mã cuộc hẹn:</strong>{" "}
//             {appointmentId}
//           </p>
//         </div>
//       )}

//       {loading ? (
//         <p className="text-center">Đang tải...</p>
//       ) : error ? (
//         <p className="text-center text-red-500">{error}</p>
//       ) : regimens.length === 0 ? (
//         <p className="text-center text-gray-500">Không có phác đồ phù hợp.</p>
//       ) : (
//         <div>
//           {regimens.map((regimen) => {
//             const editable = customRegimens.find((r) => r._id === regimen._id);
//             return (
//               <div
//                 key={regimen._id}
//                 className="bg-teal-50 border border-teal-200 p-6 rounded-xl mb-6"
//               >
//                 <div className="flex justify-between items-center mb-3">
//                   <h3 className="text-lg font-semibold text-teal-700">
//                     {regimen.name} ({regimen.regimenType})
//                   </h3>
//                   <button
//                     onClick={() => handleToggleCriteria(regimen._id)}
//                     className="text-teal-600"
//                   >
//                     {showCriteria[regimen._id] ? (
//                       <VisibilityOffIcon />
//                     ) : (
//                       <VisibilityIcon />
//                     )}
//                   </button>
//                 </div>

//                 {showCriteria[regimen._id] && (
//                   <ul className="text-sm text-gray-700 list-disc pl-5 mb-4">
//                     {regimen.criteria.map((c, idx) => (
//                       <li key={idx}>
//                         {c.test_type} {c.operator} {c.value}
//                       </li>
//                     ))}
//                   </ul>
//                 )}

//                 {editable?.customDrugs.map((drug, i) => (
//                   <div
//                     key={i}
//                     className="bg-white p-4 rounded border mb-4 shadow-sm"
//                   >
//                     <p className="font-medium mb-2">
//                       {drug.genericName} ({drug.manufacturer})
//                     </p>
//                     <div className="grid grid-cols-2 gap-4">
//                       <div>
//                         <label>Liều lượng (mg)</label>
//                         <input
//                           type="number"
//                           className="w-full border rounded px-2 py-1"
//                           min={10}
//                           max={1000}
//                           value={drug.dosage}
//                           onChange={(e) =>
//                             handleDosageChange(regimen._id, i, e.target.value)
//                           }
//                           disabled={isLocked}
//                         />
//                       </div>
//                       <div>
//                         <label>Tần suất (lần/ngày)</label>
//                         <select
//                           className="w-full border rounded px-2 py-1"
//                           value={drug.frequency}
//                           onChange={(e) =>
//                             handleFrequencyChange(
//                               regimen._id,
//                               i,
//                               e.target.value
//                             )
//                           }
//                           disabled={isLocked}
//                         >
//                           {[1, 2, 3, 4, 5, 6].map((f) => (
//                             <option key={f} value={f}>
//                               {f}
//                             </option>
//                           ))}
//                         </select>
//                       </div>
//                     </div>
//                   </div>
//                 ))}

//                 {!isLocked && (
//                   <button
//                     onClick={() => handleOpenConfirmDialog(regimen._id)}
//                     className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700"
//                   >
//                     <SaveIcon fontSize="small" className="mr-1" />
//                     Lưu phác đồ
//                   </button>
//                 )}
//               </div>
//             );
//           })}
//           {isLocked && showFollowUpField && (
//             <div className="mt-6 bg-white p-4 rounded-lg border border-teal-200">
//               <label className="block mb-2 text-sm font-medium text-gray-700">
//                 Nhập ngày tái khám
//               </label>
//               <div className="flex items-center gap-3">
//                 <input
//                   type="date"
//                   className="border px-3 py-2 rounded"
//                   value={followUpDate}
//                   onChange={(e) => setFollowUpDate(e.target.value)}
//                 />
//                 <button
//                   onClick={handleSaveFollowUpDate}
//                   className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//                 >
//                   Lưu ngày tái khám
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       )}

//       {openConfirmDialog && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
//             <h3 className="text-lg font-bold mb-4 text-teal-700">
//               Xác nhận lưu phác đồ?
//             </h3>
//             <div className="flex justify-end gap-3">
//               <button
//                 onClick={handleCloseConfirmDialog}
//                 className="bg-gray-200 px-4 py-2 rounded"
//               >
//                 Hủy
//               </button>
//               <button
//                 onClick={handleSaveRegimen}
//                 className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700"
//                 disabled={saving}
//               >
//                 {saving ? "Đang lưu..." : "Lưu"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       <Toaster />
//     </div>
//   );
// };

// export default SuggestTreatment;

import React, { useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import personalARVService from "../../Services/DoctorService/personalARVService";
import treatmentService from "../../Services/DoctorService/treatmentService";
import checkoutService from "../../Services/DoctorService/checkoutService";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import SaveIcon from "@mui/icons-material/Save";

const SuggestTreatment = ({ treatmentID, token, appointmentId }) => {
  const [regimen, setRegimen] = useState(null); // Changed to single object
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [customRegimen, setCustomRegimen] = useState(null); // Changed to single object
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showCriteria, setShowCriteria] = useState(false); // Changed to boolean
  const [isLocked, setIsLocked] = useState(false);
  const [showFollowUpField, setShowFollowUpField] = useState(false);
  const [followUpDate, setFollowUpDate] = useState("");

  useEffect(() => {
    const fetchSuggestion = async () => {
      setLoading(true);
      setError("");

      try {
        const res = await personalARVService.suggestRegimen(token, treatmentID);
        if (res.data && res.data._id) {
          setRegimen(res.data); // Set single regimen object
          setCustomRegimen({
            customDrugs: res.data.drugs.map((d) => ({
              drugId: d.drugId._id,
              genericName: d.drugId.genericName,
              manufacturer: d.drugId.manufacturer,
              dosage: parseFloat(d.dosage.replace("mg", "")) || 0,
              frequency: Array.isArray(d.frequency)
                ? parseInt(d.frequency[0]) || 1
                : 1,
            })),
          });
          setShowCriteria(false); // Initialize as false for single regimen
        } else {
          throw new Error("Invalid response format");
        }
      } catch {
        setError("Không thể lấy gợi ý phác đồ.");
        toast.error("Không thể lấy gợi ý phác đồ.");
      } finally {
        setLoading(false);
      }
    };

    if (treatmentID && token) {
      fetchSuggestion();
    }
  }, [treatmentID, token]);

  const handleDosageChange = (index, value) => {
    setCustomRegimen((prev) => ({
      ...prev,
      customDrugs: prev.customDrugs.map((drug, i) =>
        i === index ? { ...drug, dosage: parseFloat(value) || "" } : drug
      ),
    }));
  };

  const handleFrequencyChange = (index, value) => {
    setCustomRegimen((prev) => ({
      ...prev,
      customDrugs: prev.customDrugs.map((drug, i) =>
        i === index ? { ...drug, frequency: parseInt(value) || "" } : drug
      ),
    }));
  };

  const handleToggleCriteria = () => {
    setShowCriteria((prev) => !prev);
  };

  const handleOpenConfirmDialog = () => {
    setOpenConfirmDialog(true);
  };

  const handleCloseConfirmDialog = () => {
    setOpenConfirmDialog(false);
  };

  const handleSaveRegimen = async () => {
    if (!customRegimen) {
      toast.error("Phác đồ không hợp lệ.");
      return;
    }

    const invalid = customRegimen.customDrugs.some(
      (d) =>
        d.dosage < 10 || d.dosage > 1000 || d.frequency < 1 || d.frequency > 6
    );
    if (invalid) {
      toast.error("Liều lượng phải từ 10–1000mg, tần suất 1–6 lần/ngày.");
      return;
    }

    const payload = {
      treatmentID,
      baseRegimentID: regimen._id,
      customDrugs: customRegimen.customDrugs.map((d) => ({
        drugId: d.drugId,
        dosage: `${d.dosage}mg`,
        frequency: [`${d.frequency} lần/ngày`],
      })),
      notes: "Phác đồ cá nhân hóa bởi bác sĩ",
    };

    try {
      setSaving(true);
      await personalARVService.createPrescribedRegimen(token, payload);
      toast.success("Đã lưu phác đồ!");
      setIsLocked(true);
      setShowFollowUpField(true);
      handleCloseConfirmDialog();
    } catch {
      toast.error("Lỗi khi lưu phác đồ.");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveFollowUpDate = async () => {
    if (!followUpDate) {
      toast.error("Vui lòng chọn ngày tái khám.");
      return;
    }

    try {
      await treatmentService.updateTreatment(treatmentID, token, {
        followUpDate: new Date(followUpDate).toISOString(),
      });
      toast.success("Đã lưu ngày tái khám!");

      if (appointmentId) {
        await checkoutService.checkoutAppointment(appointmentId, token);
        toast.success("Đã checkout cuộc hẹn!");
      }

      setShowFollowUpField(false);
    } catch (err) {
      toast.error("Lỗi khi cập nhật ngày tái khám hoặc checkout.");
      console.error("Lỗi:", err);
    }
  };

  return (
    <div className="Container mx-auto mt-10 mb-10">
      {loading ? (
        <p className="text-center">Đang tải...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : !regimen ? (
        <p className="text-center text-gray-500">Không có phác đồ phù hợp.</p>
      ) : (
        <div>
          <div className="bg-teal-50 border border-teal-200 p-6 rounded-xl mb-6">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold text-teal-700">
                {regimen.name} ({regimen.regimenType})
              </h3>
              <button onClick={handleToggleCriteria} className="text-teal-600">
                {showCriteria ? <VisibilityOffIcon /> : <VisibilityIcon />}
              </button>
            </div>

            {showCriteria && (
              <ul className="text-sm text-gray-700 list-disc pl-5 mb-4">
                {regimen.criteria.map((c, idx) => (
                  <li key={idx}>
                    {c.test_type} {c.operator} {c.value}
                  </li>
                ))}
              </ul>
            )}

            {customRegimen?.customDrugs.map((drug, i) => (
              <div
                key={i}
                className="bg-white p-4 rounded border mb-4 shadow-sm"
              >
                <p className="font-medium mb-2">
                  {drug.genericName} ({drug.manufacturer})
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label>Liều lượng (mg)</label>
                    <input
                      type="number"
                      className="w-full border rounded px-2 py-1"
                      min={10}
                      max={1000}
                      value={drug.dosage}
                      onChange={(e) => handleDosageChange(i, e.target.value)}
                      disabled={isLocked}
                    />
                  </div>
                  <div>
                    <label>Tần suất (lần/ngày)</label>
                    <select
                      className="w-full border rounded px-2 py-1"
                      value={drug.frequency}
                      onChange={(e) => handleFrequencyChange(i, e.target.value)}
                      disabled={isLocked}
                    >
                      {[1, 2, 3, 4, 5, 6].map((f) => (
                        <option key={f} value={f}>
                          {f}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            ))}

            {!isLocked && (
              <button
                onClick={handleOpenConfirmDialog}
                className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700"
              >
                <SaveIcon fontSize="small" className="mr-1" />
                Lưu phác đồ
              </button>
            )}
          </div>

          {isLocked && showFollowUpField && (
            <div className="mt-6 bg-white p-4 rounded-lg border border-teal-200">
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Nhập ngày tái khám
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="date"
                  className="border px-3 py-2 rounded"
                  value={followUpDate}
                  onChange={(e) => setFollowUpDate(e.target.value)}
                />
                <button
                  onClick={handleSaveFollowUpDate}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Lưu ngày tái khám
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {openConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-lg font-bold mb-4 text-teal-700">
              Xác nhận lưu phác đồ?
            </h3>
            <div className="flex justify-end gap-3">
              <button
                onClick={handleCloseConfirmDialog}
                className="bg-gray-200 px-4 py-2 rounded"
              >
                Hủy
              </button>
              <button
                onClick={handleSaveRegimen}
                className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700"
                disabled={saving}
              >
                {saving ? "Đang lưu..." : "Lưu"}
              </button>
            </div>
          </div>
        </div>
      )}

      <Toaster />
    </div>
  );
};

export default SuggestTreatment;
