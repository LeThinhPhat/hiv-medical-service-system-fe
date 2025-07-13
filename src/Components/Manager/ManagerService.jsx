import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import servicesManagerService from "../../Services/ManagerService/servicesManagerService";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const ManagerService = () => {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({ price: "", durationMinutes: "" });
  const [newService, setNewService] = useState({
    name: "",
    price: "",
    durationMinutes: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await servicesManagerService.getAllServices(token);
      if (Array.isArray(res.data.data)) {
        setServices(res.data.data);
        setFilteredServices(res.data.data);
      } else {
        console.error("Dữ liệu dịch vụ không hợp lệ.");
        toast.error("Dữ liệu dịch vụ không hợp lệ.");
      }
    } catch (err) {
      console.error("Lỗi khi lấy danh sách dịch vụ:", err);
      toast.error(`Lỗi khi lấy danh sách dịch vụ: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = services;

    if (searchTerm) {
      filtered = filtered.filter((service) =>
        service.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedStatus) {
      filtered = filtered.filter((service) =>
        selectedStatus === "Đang hoạt động"
          ? service.isActive
          : !service.isActive
      );
    }

    setFilteredServices(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchTerm, selectedStatus, services]);

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
      toast.error("Thời lượng không được ngắn hơn 15 phút.");
      return;
    }

    try {
      await servicesManagerService.updateServiceById(editId, formData, token);
      toast.success("Cập nhật dịch vụ thành công!");
      setEditId(null);
      fetchServices();
    } catch (err) {
      console.error("Lỗi cập nhật dịch vụ:", err);
      toast.error(
        `Cập nhật dịch vụ thất bại: ${
          err.response?.data?.message || err.message
        }`
      );
    }
  };

  const handleCreate = async () => {
    if (
      !newService.name ||
      !newService.price ||
      newService.durationMinutes < 15
    ) {
      toast.error("Vui lòng nhập đầy đủ và hợp lệ thông tin dịch vụ.");
      return;
    }

    try {
      await servicesManagerService.createService(newService, token);
      toast.success("Tạo dịch vụ thành công!");
      setNewService({ name: "", price: "", durationMinutes: "" });
      setOpenCreateDialog(false);
      fetchServices();
    } catch (err) {
      console.error("Lỗi tạo dịch vụ:", err);
      toast.error(
        `Tạo dịch vụ thất bại: ${err.response?.data?.message || err.message}`
      );
    }
  };

  const handleDelete = async () => {
    try {
      await servicesManagerService.deleteServiceById(selectedId, token);
      toast.success("Xóa dịch vụ thành công!");
      fetchServices();
    } catch (err) {
      console.error("Lỗi xóa dịch vụ:", err);
      toast.error(
        `Xóa dịch vụ thất bại: ${err.response?.data?.message || err.message}`
      );
    } finally {
      setOpenDeleteDialog(false);
      setSelectedId(null);
    }
  };

  const handleOpenCreateDialog = () => {
    setOpenCreateDialog(true);
  };

  const handleCloseCreateDialog = () => {
    setOpenCreateDialog(false);
    setNewService({ name: "", price: "", durationMinutes: "" });
  };

  const handleOpenDeleteDialog = (id) => {
    setSelectedId(id);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedId(null);
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentServices = filteredServices.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredServices.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="Container mx-auto mt-10 mb-10">
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-teal-600">Quản Lý Dịch Vụ</h1>
          <button
            onClick={handleOpenCreateDialog}
            className="bg-teal-600 text-white rounded-lg px-4 py-2 hover:bg-teal-700 transition-colors"
          >
            Tạo Dịch Vụ
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Tìm kiếm theo tên dịch vụ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-1/3 bg-white border border-teal-100 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600"
          />
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full sm:w-1/4 bg-white border border-teal-100 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="Đang hoạt động">Đang hoạt động</option>
            <option value="Ngưng">Ngưng</option>
          </select>
        </div>

        {/* Create Service Dialog */}
        {openCreateDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            <div className="bg-teal-50 rounded-xl p-6 w-full max-w-md">
              <h2 className="text-xl font-bold text-teal-600 mb-4">
                Tạo Dịch Vụ Mới
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Tên Dịch Vụ
                  </label>
                  <input
                    type="text"
                    placeholder="Tên dịch vụ"
                    value={newService.name}
                    onChange={(e) =>
                      setNewService({ ...newService, name: e.target.value })
                    }
                    className="w-full bg-white border border-teal-100 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Giá (VNĐ)
                  </label>
                  <input
                    type="number"
                    placeholder="Giá"
                    value={newService.price}
                    onChange={(e) =>
                      setNewService({
                        ...newService,
                        price: Number(e.target.value),
                      })
                    }
                    className="w-full bg-white border border-teal-100 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Thời Lượng (phút)
                  </label>
                  <input
                    type="number"
                    placeholder="Thời lượng (phút)"
                    value={newService.durationMinutes}
                    onChange={(e) =>
                      setNewService({
                        ...newService,
                        durationMinutes: Number(e.target.value),
                      })
                    }
                    className="w-full bg-white border border-teal-100 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={handleCloseCreateDialog}
                  className="bg-gray-200 text-gray-700 rounded-lg px-4 py-2 hover:bg-gray-300 transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={handleCreate}
                  className="bg-teal-600 text-white rounded-lg px-4 py-2 hover:bg-teal-700 transition-colors"
                >
                  Tạo
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        {openDeleteDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            <div className="bg-teal-50 rounded-xl p-6 w-full max-w-sm">
              <h2 className="text-xl font-bold text-teal-600 mb-4">
                Xác Nhận Xóa
              </h2>
              <p className="text-gray-700 mb-6">
                Bạn có chắc chắn muốn xóa dịch vụ này?
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={handleCloseDeleteDialog}
                  className="bg-gray-200 text-gray-700 rounded-lg px-4 py-2 hover:bg-gray-300 transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={handleDelete}
                  className="bg-red-600 text-white rounded-lg px-4 py-2 hover:bg-red-700 transition-colors"
                >
                  Xóa
                </button>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-teal-600"></div>
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-lg text-gray-500">Không có dịch vụ nào.</p>
          </div>
        ) : (
          <div className="bg-teal-50 border border-teal-100 rounded-xl shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-teal-600 text-white">
                <tr>
                  <th className="py-3 px-4 text-left font-medium">
                    Tên Dịch Vụ
                  </th>
                  <th className="py-3 px-4 text-left font-medium">Giá (VNĐ)</th>
                  <th className="py-3 px-4 text-left font-medium">
                    Thời Lượng (phút)
                  </th>
                  <th className="py-3 px-4 text-left font-medium">
                    Trạng Thái
                  </th>
                  <th className="py-3 px-4 text-center font-medium">
                    Hành Động
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentServices.map((s) => (
                  <tr
                    key={s._id}
                    className="hover:bg-teal-100 transition-colors"
                  >
                    <td className="py-3 px-4 text-gray-700">{s.name}</td>
                    <td className="py-3 px-4 text-gray-700">
                      {s.price.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-gray-700">
                      {s.durationMinutes}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                          s.isActive
                            ? "bg-green-500 text-white"
                            : "bg-red-500 text-white"
                        }`}
                      >
                        {s.isActive ? "Đang hoạt động" : "Ngưng"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      {editId === s._id ? (
                        <div className="flex justify-center gap-2">
                          <input
                            type="number"
                            placeholder="Giá mới (VNĐ)"
                            value={formData.price}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                price: Number(e.target.value),
                              })
                            }
                            className="w-24 bg-white border border-teal-100 rounded-lg px-2 py-1 text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600"
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
                            className="w-24 bg-white border border-teal-100 rounded-lg px-2 py-1 text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600"
                          />
                          <button
                            onClick={handleUpdate}
                            className="bg-teal-600 text-white rounded-lg px-3 py-1 hover:bg-teal-700 transition-colors"
                          >
                            Lưu
                          </button>
                          <button
                            onClick={handleCancel}
                            className="bg-gray-200 text-gray-700 rounded-lg px-3 py-1 hover:bg-gray-300 transition-colors"
                          >
                            Hủy
                          </button>
                        </div>
                      ) : (
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleEditClick(s)}
                            className="text-teal-600 hover:text-teal-700 transition-colors"
                            title="Chỉnh sửa"
                          >
                            <EditIcon fontSize="small" />
                          </button>
                          <button
                            onClick={() => handleOpenDeleteDialog(s._id)}
                            className="text-red-600 hover:text-red-700 transition-colors"
                            title="Xóa dịch vụ"
                          >
                            <DeleteIcon fontSize="small" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {filteredServices.length > 0 && (
          <div className="flex justify-between items-center mt-4">
            <div className="text-gray-600">
              Hiển thị {indexOfFirstItem + 1} -{" "}
              {Math.min(indexOfLastItem, filteredServices.length)} /{" "}
              {filteredServices.length} dịch vụ
            </div>
            <div className="flex gap-2">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded-lg ${
                  currentPage === 1
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-teal-600 text-white hover:bg-teal-700"
                }`}
              >
                Trước
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-1 rounded-lg ${
                      currentPage === page
                        ? "bg-teal-600 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded-lg ${
                  currentPage === totalPages
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-teal-600 text-white hover:bg-teal-700"
                }`}
              >
                Sau
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManagerService;
