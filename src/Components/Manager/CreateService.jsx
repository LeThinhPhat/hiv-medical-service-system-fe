import React from "react";
import servicesManagerService from "../../Services/ManagerService/servicesManagerService";

const CreateServiceExample = () => {
  const token = localStorage.getItem("token");

  const handleCreate = async () => {
    const newService = {
      name: "Khám tai mũi họng",
      price: 200000,
      durationMinutes: 30,
    };

    try {
      const res = await servicesManagerService.createService(token, newService);
      console.log("Tạo dịch vụ thành công:", res.data);
    } catch (err) {
      console.error("Lỗi khi tạo dịch vụ:", err.response?.data || err.message);
    }
  };

  return (
    <button
      onClick={handleCreate}
      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
    >
      Tạo dịch vụ mới
    </button>
  );
};

export default CreateServiceExample;
