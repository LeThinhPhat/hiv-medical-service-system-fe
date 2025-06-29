import React, { useEffect, useState } from "react";
import servicesManagerService from "../../Services/ManagerService/servicesManagerService";

const ManagerService = () => {
  const [services, setServices] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await servicesManagerService.getAllServices(token);
        if (Array.isArray(res.data.data)) {
          setServices(res.data.data);
        } else {
          console.error("Dữ liệu dịch vụ không hợp lệ.");
        }
      } catch (err) {
        console.error("Lỗi khi lấy danh sách dịch vụ:", err);
      }
    };

    fetchServices();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Danh sách dịch vụ</h2>
      <ul className="space-y-2">
        {services.map((s) => (
          <li
            key={s._id}
            className="border p-3 rounded shadow-sm bg-white flex justify-between"
          >
            <div>
              <p className="font-medium">{s.name}</p>
              <p className="text-sm text-gray-600">
                Giá: {s.price.toLocaleString()} VND | Thời lượng:{" "}
                {s.durationMinutes} phút
              </p>
            </div>
            <span
              className={`text-sm font-medium px-2 py-1 rounded ${
                s.isActive
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {s.isActive ? "Đang hoạt động" : "Ngưng"}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManagerService;
