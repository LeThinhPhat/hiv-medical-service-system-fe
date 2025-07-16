import React, { useState } from "react";
import { FaStethoscope, FaClipboardList, FaUserMd, FaClock } from "react-icons/fa";
import BookingStepper from "../Customer/BookingStepper";
import AnonymousConsultationForm from "./BookingStep/AnonymousConsultationForm";
import ListDoctor from "./Listdoctor";
import { toast } from "react-toastify";

const Booking = () => {
  const [selectedService, setSelectedService] = useState("");
  const [selectedSubService, setSelectedSubService] = useState("");
  const [showEmailForm, setShowEmailForm] = useState(false);

  const services = [
    { name: "Đặt lịch khám bác sĩ", icon: <FaStethoscope /> },
    { name: "Đặt lịch tư vấn ẩn danh", icon: <FaClipboardList /> },
  ];

  const doctorSubServices = [
    { name: "chọn khung thời gian", value: "stepper", icon: <FaClock /> },
    { name: "Chọn bác sĩ", value: "doctorlist", icon: <FaUserMd /> },
  ];

  const currentTime = new Date().toLocaleString("vi-VN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Ho_Chi_Minh",
  });
  const token = localStorage.getItem("token");
const handleServiceClick = (serviceName) => {
  if (!token) {
    toast.warning("Vui lòng đăng nhập để đặt lịch khám bác sĩ.");
    return;
  }

  setSelectedService(serviceName);
  setSelectedSubService("");
  setShowEmailForm(serviceName === "Đặt lịch tư vấn ẩn danh");
};

  const handleSubServiceClick = (sub) => {
    setSelectedSubService(sub);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-12">
      <h2 className="text-4xl font-bold text-gray-800 text-center mb-6">
        Các Hình Thức Đặt Khám
      </h2>
      <p className="text-center text-gray-600 mb-10 max-w-2xl mx-auto text-lg leading-relaxed">
        Chọn dịch vụ dưới đây để đặt lịch khám.
        <br />
        <small className="text-gray-500 text-sm">Cập nhật: {currentTime}</small>
      </p>

      {/* Dịch vụ chính */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10 justify-center md:max-w-2xl mx-auto">
        {services.map((service) => (
          <button
            key={service.name}
            onClick={() => handleServiceClick(service.name)}
            className={`flex flex-col items-center justify-center p-6 rounded-lg bg-white border-2 border-gray-200 hover:border-blue-500 hover:shadow-lg transition duration-300 ${
              selectedService === service.name ? "bg-blue-50 border-blue-500 shadow-md" : ""
            }`}
          >
            <span className="text-4xl text-blue-600 mb-4">{service.icon}</span>
            <span className="text-base font-semibold text-gray-800 text-center">{service.name}</span>
          </button>
        ))}
      </div>

      {/* Nếu chọn "Đặt lịch khám bác sĩ" thì hiện sub-services */}
      {selectedService === "Đặt lịch khám bác sĩ" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10 justify-center md:max-w-xl mx-auto">
          {doctorSubServices.map((sub) => (
            <button
              key={sub.value}
              onClick={() => handleSubServiceClick(sub.value)}
              className={`flex flex-col items-center justify-center p-5 rounded-lg bg-white border-2 border-gray-200 hover:border-blue-500 hover:shadow-lg transition duration-300 ${
                selectedSubService === sub.value ? "bg-blue-50 border-blue-500 shadow-md" : ""
              }`}
            >
              <span className="text-3xl text-green-600 mb-3">{sub.icon}</span>
              <span className="text-base font-semibold text-gray-800 text-center">{sub.name}</span>
            </button>
          ))}
        </div>
      )}

      {/* Hiện stepper nếu chọn Tiếp tục đặt lịch */}
      {selectedSubService === "stepper" && (
        <div className="mt-12">
          <BookingStepper selectedService={selectedService} />
        </div>
      )}

      {/* Hiện danh sách bác sĩ nếu chọn "Chọn bác sĩ" */}
      {selectedSubService === "doctorlist" && <ListDoctor />}

      {/* Nếu chọn tư vấn ẩn danh thì hiện form */}
      {showEmailForm && <AnonymousConsultationForm />}
    </div>
  );
};

export default Booking;
