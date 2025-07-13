import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import drugsManagerService from "../../Services/ManagerService/drugsManagerService";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";

const ManagerDrugs = () => {
  const [drugs, setDrugs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [drugToDelete, setDrugToDelete] = useState(null);
  const [formData, setFormData] = useState({
    genericName: "",
    manufacturer: "",
    group: "",
  });

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    fetchDrugs();
  }, []);

  const fetchDrugs = async () => {
    setLoading(true);
    try {
      const data = await drugsManagerService.getAllDrugs(token);
      setDrugs(data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách thuốc:", error);
      toast.error(`Lỗi khi lấy danh sách thuốc: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setDrugToDelete(id);
    setOpenConfirmDialog(true);
  };

  const confirmDelete = async () => {
    try {
      await drugsManagerService.deleteDrug(token, drugToDelete);
      toast.success("Xóa thuốc thành công!");
      fetchDrugs();
    } catch (error) {
      console.error("Lỗi khi xóa thuốc:", error);
      toast.error(
        `Lỗi khi xóa thuốc: ${error.response?.data?.message || error.message}`
      );
    } finally {
      setOpenConfirmDialog(false);
      setDrugToDelete(null);
    }
  };

  const handleOpenDialog = () => {
    setFormData({ genericName: "", manufacturer: "", group: "" });
    setOpenDialog(true);
  };

  const handleSubmit = async () => {
    if (!formData.genericName.trim()) {
      toast.error("Vui lòng nhập tên thuốc!");
      return;
    }
    if (!formData.manufacturer.trim()) {
      toast.error("Vui lòng nhập nhà sản xuất!");
      return;
    }
    if (!formData.group.trim()) {
      toast.error("Vui lòng nhập nhóm thuốc!");
      return;
    }

    try {
      const dataToSend = {
        ...formData,
        group: [formData.group.trim()],
      };
      await drugsManagerService.createDrug(token, dataToSend);
      toast.success("Thêm thuốc thành công!");
      setOpenDialog(false);
      fetchDrugs();
    } catch (error) {
      console.error("Lỗi khi tạo thuốc:", error);
      toast.error(
        `Lỗi khi tạo thuốc: ${error.response?.data?.message || error.message}`
      );
    }
  };

  return (
    <div className="Container mx-auto mt-10 mb-10">
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-teal-600">Quản Lý Thuốc</h1>
          <button
            onClick={handleOpenDialog}
            className="bg-teal-600 text-white rounded-lg px-4 py-2 flex items-center gap-2 hover:bg-teal-700 transition-colors"
          >
            <AddIcon fontSize="small" />
            Thêm Thuốc
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-teal-600"></div>
          </div>
        ) : drugs.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-lg text-gray-500">
              Không có thuốc nào được tìm thấy.
            </p>
          </div>
        ) : (
          <div className="bg-teal-50 border border-teal-100 rounded-xl shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-teal-600 text-white">
                <tr>
                  <th className="py-3 px-4 text-left font-medium">Tên Thuốc</th>
                  <th className="py-3 px-4 text-left font-medium">
                    Nhà Sản Xuất
                  </th>
                  <th className="py-3 px-4 text-left font-medium">Nhóm</th>
                  <th className="py-3 px-4 text-left font-medium">Người Tạo</th>
                  <th className="py-3 px-4 text-center font-medium">
                    Hành Động
                  </th>
                </tr>
              </thead>
              <tbody>
                {drugs.map((drug) => (
                  <tr
                    key={drug._id}
                    className="hover:bg-teal-100 transition-colors"
                  >
                    <td className="py-3 px-4 text-gray-700">
                      {drug.genericName}
                    </td>
                    <td className="py-3 px-4 text-gray-700">
                      {drug.manufacturer}
                    </td>
                    <td className="py-3 px-4 text-gray-700">
                      {drug.group?.join(", ") || "N/A"}
                    </td>
                    <td className="py-3 px-4 text-gray-700">
                      {drug.createdBy?.email || "N/A"}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => navigate(`/manager/drugs/${drug._id}`)}
                          className="text-teal-600 hover:text-teal-700 transition-colors"
                          title="Xem chi tiết"
                        >
                          <EditIcon fontSize="small" />
                        </button>
                        <button
                          onClick={() => handleDelete(drug._id)}
                          className="text-red-600 hover:text-red-700 transition-colors"
                          title="Xóa thuốc"
                        >
                          <DeleteIcon fontSize="small" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Dialog thêm thuốc */}
        {openDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            <div className="bg-teal-50 rounded-xl p-6 w-full max-w-md">
              <h2 className="text-xl font-bold text-teal-600 mb-4">
                Thêm Thuốc Mới
              </h2>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="genericName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Tên thuốc
                  </label>
                  <input
                    type="text"
                    id="genericName"
                    value={formData.genericName}
                    onChange={(e) =>
                      setFormData({ ...formData, genericName: e.target.value })
                    }
                    className="w-full bg-white border border-teal-100 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600"
                  />
                </div>
                <div>
                  <label
                    htmlFor="manufacturer"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Nhà sản xuất
                  </label>
                  <input
                    type="text"
                    id="manufacturer"
                    value={formData.manufacturer}
                    onChange={(e) =>
                      setFormData({ ...formData, manufacturer: e.target.value })
                    }
                    className="w-full bg-white border border-teal-100 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600"
                  />
                </div>
                <div>
                  <label
                    htmlFor="group"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Nhóm thuốc (VD: INSTIs)
                  </label>
                  <input
                    type="text"
                    id="group"
                    value={formData.group}
                    onChange={(e) =>
                      setFormData({ ...formData, group: e.target.value })
                    }
                    className="w-full bg-white border border-teal-100 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setOpenDialog(false)}
                  className="bg-gray-200 text-gray-700 rounded-lg px-4 py-2 hover:bg-gray-300 transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={handleSubmit}
                  className="bg-teal-600 text-white rounded-lg px-4 py-2 hover:bg-teal-700 transition-colors"
                >
                  Lưu
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Dialog xác nhận xóa */}
        {openConfirmDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            <div className="bg-teal-50 rounded-xl p-6 w-full max-w-sm">
              <h2 className="text-xl font-bold text-teal-600 mb-4">
                Xác Nhận Xóa
              </h2>
              <p className="text-gray-700 mb-6">
                Bạn có chắc chắn muốn xóa thuốc này?
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setOpenConfirmDialog(false)}
                  className="bg-gray-200 text-gray-700 rounded-lg px-4 py-2 hover:bg-gray-300 transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={confirmDelete}
                  className="bg-red-600 text-white rounded-lg px-4 py-2 hover:bg-red-700 transition-colors"
                >
                  Xóa
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManagerDrugs;
