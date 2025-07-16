import React, { useEffect, useState } from 'react';
import ServicesService from '../Services/ServicesService';

const ServiceCard = ({ service }) => (
  <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
    <h3 className="text-lg font-semibold text-gray-800 mb-2">{service.name}</h3>
    <p className="text-gray-600 text-sm">
      Giá: {service.price?.toLocaleString('vi-VN')} VND
    </p>
    <p className="text-gray-600 text-sm">
      Thời gian: {service.durationMinutes} phút
    </p>
  </div>
);

const ServicesPage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await ServicesService.getAllService();
        setServices(data);
      } catch (error) {
        console.error('Không thể tải danh sách dịch vụ:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <svg
          className="animate-spin h-8 w-8 text-blue-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"
          ></path>
        </svg>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Danh sách dịch vụ
        </h2>
        {services.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">
            Không có dịch vụ nào.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <ServiceCard key={service._id} service={service} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ServicesPage;