import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import servicesManagerService from "../../Services/ManagerService/servicesManagerService";

const ManagerService = () => {
  const [services, setServices] = useState([]);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({ price: "", durationMinutes: "" });

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchServices();
  }, []);

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

  const handleEditClick = (service) => {
    setEditId(service._id);
    setFormData({
      price: service.price,
      durationMinutes: service.durationMinutes,
    });
  };

  const handleCancel = () => {
    setEditId(null);
    setFormData({ price: "", durationMinutes: "" });
  };

  const handleUpdate = async () => {
    if (formData.durationMinutes < 15) {
      toast.error("Không thành công. Thời lượng không được ngắn hơn 15 phút.");
      return;
    }

    try {
      await servicesManagerService.updateServiceById(editId, formData, token);
      toast.success("Cập nhật thành công!");
      setEditId(null);
      fetchServices();
    } catch (err) {
      console.error("Lỗi cập nhật dịch vụ:", err);
      toast.error("Cập nhật thất bại");
    }
  };

  return (
    <div className="p-4">
      <ToastContainer />
      <h2 className="text-xl font-semibold mb-4">Danh sách dịch vụ</h2>
      <ul className="space-y-2">
        {services.map((s) => (
          <li
            key={s._id}
            className="border p-3 rounded shadow-sm bg-white flex flex-col gap-2"
          >
            <div className="flex justify-between items-center">
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
            </div>

            {editId === s._id && (
              <div className="mt-2 flex gap-2 flex-wrap">
                <input
                  type="number"
                  placeholder="Giá mới"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: Number(e.target.value) })
                  }
                  className="border p-1 rounded w-40"
                />
                <input
                  type="number"
                  placeholder="Thời lượng (phút)"
                  value={formData.durationMinutes}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      durationMinutes: Number(e.target.value),
                    })
                  }
                  className="border p-1 rounded w-40"
                />
                <button
                  onClick={handleUpdate}
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                >
                  Lưu
                </button>
                <button
                  onClick={handleCancel}
                  className="bg-gray-300 px-3 py-1 rounded"
                >
                  Hủy
                </button>
              </div>
            )}

            {editId !== s._id && (
              <button
                onClick={() => handleEditClick(s)}
                className="flex items-center gap-1 text-sm self-end border border-blue-500 text-blue-500 px-2 py-1 rounded hover:bg-blue-500 hover:text-white transition"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.862 4.487a2.25 2.25 0 013.182 3.182L7.5 20.182H4.5v-3L16.862 4.487z"
                  />
                </svg>
                Chỉnh sửa
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManagerService;
