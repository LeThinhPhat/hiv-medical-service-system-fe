import React, { useState, useEffect } from "react";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaTimes,
  FaCheckCircle,
  FaSpinner,
} from "react-icons/fa";
import facilityInfoService from "../../../Services/StaffService/facilityInfoService";

const FacilityInfoManager = () => {
  const [facilities, setFacilities] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [facilityToDelete, setFacilityToDelete] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const [form, setForm] = useState({
    name: "",
    description: "",
    contactInfo: "",
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    loadFacilities();
  }, []);

  const loadFacilities = async () => {
    if (!token) {
      setToast({
        show: true,
        message: "Vui lòng đăng nhập để tiếp tục!",
        type: "error",
      });
      setTimeout(
        () => setToast({ show: false, message: "", type: "success" }),
        3000
      );
      return;
    }
    setLoading(true);
    try {
      const data = await facilityInfoService.getAll(token);
      setFacilities(data);
    } catch (error) {
      console.error("Lỗi khi tải cơ sở:", error);
      setToast({
        show: true,
        message: error.response?.data?.message || "Lỗi khi tải cơ sở!",
        type: "error",
      });
      setTimeout(
        () => setToast({ show: false, message: "", type: "success" }),
        3000
      );
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = (facility = null) => {
    setEditing(facility);
    setForm(
      facility || {
        name: "",
        description: "",
        contactInfo: "",
      }
    );
    setOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!form.name || !form.description || !form.contactInfo) {
      setToast({
        show: true,
        message: "Vui lòng điền đầy đủ thông tin!",
        type: "error",
      });
      setTimeout(
        () => setToast({ show: false, message: "", type: "success" }),
        3000
      );
      return;
    }
    try {
      if (editing) {
        const updated = await facilityInfoService.update(
          editing._id,
          form,
          token
        );
        setFacilities((prev) =>
          prev.map((f) => (f._id === editing._id ? updated : f))
        );
        setToast({
          show: true,
          message: "Cập nhật cơ sở thành công!",
          type: "success",
        });
      } else {
        const created = await facilityInfoService.create(form, token);
        setFacilities((prev) => [...prev, created]);
        setToast({
          show: true,
          message: "Tạo cơ sở thành công!",
          type: "success",
        });
      }
      setTimeout(
        () => setToast({ show: false, message: "", type: "success" }),
        3000
      );
      setOpen(false);
    } catch (error) {
      console.error("Lỗi khi lưu:", error);
      setToast({
        show: true,
        message: error.response?.data?.message || "Lỗi khi lưu cơ sở!",
        type: "error",
      });
      setTimeout(
        () => setToast({ show: false, message: "", type: "success" }),
        3000
      );
    }
  };

  const handleDelete = (id) => {
    setFacilityToDelete(id);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await facilityInfoService.delete(facilityToDelete, token);
      setFacilities((prev) => prev.filter((f) => f._id !== facilityToDelete));
      setToast({
        show: true,
        message: "Xóa cơ sở thành công!",
        type: "success",
      });
      setTimeout(
        () => setToast({ show: false, message: "", type: "success" }),
        3000
      );
    } catch (error) {
      console.error("Lỗi khi xóa:", error);
      setToast({
        show: true,
        message: error.response?.data?.message || "Lỗi khi xóa cơ sở!",
        type: "error",
      });
      setTimeout(
        () => setToast({ show: false, message: "", type: "success" }),
        3000
      );
    }
    setConfirmOpen(false);
    setFacilityToDelete(null);
  };

  const handleCancelDelete = () => {
    setConfirmOpen(false);
    setFacilityToDelete(null);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toast.show && (
        <div
          className={`fixed top-6 right-6 z-50 bg-white/90 backdrop-blur-sm px-4 py-3 rounded-xl shadow-lg border transition-all duration-300 animate-in zoom-in-95 fade-in ${
            toast.type === "success"
              ? "text-green-600 border-green-200/50"
              : "text-red-600 border-red-200/50"
          }`}
        >
          {toast.type === "success" ? (
            <div className="flex items-center gap-2">
              <FaCheckCircle />
              {toast.message}
            </div>
          ) : (
            toast.message
          )}
        </div>
      )}

      {/* Add Facility Button */}
      <button
        onClick={() => handleOpen()}
        className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 font-medium shadow-sm flex items-center gap-2"
      >
        <FaPlus /> Thêm cơ sở
      </button>

      {/* Loading State */}
      {loading ? (
        <div className="flex items-center justify-center py-6">
          <FaSpinner className="animate-spin text-blue-600 text-2xl mr-2" />
          <span className="text-gray-600 text-sm">Đang tải...</span>
        </div>
      ) : (
        /* Facility Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {facilities.map((f) => (
            <div
              key={f._id}
              className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md p-6 border border-gray-200/50 hover:shadow-lg hover:border-blue-200 transition-all duration-300 animate-in fade-in"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {f.name}
              </h3>
              <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                {f.description.length > 100
                  ? `${f.description.substring(0, 100)}...`
                  : f.description}
              </p>
              <p className="text-xs text-gray-500 mb-4">
                Liên hệ: {f.contactInfo}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleOpen(f)}
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full hover:from-blue-600 hover:to-blue-700 transition-all duration-300 font-medium flex items-center gap-2"
                >
                  <FaEdit /> Sửa
                </button>
                <button
                  onClick={() => handleDelete(f._id)}
                  className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full hover:from-red-600 hover:to-red-700 transition-all duration-300 font-medium flex items-center gap-2"
                >
                  <FaTrash /> Xoá
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      {open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50 transition-opacity duration-300 animate-in fade-in">
          <div className="bg-white/95 backdrop-blur-md p-6 rounded-2xl shadow-2xl w-full max-w-lg border border-gray-100/50">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-900">
                {editing ? "Sửa cơ sở" : "Thêm cơ sở"}
              </h3>
              <FaTimes
                className="text-gray-500 hover:text-gray-700 cursor-pointer transition-colors duration-200"
                onClick={() => setOpen(false)}
              />
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tên cơ sở
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-gray-700 placeholder-gray-400"
                  placeholder="Nhập tên cơ sở"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Mô tả
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-gray-700 placeholder-gray-400"
                  placeholder="Nhập mô tả"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Thông tin liên hệ
                </label>
                <input
                  type="text"
                  name="contactInfo"
                  value={form.contactInfo}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-gray-700 placeholder-gray-400"
                  placeholder="Nhập thông tin liên hệ"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition-all duration-300 font-medium"
              >
                Hủy
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full hover:from-blue-600 hover:to-blue-700 transition-all duration-300 font-medium flex items-center gap-2"
              >
                <FaCheckCircle /> Lưu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {confirmOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50 transition-opacity duration-300 animate-in fade-in">
          <div className="bg-white/95 backdrop-blur-md p-6 rounded-2xl shadow-2xl w-full max-w-md border border-gray-100/50">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-900">
                Xác nhận xóa
              </h3>
              <FaTimes
                className="text-gray-500 hover:text-gray-700 cursor-pointer transition-colors duration-200"
                onClick={handleCancelDelete}
              />
            </div>
            <p className="text-gray-600 mb-6">
              Bạn có chắc chắn muốn xóa cơ sở này?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={handleCancelDelete}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition-all duration-300 font-medium"
              >
                Không
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full hover:from-red-600 hover:to-red-700 transition-all duration-300 font-medium flex items-center gap-2"
              >
                <FaTrash /> Có
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FacilityInfoManager;
