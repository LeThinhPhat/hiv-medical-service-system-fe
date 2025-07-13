import React, { useEffect } from "react";
import BookingStepper from "../Customer/BookingStepper";
import PatientService from "../../Services/patientService";
import { useNavigate } from "react-router-dom";
import MedicalRecordService from "../../Services/CusService/MedicalRecordService";

const HomePage = () => {
const navigate = useNavigate();


useEffect(() => {
  const fetchAndStorePatientAndTreatment = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const patient = await PatientService.getPatientByToken();
      if (patient) {
        // Lưu patient ngay cả khi không có medical record
        localStorage.setItem("patient", JSON.stringify(patient));

        const personalId = patient.personalID;
        if (personalId) {
          try {
            const res = await MedicalRecordService.getFullMedicalRecordByPersonalId(personalId);
            // Lấy mảng treatmentID từ response
            const treatmentIDs = res?.treatmentID;
            if (treatmentIDs) {
              localStorage.setItem("treatmentIDs", JSON.stringify(treatmentIDs));
            }
          } catch (medicalRecordErr) {
            // Không xóa patient khi lỗi medical record
            console.error("Lỗi khi lấy medical record:", medicalRecordErr);
            localStorage.removeItem("treatmentIDs");
          }
        }
      }
    } catch (err) {
      console.error("Lỗi khi lấy thông tin bệnh nhân:", err);
      localStorage.removeItem("patient");
      localStorage.removeItem("treatmentIDs");
    }
  };

  fetchAndStorePatientAndTreatment();
}, []);

  return (
    <div className="font-sans">
      {/* Banner */}
      <div
        className="relative h-[60vh] bg-cover bg-center flex items-center justify-center text-white text-center"
        style={{
          backgroundImage:
            "url(https://images.pexels.com/photos/4266931/pexels-photo-4266931.jpeg)",
        }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-lg">
            Trung Tâm Hỗ Trợ HIV MedicalCare
          </h1>
          <p className="text-lg md:text-xl mb-6 drop-shadow-md">
            Hỗ trợ bảo mật – Chăm sóc toàn diện – Đồng hành cùng bạn vượt qua HIV
          </p>
          <button 
           onClick={() => navigate("/booking")}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-full transition duration-300 transform hover:scale-105">
            Đặt lịch tư vấn & khám HIV
          </button>
        </div>
      </div>

      {/* Services */}
      <div className="max-w-7xl mx-auto my-12 px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-8">
          Dịch vụ chuyên biệt về HIV/AIDS
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            "Tư vấn xét nghiệm HIV",
            "Điều trị ARV",
            "Tư vấn tâm lý – hỗ trợ cộng đồng",
            "Dự phòng lây nhiễm (PrEP, PEP)",
          ].map((service) => (
            <div
              key={service}
              className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition duration-300 transform hover:-translate-y-1"
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {service}
              </h3>
              <p className="text-gray-600">
                {service === "Tư vấn xét nghiệm HIV"
                  ? "Tư vấn, hướng dẫn và thực hiện xét nghiệm HIV an toàn, bảo mật."
                  : service === "Điều trị ARV"
                  ? "Điều trị bằng thuốc kháng virus (ARV) giúp duy trì sức khỏe, phòng ngừa lây nhiễm."
                  : service === "Tư vấn tâm lý – hỗ trợ cộng đồng"
                  ? "Hỗ trợ tâm lý, chia sẻ cùng chuyên gia, kết nối cộng đồng, bảo mật thông tin."
                  : "Tư vấn và cung cấp các biện pháp dự phòng lây nhiễm HIV hiệu quả (PrEP, PEP)."}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* About */}
      <div className="max-w-7xl mx-auto my-12 px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          Về chúng tôi
        </h2>
        <p className="text-gray-600 leading-relaxed">
          MedicalCare là trung tâm hỗ trợ và điều trị HIV/AIDS với đội ngũ bác sĩ chuyên môn giàu kinh nghiệm. 
          Chúng tôi cam kết bảo mật tuyệt đối thông tin, đồng hành cùng bạn trên hành trình chăm sóc sức khỏe và nâng cao chất lượng cuộc sống. 
          Đặt lịch tư vấn và khám HIV miễn phí, an toàn, thuận tiện, tận tâm.
        </p>
      </div>
    </div>
  );
};

export default HomePage;
