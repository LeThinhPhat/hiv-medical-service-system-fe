import React, { useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import ARVmanagementService from "../../Services/ManagerService/ARVmanagement";
import { Visibility, Edit, Delete } from "@mui/icons-material";

const ARVManagement = () => {
  const [regimens, setRegimens] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRegimen, setSelectedRegimen] = useState(null);

  useEffect(() => {
    const fetchRegimens = async () => {
      try {
        const data = await ARVmanagementService.getRegiments();
        setRegimens(data.data);
      } catch (error) {
        console.error("Lỗi lấy danh sách phác đồ:", error);
        toast.error(`Lỗi lấy danh sách phác đồ: ${error.message}`);
      }
    };
    fetchRegimens();
  }, []);

  const handleSearch = (e) => setSearchTerm(e.target.value);

  const filteredRegimens = regimens.filter((r) =>
    [r.name, r.description].some((field) =>
      field.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleViewDetails = (regimen) => {
    setSelectedRegimen(regimen);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedRegimen(null);
  };

  const handleDelete = (id) => {
    const updated = regimens.filter((r) => r._id !== id);
    setRegimens(updated);
    toast.success("Đã xóa phác đồ!");
  };

  const truncateText = (text, maxLength = 50) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <div className="Container mx-auto px-4 py-6">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          success: {
            style: {
              background: "#2dd4bf",
              color: "#fff",
            },
          },
          error: {
            style: {
              background: "#f87171",
              color: "#fff",
            },
          },
        }}
      />
      <h1 className="text-3xl font-bold text-teal-600 mb-6">
        Quản Lý Phác Đồ ARV
      </h1>

      <div className="bg-white p-4 rounded-2xl shadow-lg mb-6">
        <input
          type="text"
          placeholder="Tìm kiếm phác đồ..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-full bg-white border border-teal-100 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600"
        />
      </div>

      {filteredRegimens.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg p-6 text-center text-gray-500">
          Không có phác đồ nào phù hợp
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRegimens.map((regimen) => (
            <div
              key={regimen._id}
              className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {regimen.name}
              </h3>
              <p className="text-sm text-gray-700 mb-1">
                <span className="font-medium">Loại:</span>{" "}
                <span className="inline-block bg-teal-100 text-teal-800 px-2 py-1 rounded-full text-xs">
                  {regimen.regimenType}
                </span>
              </p>
              <p className="text-sm text-gray-700 mb-1">
                <span className="font-medium">Mô tả:</span>{" "}
                {truncateText(regimen.description)}
              </p>
              <p className="text-sm text-gray-700 mb-4">
                <span className="font-medium">Tác dụng phụ:</span>{" "}
                {truncateText(regimen.sideEffects)}
              </p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => handleViewDetails(regimen)}
                  className="text-teal-600 hover:text-teal-700"
                  title="Xem chi tiết"
                >
                  <Visibility fontSize="small" />
                </button>
                <button
                  onClick={() =>
                    toast.error("Chức năng sửa chưa được triển khai!")
                  }
                  className="text-blue-600 hover:text-blue-700"
                  title="Sửa"
                >
                  <Edit fontSize="small" />
                </button>
                <button
                  onClick={() => handleDelete(regimen._id)}
                  className="text-red-600 hover:text-red-700"
                  title="Xóa"
                >
                  <Delete fontSize="small" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Xem chi tiết */}
      {openDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl">
            <h2 className="text-xl font-bold text-teal-600 mb-4">
              Chi tiết phác đồ
            </h2>
            {selectedRegimen && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {selectedRegimen.name}
                  </h3>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Loại:</span>{" "}
                    {selectedRegimen.regimenType}
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Mô tả:</span>{" "}
                    {selectedRegimen.description}
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Tác dụng phụ:</span>{" "}
                    {selectedRegimen.sideEffects}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Tiêu chí áp dụng:
                  </h4>
                  <ul className="pl-4 space-y-1 text-sm text-gray-700 list-disc">
                    {selectedRegimen.criteria.map((c) => (
                      <li key={c._id}>
                        {c.test_type} {c.operator} {c.value}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Thuốc sử dụng:
                  </h4>
                  <ul className="pl-4 space-y-1 text-sm text-gray-700 list-disc">
                    {selectedRegimen.drugs.map((d) => (
                      <li key={d._id}>
                        {d.drugId.genericName} - {d.dosage} (
                        {d.frequency.join(", ")})
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
            <div className="flex justify-end mt-6">
              <button
                onClick={handleCloseDialog}
                className="bg-gray-200 text-gray-700 rounded-lg px-4 py-2 hover:bg-gray-300 transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ARVManagement;
