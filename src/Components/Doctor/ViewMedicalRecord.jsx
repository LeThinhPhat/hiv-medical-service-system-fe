import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import medicalRecordService from "../../Services/DoctorService/medicalRecordService";

const ViewMedicalRecord = () => {
  const { patientID } = useParams();
  const [medicalRecord, setMedicalRecord] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

    fetchRecord();
  }, [patientID]);

  if (loading) return <p>Đang tải hồ sơ...</p>;

  return (
    <div className="p-4 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">Chi tiết hồ sơ</h2>
      {medicalRecord ? (
        <div>
          <p>
            <strong>Bệnh nhân:</strong> {medicalRecord.patientID?.name}
          </p>
          <p>
            <strong>CMND/CCCD:</strong> {patientID}
          </p>
          <p>
            <strong>Chẩn đoán:</strong> {medicalRecord.diagnosis}
          </p>
          <p>
            <strong>Triệu chứng:</strong> {medicalRecord.symptoms}
          </p>
        </div>
      ) : (
        <p>Không tìm thấy hồ sơ bệnh án.</p>
      )}
    </div>
  );
};

export default ViewMedicalRecord;
