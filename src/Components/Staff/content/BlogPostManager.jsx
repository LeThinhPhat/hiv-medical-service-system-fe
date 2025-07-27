import React, { useState, useEffect } from "react";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaTimes,
  FaCheckCircle,
} from "react-icons/fa";
import blogService from "../../../Services/StaffService/blogService";

const BlogPostManager = () => {
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const [form, setForm] = useState({
    title: "",
    content: "",
    status: "",
    images: [""],
    authorID: "admin-id-test",
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await blogService.getAllBlogPosts();
        setPosts(data);
      } catch (err) {
        console.error(err);
        setToast({
          show: true,
          message: "Lỗi khi tải bài viết!",
          type: "error",
        });
        setTimeout(
          () => setToast({ show: false, message: "", type: "success" }),
          3000
        );
      }
    };
    fetchData();
  }, []);

  const handleOpen = (post = null) => {
    setEditing(post);
    setForm(
      post || {
        title: "",
        content: "",
        status: "",
        images: [""],
        authorID: "admin-id-test",
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
        const updated = await blogService.updateBlogPost(
          editing._id,
          form,
          token
        );
        setPosts((prev) =>
          prev.map((p) => (p._id === editing._id ? updated : p))
        );
        setToast({
          show: true,
          message: "Cập nhật bài viết thành công!",
          type: "success",
        });
      } else {
        const created = await blogService.createBlogPost(form, token);
        setPosts((prev) => [...prev, created]);
        setToast({
          show: true,
          message: "Tạo bài viết thành công!",
          type: "success",
        });
      }
      setTimeout(
        () => setToast({ show: false, message: "", type: "success" }),
        3000
      );
      setOpen(false);
    } catch (err) {
      console.error(err);
      setToast({ show: true, message: "Lỗi khi lưu bài viết!", type: "error" });
      setTimeout(
        () => setToast({ show: false, message: "", type: "success" }),
        3000
      );
    }
  };

  const handleDelete = (id) => {
    setPostToDelete(id);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await blogService.deleteBlogPost(postToDelete, token);
      setPosts((prev) => prev.filter((p) => p._id !== postToDelete));
      setToast({
        show: true,
        message: "Xóa bài viết thành công!",
        type: "success",
      });
      setTimeout(
        () => setToast({ show: false, message: "", type: "success" }),
        3000
      );
    } catch (err) {
      console.error(err);
      setToast({ show: true, message: "Lỗi khi xóa bài viết!", type: "error" });
      setTimeout(
        () => setToast({ show: false, message: "", type: "success" }),
        3000
      );
    }
    setConfirmOpen(false);
    setPostToDelete(null);
  };

  const handleCancelDelete = () => {
    setConfirmOpen(false);
    setPostToDelete(null);
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

      {/* Add Post Button */}
      <button
        onClick={() => handleOpen()}
        className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 font-medium shadow-sm flex items-center gap-2"
      >
        <FaPlus /> Thêm bài viết
      </button>

      {/* Blog Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {posts.map((p) => (
          <div
            key={p._id}
            className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md p-6 border border-gray-200/50 hover:shadow-lg hover:border-blue-200 transition-all duration-300 animate-in fade-in"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {p.title}
            </h3>
            <p className="text-gray-600 text-sm mb-3 line-clamp-3">
              {p.content}
            </p>
            <p className="text-xs text-gray-500 mb-4">Trạng thái: {p.status}</p>
            <div className="flex gap-2">
              <button
                onClick={() => handleOpen(p)}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full hover:from-blue-600 hover:to-blue-700 transition-all duration-300 font-medium flex items-center gap-2"
              >
                <FaEdit /> Sửa
              </button>
              <button
                onClick={() => handleDelete(p._id)}
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
                {editing ? "Sửa bài viết" : "Thêm bài viết"}
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
                  Trạng thái
                </label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-gray-700"
                >
                  <option value="">-- Chọn trạng thái --</option>
                  <option value="Hiển thị">Hiển thị</option>
                  <option value="Ẩn">Ẩn</option>
                </select>
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
              Bạn có chắc chắn muốn xóa bài viết này?
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

export default BlogPostManager;
