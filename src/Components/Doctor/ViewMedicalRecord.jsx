import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ViewMedicalRecord = () => {
  const { recordId } = useParams(); // Giả sử route là: /medical-records/view/:recordId
  const [record, setRecord] = useState(null);

  useEffect(() => {
    // 🧪 Giả lập dữ liệu fake
    const fakeData = {
      _id: recordId,
      patientID: "BN123456",
      diagnosis: "Viêm họng cấp",
      symptoms: "Sốt, đau họng, ho khan",
      clinicalNotes:
        "Người bệnh có dấu hiệu nhiễm khuẩn nhẹ, nên uống thuốc theo chỉ định.",
      createdBy: "BS456",
      createdAt: "2025-06-25T10:15:00Z",
    };

    // Giả lập delay như gọi API
    setTimeout(() => {
      setRecord(fakeData);
    }, 500);
  }, [recordId]);

  if (!record) return <p>Đang tải hồ sơ bệnh án...</p>;

  return (
    <div className="p-6 bg-white rounded shadow max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-blue-700">
        Chi tiết hồ sơ bệnh án
      </h2>

      <div className="mb-2">
        <strong>Mã hồ sơ:</strong> {record._id}
      </div>
      <div className="mb-2">
        <strong>Mã bệnh nhân:</strong> {record.patientID}
      </div>
      <div className="mb-2">
        <strong>Chẩn đoán:</strong> {record.diagnosis}
      </div>
      <div className="mb-2">
        <strong>Triệu chứng:</strong> {record.symptoms}
      </div>
      <div className="mb-2">
        <strong>Ghi chú lâm sàng:</strong> {record.clinicalNotes}
      </div>
      <div className="mb-2">
        <strong>Bác sĩ tạo:</strong> {record.createdBy}
      </div>
      <div className="mb-2">
        <strong>Ngày tạo:</strong>{" "}
        {new Date(record.createdAt).toLocaleString("vi-VN")}
      </div>
    </div>
  );
};

export default ViewMedicalRecord;
