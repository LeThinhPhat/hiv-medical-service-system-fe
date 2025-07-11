import React, { useEffect, useState } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import medicalRecordService from "../../Services/DoctorService/medicalRecordService";
import createMedicalPersonalService from "../../Services/DoctorService/createMedicalPersonalService";
import {
  Button,
  TextField,
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";

const ViewMedicalRecord = () => {
  const { patientID } = useParams();
  const location = useLocation();
  const [medicalRecord, setMedicalRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // ✅ Lấy serviceId và serviceName nếu được truyền từ trang trước
  const serviceId = location.state?.serviceId || "";
  const serviceName = location.state?.serviceName || "";

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
      // ✅ Truyền thêm serviceId nếu có
      const created = await createMedicalPersonalService(
        patientID,
        formData,
        token,
        serviceId
      );
      alert("✅ Tạo hồ sơ bệnh án thành công");
      setMedicalRecord(created.data);
    } catch (error) {
      alert("❌ Lỗi khi tạo hồ sơ");
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p>Đang tải hồ sơ...</p>;

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow mt-6">
      <h2 className="text-2xl font-bold mb-4 text-blue-700">
        📝 Chi tiết hồ sơ bệnh án
      </h2>

      {/* ✅ Hiển thị dịch vụ y tế nếu có */}
      {serviceId && (
        <p className="mb-4 text-gray-700">
          <strong>Dịch vụ y tế:</strong> [{serviceId}] {serviceName}
        </p>
      )}

      {medicalRecord ? (
        <div className="space-y-3 text-gray-800">
          <p>
            <strong>Bệnh nhân:</strong>{" "}
            {medicalRecord.patientID?.name || "Không rõ"}
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

          {/* Danh sách treatmentID */}
          {medicalRecord.treatmentID?.length > 0 && (
            <div className="mt-4">
              <Typography variant="h6" className="text-blue-700 mb-2">
                📋 Danh sách điều trị đã tạo:
              </Typography>
              <ul className="list-disc pl-6 space-y-2">
                {medicalRecord.treatmentID.map((id, index) => (
                  <li key={id} className="flex items-center justify-between">
                    <span>
                      Lần Khám {index + 1}: {id}
                    </span>
                    <Link
                      to={`/doctor/doctorsappoinment/medical-records/personal-id/treatment/${id}`}
                      className="text-white bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm"
                    >
                      🔜 Xem chi tiết
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Link đến form tạo treatment mới */}
          {serviceName !== "Kiểm tra tổng quát" && (
            <div className="mt-6">
              <Link
                to={`/doctor/doctorsappoinment/medical-records/personal-id/create-treatment/${medicalRecord._id}`}
                className="text-white bg-green-600 hover:bg-green-700 px-4 py-2 rounded inline-block"
              >
                ➕ Tạo treatment mới
              </Link>
            </div>
          )}
        </div>
      ) : (
        <form onSubmit={handleCreateMedicalRecord} className="space-y-4">
          <Typography variant="body1" className="text-red-600">
            Bệnh nhân chưa có hồ sơ. Vui lòng nhập thông tin để tạo:
          </Typography>

          <TextField
            label="Chẩn đoán"
            name="diagnosis"
            value={formData.diagnosis}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            label="Triệu chứng"
            name="symptoms"
            value={formData.symptoms}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            label="Ghi chú lâm sàng"
            name="clinicalNotes"
            value={formData.clinicalNotes}
            onChange={handleChange}
            fullWidth
            multiline
            minRows={3}
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
                "➕ Tạo hồ sơ bệnh án"
              )}
            </Button>
          </Box>
        </form>
      )}
    </div>
  );
};

export default ViewMedicalRecord;
