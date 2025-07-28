import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PatientService from "../../Services/patientService";
import MedicalRecordService from "../../Services/CusService/MedicalRecordService";
import IntroDoctor from "../../Page/IntroDoctor";
import EducationalDocuments from "../../Page/EducationalDocuments";
const HomePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAndStorePatientAndTreatment = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const patient = await PatientService.getPatientByToken();
        if (patient) {
          localStorage.setItem("patient", JSON.stringify(patient));

          const personalId = patient.personalID;
          if (personalId) {
            try {
              const res =
                await MedicalRecordService.getFullMedicalRecordByPersonalId(
                  personalId
                );
              const treatmentIDs = res?.treatmentID;
              if (treatmentIDs) {
                localStorage.setItem(
                  "treatmentIDs",
                  JSON.stringify(treatmentIDs)
                );
              }
            } catch (medicalRecordErr) {
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
        className="relative h-[70vh] bg-cover bg-center flex items-center justify-center text-white text-center"
        style={{
          backgroundImage:
            "url(https://images.pexels.com/photos/4266931/pexels-photo-4266931.jpeg)",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r "></div>
        <div className="relative z-10 animate-fade-in max-w-4xl mx-auto px-4">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 drop-shadow-xl tracking-tight">
            Trung Tâm Hỗ Trợ HIV MedicalCare
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl mb-8 drop-shadow-md leading-relaxed">
            Hỗ trợ bảo mật – Chăm sóc toàn diện – Đồng hành cùng bạn vượt qua
            HIV
          </p>
          <button
            onClick={() => navigate("/booking")}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-8 rounded-full transition duration-300 transform hover:scale-105 shadow-lg"
          >
            Đặt lịch tư vấn & khám HIV
          </button>
        </div>
      </div>

      {/* Services */}
      <div className="max-w-7xl mx-auto my-16 px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center text-gray-800 mb-12">
          Dịch Vụ Chuyên Biệt Về HIV/AIDS
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: "Tư vấn xét nghiệm HIV",
              description:
                "Tư vấn, hướng dẫn và thực hiện xét nghiệm HIV an toàn, bảo mật.",
            },
            {
              title: "Điều trị ARV",
              description:
                "Điều trị bằng thuốc kháng virus (ARV) giúp duy trì sức khỏe, phòng ngừa lây nhiễm.",
            },
            {
              title: "Tư vấn tâm lý – hỗ trợ cộng đồng",
              description:
                "Hỗ trợ tâm lý, chia sẻ cùng chuyên gia, kết nối cộng đồng, bảo mật thông tin.",
            },
            {
              title: "Dự phòng lây nhiễm (PrEP, PEP)",
              description:
                "Tư vấn và cung cấp các biện pháp dự phòng lây nhiễm HIV hiệu quả (PrEP, PEP).",
            },
          ].map((service) => (
            <div
              key={service.title}
              className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-xl transition duration-300 transform hover:-translate-y-2"
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                {service.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
      <IntroDoctor />
      {/* About */}
      <div className="max-w-7xl mx-auto my-16 px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-6">
          Về Chúng Tôi
        </h2>
        <p className="text-gray-600 text-lg leading-relaxed max-w-3xl">
          MedicalCare là trung tâm hỗ trợ và điều trị HIV/AIDS với đội ngũ bác
          sĩ chuyên môn giàu kinh nghiệm. Chúng tôi cam kết bảo mật tuyệt đối
          thông tin, đồng hành cùng bạn trên hành trình chăm sóc sức khỏe và
          nâng cao chất lượng cuộc sống. Đặt lịch tư vấn và khám HIV miễn phí,
          an toàn, thuận tiện, tận tâm.
        </p>
        <button
          onClick={() => navigate("/about")}
          className="mt-6 bg-transparent border border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white font-semibold py-2 px-6 rounded-full transition duration-300"
        >
          Tìm hiểu thêm
        </button>
      </div>
      <EducationalDocuments />
    </div>
  );
};

export default HomePage;
