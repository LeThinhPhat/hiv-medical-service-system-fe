import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import drugsManagerService from "../../Services/ManagerService/drugsManagerService";

const DetailDrugs = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    genericName: "",
    manufacturer: "",
    group: "",
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchDrugDetail();
  }, []);

  const fetchDrugDetail = async () => {
    try {
      const drug = await drugsManagerService.getDrugById(token, id);
      setFormData({
        genericName: drug.genericName || "",
        manufacturer: drug.manufacturer || "",
        group: drug.group?.[0] || "",
      });
    } catch (error) {
      console.error("Lỗi khi lấy chi tiết thuốc:", error);
      toast.error(`Lỗi khi lấy chi tiết thuốc: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (
      !formData.genericName.trim() ||
      !formData.manufacturer.trim() ||
      !formData.group.trim()
    ) {
      toast.error("Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    try {
      setUpdating(true);
      await drugsManagerService.updateDrug(token, id, {
        ...formData,
        group: [formData.group.trim()],
      });
      toast.success("Cập nhật thuốc thành công!");
      navigate("/manager/drugs");
    } catch (error) {
      console.error("Lỗi khi cập nhật thuốc:", error);
      toast.error(
        `Cập nhật thất bại: ${error.response?.data?.message || error.message}`
      );
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 mb-10">
      <div className="bg-white rounded-2xl shadow-lg p-6">
        {loading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-teal-600"></div>
          </div>
        ) : (
          <div className="bg-teal-50 border border-teal-100 rounded-xl p-6">
            <h1 className="text-3xl font-bold text-teal-600 mb-6">
              Cập Nhật Thông Tin Thuốc
            </h1>

            <div className="mb-4">
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

            <div className="mb-4">
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

            <div className="mb-6">
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

            <div className="flex justify-end gap-3">
              <button
                onClick={() => navigate("/manager/drugs")}
                className="bg-gray-200 text-gray-700 rounded-lg px-4 py-2 hover:bg-gray-300 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleUpdate}
                disabled={updating}
                className={`bg-teal-600 text-white rounded-lg px-4 py-2 hover:bg-teal-700 transition-colors ${
                  updating ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {updating ? "Đang cập nhật..." : "Cập nhật"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailDrugs;
