import React, { useState, useEffect } from "react";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaTimes,
  FaCheckCircle,
} from "react-icons/fa";
import educationalDocumentService from "../../../Services/StaffService/educationalDocumentService";

const EducationalDocumentManager = () => {
  const [docs, setDocs] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [docToDelete, setDocToDelete] = useState(null);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const [form, setForm] = useState({
    title: "",
    content: "",
    fileURL: "",
    status: "",
  });

  const token = localStorage.getItem("token");

  const fetchDocuments = async () => {
    try {
      const result = await educationalDocumentService.getAllDocuments();
      setDocs(result);
    } catch (err) {
      console.error("Lỗi khi lấy danh sách tài liệu:", err);
      setToast({ show: true, message: "Lỗi khi tải tài liệu!", type: "error" });
      setTimeout(
        () => setToast({ show: false, message: "", type: "success" }),
        3000
      );
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleOpen = (doc = null) => {
    setEditing(doc);
    setForm(
      doc || {
        title: "",
        content: "",
        fileURL: "",
        status: "",
      }
    );
    setOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      if (editing) {
        const updated = await educationalDocumentService.updateDocument(
          editing._id,
          form,
          token
        );
        setDocs((prev) =>
          prev.map((d) => (d._id === editing._id ? updated : d))
        );
        setToast({
          show: true,
          message: "Cập nhật tài liệu thành công!",
          type: "success",
        });
      } else {
        const created = await educationalDocumentService.createDocument(
          form,
          token
        );
        setDocs((prev) => [...prev, created]);
        setToast({
          show: true,
          message: "Tạo tài liệu thành công!",
          type: "success",
        });
      }
      setTimeout(
        () => setToast({ show: false, message: "", type: "success" }),
        3000
      );
      setOpen(false);
    } catch (err) {
      console.error("Lỗi khi lưu tài liệu:", err);
      setToast({ show: true, message: "Lỗi khi lưu tài liệu!", type: "error" });
      setTimeout(
        () => setToast({ show: false, message: "", type: "success" }),
        3000
      );
    }
  };

  const handleDelete = (id) => {
    setDocToDelete(id);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await educationalDocumentService.deleteDocument(docToDelete, token);
      setDocs((prev) => prev.filter((d) => d._id !== docToDelete));
      setToast({
        show: true,
        message: "Xóa tài liệu thành công!",
        type: "success",
      });
      setTimeout(
        () => setToast({ show: false, message: "", type: "success" }),
        3000
      );
    } catch (err) {
      console.error("Lỗi khi xóa tài liệu:", err);
      setToast({ show: true, message: "Lỗi khi xóa tài liệu!", type: "error" });
      setTimeout(
        () => setToast({ show: false, message: "", type: "success" }),
        3000
      );
    }
    setConfirmOpen(false);
    setDocToDelete(null);
  };

  const handleCancelDelete = () => {
    setConfirmOpen(false);
    setDocToDelete(null);
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

      {/* Add Document Button */}
      <button
        onClick={() => handleOpen()}
        className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 font-medium shadow-sm flex items-center gap-2"
      >
        <FaPlus /> Thêm tài liệu
      </button>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {docs.map((d) => (
          <div
            key={d._id}
            className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md p-6 border border-gray-200/50 hover:shadow-lg hover:border-blue-200 transition-all duration-300 animate-in fade-in"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {d.title}
            </h3>
            <p className="text-gray-600 text-sm mb-3 line-clamp-3">
              {d.content}
            </p>
            <p className="text-xs text-gray-500 mb-3">
              File:{" "}
              <a
                href={d.fileURL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-700 transition-colors duration-200"
              >
                {d.fileURL}
              </a>
            </p>
            <p className="text-xs text-gray-500 mb-4">Trạng thái: {d.status}</p>
            <div className="flex gap-2">
              <button
                onClick={() => handleOpen(d)}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full hover:from-blue-600 hover:to-blue-700 transition-all duration-300 font-medium flex items-center gap-2"
              >
                <FaEdit /> Sửa
              </button>
              <button
                onClick={() => handleDelete(d._id)}
                className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full hover:from-red-600 hover:to-red-700 transition-all duration-300 font-medium flex items-center gap-2"
              >
                <FaTrash /> Xoá
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create/Edit Modal */}
      {open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50 transition-opacity duration-300 animate-in fade-in">
          <div className="bg-white/95 backdrop-blur-md p-6 rounded-2xl shadow-2xl w-full max-w-lg border border-gray-100/50">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-900">
                {editing ? "Sửa tài liệu" : "Thêm tài liệu"}
              </h3>
              <FaTimes
                className="text-gray-500 hover:text-gray-700 cursor-pointer transition-colors duration-200"
                onClick={() => setOpen(false)}
              />
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tiêu đề
                </label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-gray-700 placeholder-gray-400"
                  placeholder="Nhập tiêu đề"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nội dung
                </label>
                <textarea
                  name="content"
                  value={form.content}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-gray-700 placeholder-gray-400"
                  placeholder="Nhập nội dung"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  URL file
                </label>
                <input
                  type="text"
                  name="fileURL"
                  value={form.fileURL}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-gray-700 placeholder-gray-400"
                  placeholder="Nhập URL file"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Trạng thái
                </label>
                <input
                  type="text"
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-gray-700 placeholder-gray-400"
                  placeholder="Nhập trạng thái"
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
              Bạn có chắc chắn muốn xóa tài liệu này?
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

export default EducationalDocumentManager;
