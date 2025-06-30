import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import medicalRecordService from "../../Services/DoctorService/medicalRecordService";

const ViewMedicalRecord = () => {
  const { patientID } = useParams(); // Đây là personalID trong URL
  const [medicalRecord, setMedicalRecord] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecord = async () => {
      try {
        const data = await medicalRecordService.getMedicalRecordByPersonalID(
          patientID
        );
        setMedicalRecord(data); // ✅ CHỈ LẤY data thôi vì service đã return .data.data
      } catch (error) {
        console.error("Lỗi khi lấy hồ sơ bệnh án:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecord();
  }, [patientID]);

  if (loading) return <p>Đang tải hồ sơ...</p>;

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow mt-6">
      <h2 className="text-2xl font-bold mb-4 text-blue-700">
        📝 Chi tiết hồ sơ bệnh án
      </h2>
      {medicalRecord ? (
        <div className="space-y-3 text-gray-800">
          <p>
            <strong>Bệnh nhân:</strong> {medicalRecord.patientID?.userID?.name}
          </p>
          <p>
            <strong>CMND/CCCD:</strong> {medicalRecord.patientID?.personalID}
          </p>
          <p>
            <strong>Chẩn đoán:</strong> {medicalRecord.diagnosis}
          </p>
          <p>
            <strong>Triệu chứng:</strong> {medicalRecord.symptoms}
          </p>
          <p>
            <strong>Ghi chú lâm sàng:</strong> {medicalRecord.clinicalNotes}
          </p>
          <p>
            <strong>Người tạo:</strong> {medicalRecord.createdBy?.email}
          </p>
          <p>
            <strong>Ngày tạo:</strong>{" "}
            {new Date(medicalRecord.createdAt).toLocaleString("vi-VN")}
          </p>
        </div>
      ) : (
        <p className="text-red-500">Không tìm thấy hồ sơ bệnh án.</p>
      )}
    </div>
  );
};

export default ViewMedicalRecord;
