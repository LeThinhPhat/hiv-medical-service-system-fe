import React from "react";
import {
  FaStethoscope,
  FaHeartbeat,
  FaClipboardList,
  FaSyringe,
} from "react-icons/fa";

const Booking = ({ onServiceSelect, selectedService }) => {
  const services = [
    { name: "Đặt lịch khám bác sĩ", icon: <FaStethoscope /> },
    { name: "Đặt lịch khám chuyên khoa", icon: <FaHeartbeat /> },
    { name: "Đặt lịch xét nghiệm", icon: <FaClipboardList /> },
    { name: "Đặt lịch tiêm chủng", icon: <FaSyringe /> },
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

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-12">
      <style jsx>{`
        @import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap");
        body {
          font-family: "Inter", sans-serif;
        }
        button {
          transition: all 0.3s ease-in-out;
        }
        button:hover {
          transform: translateY(-2px);
        }
        button:focus {
          outline: none;
          box-shadow: 0 0 0 2px rgba(34, 197, 94, 0.5);
        }
      `}</style>
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {services.map((service) => (
          <button
            key={service.name}
            type="button"
            onClick={() => onServiceSelect(service.name)}
            aria-pressed={selectedService === service.name}
            className={`flex flex-col items-center justify-center p-6 rounded-lg bg-white border-2 border-gray-200 hover:border-green-500 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-300 ease-in-out ${
              selectedService === service.name
                ? "bg-green-50 border-green-500 shadow-md"
                : ""
            }`}
          >
            <span className="text-4xl text-green-600 mb-4">{service.icon}</span>
            <span className="text-base font-semibold text-gray-800 text-center">
              {service.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Booking;
