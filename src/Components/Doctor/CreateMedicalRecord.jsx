import React, { useState } from "react";
import { useParams } from "react-router-dom";
import medicalRecordService from "../../Services/DoctorService/medicalRecordService";

const CreateMedicalRecord = () => {
  const { patientID } = useParams(); // <-- lấy patientID từ URL
  const [formData, setFormData] = useState({
    patientID: patientID,
    diagnosis: "",
    symptoms: "",
    clinicalNotes: "",
    createdBy: "", // có thể lấy từ token hoặc user hiện tại
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await medicalRecordService.createMedicalRecord(formData);
      alert("Tạo bệnh án thành công!");
    } catch (error) {
      console.error("Lỗi khi tạo bệnh án:", error);
      alert("Tạo thất bại!");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Tạo hồ sơ bệnh án</h2>

      <div className="mb-4">
        <label className="block font-medium mb-1">Chẩn đoán</label>
        <input
          className="border rounded w-full p-2"
          value={formData.diagnosis}
          onChange={(e) =>
            setFormData({ ...formData, diagnosis: e.target.value })
          }
        />
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1">Triệu chứng</label>
        <textarea
          className="border rounded w-full p-2"
          value={formData.symptoms}
          onChange={(e) =>
            setFormData({ ...formData, symptoms: e.target.value })
          }
        ></textarea>
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1">Ghi chú lâm sàng</label>
        <textarea
          className="border rounded w-full p-2"
          value={formData.clinicalNotes}
          onChange={(e) =>
            setFormData({ ...formData, clinicalNotes: e.target.value })
          }
        ></textarea>
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Tạo hồ sơ
      </button>
    </form>
  );
};

export default CreateMedicalRecord;
