import React, { useEffect, useState } from "react";
import personalARVService from "../../Services/DoctorService/personalARVService";

const DetailPersonalARV = ({ regimenId, token }) => {
  const [regimen, setRegimen] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      setError("");

      try {
        const res = await personalARVService.getPrescribedRegimenById(
          token,
          regimenId
        );
        setRegimen(res.data);
      } catch (err) {
        console.error("❌ Lỗi khi lấy chi tiết phác đồ:", err);
        setError("Không thể tải dữ liệu. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    if (regimenId && token) {
      fetchDetail();
    }
  }, [regimenId, token]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        {error}
      </div>
    );
  }

  if (!regimen) {
    return null;
  }

  const { baseRegimentID, customDrugs, prescribedDate } = regimen;

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 h-full">
      <div className="bg-gradient-to-r from-blue-600 to-blue-400 p-6">
        <h2 className="text-2xl font-bold text-white flex items-center">
          Thông tin phác đồ cá nhân hóa
        </h2>
      </div>

      <div className="p-6 space-y-6">
        <div className="text-gray-600 text-base">
          <span className="font-semibold">Ngày kê đơn:</span>{" "}
          {new Date(prescribedDate).toLocaleString()}
        </div>

        <div className="border-t border-gray-200 pt-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center">
            Phác đồ gốc: {baseRegimentID.name} ({baseRegimentID.regimenType})
          </h3>
          <p className="mt-2 text-gray-600 text-base">
            <span className="font-medium">Tác dụng phụ:</span>{" "}
            {baseRegimentID.sideEffects || "Không có"}
          </p>
        </div>

        <div className="border-t border-gray-200 pt-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
            Thuốc đã được điều chỉnh
          </h3>
          <div className="space-y-3">
            {customDrugs.map((drug, index) => (
              <div
                key={index}
                className="bg-gray-50 p-4 rounded-lg border border-gray-200"
              >
                <h4 className="font-medium text-gray-800 text-base">
                  {drug.drugId.genericName} ({drug.dosage})
                </h4>
                <div className="mt-2 text-gray-600 text-base space-y-1">
                  <p>
                    <span className="font-medium">Nhóm:</span>{" "}
                    {drug.drugId.group.join(", ")}
                  </p>
                  <p>
                    <span className="font-medium">Uống:</span>{" "}
                    {drug.frequency.join(", ")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailPersonalARV;
