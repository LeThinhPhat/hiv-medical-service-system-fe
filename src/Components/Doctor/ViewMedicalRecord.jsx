// import React, { useEffect, useState } from "react";
// import { useParams, useLocation, Link } from "react-router-dom";
// import medicalRecordService from "../../Services/DoctorService/medicalRecordService";
// import createMedicalPersonalService from "../../Services/DoctorService/createMedicalPersonalService";
// import toast from "react-hot-toast";

// const ViewMedicalRecord = () => {
//   const { patientID } = useParams();
//   const location = useLocation();
//   const [medicalRecord, setMedicalRecord] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [submitting, setSubmitting] = useState(false);

//   const serviceId = location.state?.serviceId || "";
//   const serviceName = location.state?.serviceName || "";
//   const appointmentId = location.state?.appointmentId || ""; // ✅ lấy appointmentId

//   const [formData, setFormData] = useState({
//     diagnosis: "",
//     symptoms: "",
//     clinicalNotes: "",
//   });

//   const token = localStorage.getItem("token");

//   const fetchRecord = async () => {
//     try {
//       const data = await medicalRecordService.getMedicalRecordByPersonalID(
//         patientID
//       );
//       setMedicalRecord(data);
//     } catch (error) {
//       console.error("Lỗi khi lấy hồ sơ bệnh án:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchRecord();
//   }, [patientID]);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleCreateMedicalRecord = async (e) => {
//     e.preventDefault();
//     setSubmitting(true);

//     try {
//       const created = await createMedicalPersonalService(
//         patientID,
//         formData,
//         token,
//         serviceId,
//         appointmentId // ✅ truyền appointmentId nếu cần
//       );
//       toast.success("Tạo hồ sơ bệnh án thành công");
//       setMedicalRecord(created.data);
//     } catch (error) {
//       toast.error("Lỗi khi tạo hồ sơ");
//       console.error(error);
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   if (loading)
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     );

//   return (
//     <div className="min-h-screen bg-gray-100 py-8 px-4">
//       <div className="max-w-4xl mx-auto">
//         <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
//           <div className="bg-gradient-to-r from-blue-600 to-blue-400 p-6">
//             <h2 className="text-2xl font-bold text-white">
//               Chi tiết hồ sơ bệnh án
//             </h2>
//           </div>
//           <div className="p-6 space-y-6">
//             {(serviceId || appointmentId) && (
//               <div className="space-y-2">
//                 {serviceId && (
//                   <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
//                     <p className="text-gray-700">
//                       <strong className="text-blue-800">Dịch vụ y tế:</strong>{" "}
//                       {serviceName}
//                     </p>
//                   </div>
//                 )}
//                 {appointmentId && (
//                   <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-300">
//                     <p className="text-gray-700">
//                       <strong className="text-yellow-800">Mã cuộc hẹn:</strong>{" "}
//                       {appointmentId}
//                     </p>
//                   </div>
//                 )}
//               </div>
//             )}

//             {medicalRecord ? (
//               <div className="space-y-4 text-gray-800">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div className="space-y-2">
//                     <p>
//                       <strong className="text-gray-700">Bệnh nhân:</strong>{" "}
//                       {medicalRecord.patientID?.name || "Không rõ"}
//                     </p>
//                     <p>
//                       <strong className="text-gray-700">CMND/CCCD:</strong>{" "}
//                       {medicalRecord.patientID?.personalID}
//                     </p>
//                     <p>
//                       <strong className="text-gray-700">Chẩn đoán:</strong>{" "}
//                       {medicalRecord.diagnosis}
//                     </p>
//                   </div>
//                   <div className="space-y-2">
//                     <p>
//                       <strong className="text-gray-700">Triệu chứng:</strong>{" "}
//                       {medicalRecord.symptoms}
//                     </p>
//                     <p>
//                       <strong className="text-gray-700">
//                         Ghi chú lâm sàng:
//                       </strong>{" "}
//                       {medicalRecord.clinicalNotes}
//                     </p>
//                     <p>
//                       <strong className="text-gray-700">Người tạo:</strong>{" "}
//                       {medicalRecord.createdBy?.email}
//                     </p>
//                     <p>
//                       <strong className="text-gray-700">Ngày tạo:</strong>{" "}
//                       {new Date(medicalRecord.createdAt).toLocaleString(
//                         "vi-VN"
//                       )}
//                     </p>
//                   </div>
//                 </div>

//                 {medicalRecord.treatmentID?.length > 0 && (
//                   <div className="mt-4">
//                     <h3 className="text-lg font-semibold text-gray-800 mb-2">
//                       Danh sách điều trị đã tạo:
//                     </h3>
//                     <ul className="space-y-2">
//                       {medicalRecord.treatmentID.map((id, index) => (
//                         <li
//                           key={id}
//                           className="bg-gray-50 p-3 rounded-lg border border-gray-200 flex items-center justify-between"
//                         >
//                           <span>
//                             Lần Khám {index + 1}: {id}
//                           </span>
//                           <Link
//                             to={`/doctor/doctorsappoinment/medical-records/personal-id/treatment/${id}`}
//                             className="text-white bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm"
//                           >
//                             Xem chi tiết
//                           </Link>
//                         </li>
//                       ))}
//                     </ul>
//                   </div>
//                 )}

//                 {serviceName !== "Kiểm tra tổng quát" && (
//                   <div className="mt-6">
//                     <Link
//                       to={`/doctor/doctorsappoinment/medical-records/personal-id/create-treatment/${medicalRecord._id}`}
//                       state={{ appointmentId }}
//                       className="text-white bg-green-600 hover:bg-green-700 px-4 py-2 rounded inline-block"
//                     >
//                       Tạo điều trị
//                     </Link>
//                   </div>
//                 )}
//               </div>
//             ) : (
//               <form onSubmit={handleCreateMedicalRecord} className="space-y-4">
//                 <p className="text-red-600">
//                   Bệnh nhân chưa có hồ sơ. Vui lòng nhập thông tin để tạo:
//                 </p>
//                 <div className="space-y-4">
//                   <input
//                     type="text"
//                     name="diagnosis"
//                     value={formData.diagnosis}
//                     onChange={handleChange}
//                     placeholder="Chẩn đoán"
//                     className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     required
//                   />
//                   <input
//                     type="text"
//                     name="symptoms"
//                     value={formData.symptoms}
//                     onChange={handleChange}
//                     placeholder="Triệu chứng"
//                     className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     required
//                   />
//                   <textarea
//                     name="clinicalNotes"
//                     value={formData.clinicalNotes}
//                     onChange={handleChange}
//                     placeholder="Ghi chú lâm sàng"
//                     className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
//                   />
//                 </div>
//                 <div className="flex justify-end">
//                   <button
//                     type="submit"
//                     disabled={submitting}
//                     className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition disabled:cursor-not-allowed"
//                   >
//                     {submitting ? (
//                       <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white inline-block"></div>
//                     ) : (
//                       "Tạo hồ sơ bệnh án"
//                     )}
//                   </button>
//                 </div>
//               </form>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ViewMedicalRecord;

// code trên đã ok

import React, { useEffect, useState } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import medicalRecordService from "../../Services/DoctorService/medicalRecordService";
import createMedicalPersonalService from "../../Services/DoctorService/createMedicalPersonalService";
import checkoutService from "../../Services/DoctorService/checkoutService"; // ✅ import thêm
import toast from "react-hot-toast";

const ViewMedicalRecord = () => {
  const { patientID } = useParams();
  const location = useLocation();
  const [medicalRecord, setMedicalRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const serviceId = location.state?.serviceId || "";
  const serviceName = location.state?.serviceName || "";
  const appointmentId = location.state?.appointmentId || "";

  const [formData, setFormData] = useState({
    diagnosis: "",
    symptoms: "",
    clinicalNotes: "",
  });

  const token = localStorage.getItem("token");

  const fetchRecord = async () => {
    try {
      const data = await medicalRecordService.getMedicalRecordByPersonalID(
        patientID
      );
      setMedicalRecord(data);
    } catch (error) {
      console.error("Lỗi khi lấy hồ sơ bệnh án:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecord();
  }, [patientID]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateMedicalRecord = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const created = await createMedicalPersonalService(
        patientID,
        formData,
        token,
        serviceId,
        appointmentId
      );
      toast.success("Tạo hồ sơ bệnh án thành công");
      setMedicalRecord(created.data);
    } catch (error) {
      toast.error("Lỗi khi tạo hồ sơ");
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCheckout = async () => {
    if (!appointmentId) {
      toast.error("Không có mã cuộc hẹn để checkout");
      return;
    }

    try {
      await checkoutService.checkoutAppointment(appointmentId, token);
      toast.success("Đã checkout thành công cho kiểm tra tổng quát!");
    } catch (err) {
      console.error("Lỗi khi checkout:", err);
      toast.error("Lỗi khi thực hiện checkout.");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-400 p-6">
            <h2 className="text-2xl font-bold text-white">
              Chi tiết hồ sơ bệnh án
            </h2>
          </div>
          <div className="p-6 space-y-6">
            {(serviceId || appointmentId) && (
              <div className="space-y-2">
                {serviceId && (
                  <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                    <p className="text-gray-700">
                      <strong className="text-blue-800">Dịch vụ y tế:</strong>{" "}
                      {serviceName}
                    </p>
                  </div>
                )}
                {/* {appointmentId && (
                  <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-300">
                    <p className="text-gray-700">
                      <strong className="text-yellow-800">Mã cuộc hẹn:</strong>{" "}
                      {appointmentId}
                    </p>
                  </div>
                )} */}
              </div>
            )}

            {medicalRecord ? (
              <div className="space-y-4 text-gray-800">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p>
                      <strong className="text-gray-700">Bệnh nhân:</strong>{" "}
                      {medicalRecord.patientID?.name || "Không rõ"}
                    </p>
                    <p>
                      <strong className="text-gray-700">CMND/CCCD:</strong>{" "}
                      {medicalRecord.patientID?.personalID}
                    </p>
                    <p>
                      <strong className="text-gray-700">Chẩn đoán:</strong>{" "}
                      {medicalRecord.diagnosis}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p>
                      <strong className="text-gray-700">Triệu chứng:</strong>{" "}
                      {medicalRecord.symptoms}
                    </p>
                    <p>
                      <strong className="text-gray-700">
                        Ghi chú lâm sàng:
                      </strong>{" "}
                      {medicalRecord.clinicalNotes}
                    </p>
                    <p>
                      <strong className="text-gray-700">Người tạo:</strong>{" "}
                      {medicalRecord.createdBy?.email}
                    </p>
                    <p>
                      <strong className="text-gray-700">Ngày tạo:</strong>{" "}
                      {new Date(medicalRecord.createdAt).toLocaleString(
                        "vi-VN"
                      )}
                    </p>
                  </div>
                </div>

                {medicalRecord.treatmentID?.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      Danh sách điều trị đã tạo:
                    </h3>
                    <ul className="space-y-2">
                      {medicalRecord.treatmentID.map((id, index) => (
                        <li
                          key={id}
                          className="bg-gray-50 p-3 rounded-lg border border-gray-200 flex items-center justify-between"
                        >
                          <span>
                            Lần Khám {index + 1}: {id}
                          </span>
                          <Link
                            to={`/doctor/doctorsappoinment/medical-records/personal-id/treatment/${id}`}
                            className="text-white bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm"
                          >
                            Xem chi tiết
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {serviceName === "Kiểm tra tổng quát" ? (
                  <div className="mt-6">
                    <button
                      onClick={handleCheckout}
                      className="text-white bg-green-600 hover:bg-green-700 px-4 py-2 rounded inline-block"
                    >
                      Hoàn tất kiểm tra tổng quát
                    </button>
                  </div>
                ) : (
                  <div className="mt-6">
                    <Link
                      to={`/doctor/doctorsappoinment/medical-records/personal-id/create-treatment/${medicalRecord._id}`}
                      state={{ appointmentId }}
                      className="text-white bg-green-600 hover:bg-green-700 px-4 py-2 rounded inline-block"
                    >
                      Tạo điều trị
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <form onSubmit={handleCreateMedicalRecord} className="space-y-4">
                <p className="text-red-600">
                  Bệnh nhân chưa có hồ sơ. Vui lòng nhập thông tin để tạo:
                </p>
                <div className="space-y-4">
                  <input
                    type="text"
                    name="diagnosis"
                    value={formData.diagnosis}
                    onChange={handleChange}
                    placeholder="Chẩn đoán"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <input
                    type="text"
                    name="symptoms"
                    value={formData.symptoms}
                    onChange={handleChange}
                    placeholder="Triệu chứng"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <textarea
                    name="clinicalNotes"
                    value={formData.clinicalNotes}
                    onChange={handleChange}
                    placeholder="Ghi chú lâm sàng"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white inline-block"></div>
                    ) : (
                      "Tạo hồ sơ bệnh án"
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewMedicalRecord;
