import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import medicalRecordService from "../../Services/DoctorService/medicalRecordService";

const CreateMedicalRecord = () => {
  const { patientID } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    patientID: patientID,
    diagnosis: "",
    symptoms: "",
    clinicalNotes: "",
    createdBy: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await medicalRecordService.createMedicalRecord(formData);
      const personalID = response.data.patientID.personalID;

      alert("Tạo bệnh án thành công!");
      navigate(
        `/doctor/doctorsappoinment/medical-records/personal-id/${personalID}`
      );
    } catch (error) {
      console.error("Lỗi khi tạo bệnh án:", error);
      alert("Tạo thất bại!");
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">
        📝 Tạo Hồ Sơ Bệnh Án
      </h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Chẩn đoán <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Nhập chẩn đoán bệnh..."
            className="border border-gray-300 rounded-md w-full p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={formData.diagnosis}
            onChange={(e) =>
              setFormData({ ...formData, diagnosis: e.target.value })
            }
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Triệu chứng <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={4}
            placeholder="Mô tả các triệu chứng bệnh nhân gặp phải..."
            className="border border-gray-300 rounded-md w-full p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={formData.symptoms}
            onChange={(e) =>
              setFormData({ ...formData, symptoms: e.target.value })
            }
            required
          ></textarea>
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Ghi chú lâm sàng
          </label>
          <textarea
            rows={4}
            placeholder="Ghi chú thêm từ bác sĩ (nếu có)..."
            className="border border-gray-300 rounded-md w-full p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={formData.clinicalNotes}
            onChange={(e) =>
              setFormData({ ...formData, clinicalNotes: e.target.value })
            }
          ></textarea>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-md font-semibold hover:bg-blue-700 transition"
        >
          Tạo Hồ Sơ
        </button>
      </form>
    </div>
  );
};

export default CreateMedicalRecord;
