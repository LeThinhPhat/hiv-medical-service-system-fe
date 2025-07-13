import React, { useState } from "react";
import { FaStethoscope, FaClipboardList } from "react-icons/fa";
import BookingStepper from "../Customer/BookingStepper";
import AnonymousConsultationForm from "./BookingStep/AnonymousConsultationForm";

const Booking = () => {
  const [selectedService, setSelectedService] = useState("");
  const [showStepper, setShowStepper] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);

  const services = [
    { name: "Đặt lịch khám bác sĩ", icon: <FaStethoscope /> },
    { name: "Đặt lịch tư vấn ẩn danh", icon: <FaClipboardList /> },
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

  const handleServiceClick = (serviceName) => {
    setSelectedService(serviceName);
    setShowStepper(serviceName === "Đặt lịch khám bác sĩ");
    setShowEmailForm(serviceName === "Đặt lịch tư vấn ẩn danh");
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-12">
      <h2 className="text-4xl font-bold text-gray-800 text-center mb-6">
        Các Hình Thức Đặt Khám
      </h2>
      <p className="text-center text-gray-600 mb-10 max-w-2xl mx-auto text-lg leading-relaxed">
        Chọn dịch vụ dưới đây để đặt lịch khám. Chúng tôi cung cấp các dịch vụ
        chăm sóc sức khỏe toàn diện, từ khám tổng quát, kiểm tra chuyên khoa đến
        tiêm ngừa tại nhà hoặc tại cơ sở y tế.
        <br />
        <small className="text-gray-500 text-sm">Cập nhật: {currentTime}</small>
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10 justify-center md:max-w-2xl mx-auto">
        {services.map((service) => (
          <button
            key={service.name}
            onClick={() => handleServiceClick(service.name)}
            className={`flex flex-col items-center justify-center p-6 rounded-lg bg-white border-2 border-gray-200 hover:border-blue-500 hover:shadow-lg transition duration-300 ${
              selectedService === service.name
                ? "bg-blue-50 border-blue-500 shadow-md"
                : ""
            }`}
          >
            <span className="text-4xl text-blue-600 mb-4">{service.icon}</span>
            <span className="text-base font-semibold text-gray-800 text-center">
              {service.name}
            </span>
          </button>
        ))}
      </div>

      {showStepper && (
        <div className="mt-12">
          <BookingStepper selectedService={selectedService} />
        </div>
      )}

      {showEmailForm && <AnonymousConsultationForm />} {/* 👉 Dùng component mới */}
    </div>
  );
};

export default Booking;
