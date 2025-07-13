import React, { useEffect, useState } from "react";
import ARVService from "../../Services/CusService/ARVService";

const TreatmentPlanPage = () => {
  const [regimentDetails, setRegimentDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const patient = JSON.parse(localStorage.getItem("patient") || "{}");

  useEffect(() => {
    const fetchRegiments = async () => {
      try {
        const storedData = JSON.parse(localStorage.getItem("treatmentIDs") || "[]");
        if (!Array.isArray(storedData)) {
          console.error("Invalid treatmentIDs in localStorage");
          setLoading(false);
          return;
        }

        const validItems = storedData.filter(item => item.prescribedRegimentID);

        const fetchAll = validItems.map(async (item) => {
          try {
            const regiment = await ARVService.getPrescribedRegimentById(item.prescribedRegimentID);
            if (!regiment || !regiment.customDrugs) {
              console.warn(`Invalid regiment data for ID ${item.prescribedRegimentID}`);
            }
            return {
              note: item.note,
              ...regiment,
            };
          } catch (error) {
            console.error(`Failed to fetch regiment ${item.prescribedRegimentID}:`, error);
            return null;
          }
        });

        const result = (await Promise.all(fetchAll)).filter(item => item !== null);
        setRegimentDetails(result);
      } catch (error) {
        console.error("Failed to fetch regiments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRegiments();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!regimentDetails.length) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-500 text-lg">
        Không có phác đồ điều trị nào được tìm thấy.
      </div>
    );
  }

  return (
    <div className="bg-gray-100 py-10 min-h-screen">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-blue-600 mb-2">Phác Đồ Điều Trị HIV</h1>
        <p className="text-gray-600 mb-6">
          Xin chào <strong>{patient.name}</strong>, dưới đây là danh sách các phác đồ được kê gần đây.
        </p>

        {regimentDetails.map((regiment, index) => {
          const { data, baseRegimentID, createdBy, note } = regiment;
          return (
            <div key={index} className="bg-white p-6 shadow rounded-xl mb-6">
              <div className="flex items-center mb-4 gap-2 text-blue-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2}
                     viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round"
                     d="M18.364 5.636a9 9 0 11-12.728 0M12 3v9"></path></svg>
                <h2 className="text-xl font-semibold">Phác đồ #{index + 1}</h2>
              </div>

              <p><strong>📝 Ghi chú:</strong> {note || "Không có ghi chú"}</p>
              <p><strong>📆 Ngày kê:</strong> {data.createdAt ? new Date(data.createdAt).toLocaleDateString() : "N/A"}</p>
              <p><strong>📋 Tên phác đồ:</strong> {baseRegimentID?.name || "Không xác định"}</p>
              <p><strong>💊 Loại:</strong> {baseRegimentID?.regimenType || "N/A"}</p>
              <p><strong>⚠️ Tác dụng phụ:</strong> {baseRegimentID?.sideEffects || "N/A"}</p>

              <hr className="my-4" />

              <h3 className="font-semibold text-lg mb-2">Thuốc được kê:</h3>
              {Array.isArray(data.customDrugs) && data.customDrugs.length > 0 ? (
                <ul className="space-y-2">
                  {data.customDrugs.map((drug, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-green-600 mt-1">✔️</span>
                      <div>
                        <p className="font-medium">{`${drug.drugId?.genericName || "Không xác định"} - ${drug.dosage || "N/A"}`}</p>
                        <p className="text-sm text-gray-600">Thời gian uống: {drug.frequency?.join(", ") || "N/A"}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">Không có thuốc được kê.</p>
              )}

              <hr className="my-4" />

              <p className="text-sm text-gray-500">
                Được kê bởi: {createdBy?.email || "N/A"}
              </p>
            </div>
          );
        })}

        <div className="mt-6 p-4 border-l-4 border-blue-500 bg-blue-50 text-blue-700 rounded">
          Vui lòng không tự ý thay đổi liều lượng hoặc bỏ thuốc nếu không có chỉ định của bác sĩ.
        </div>
      </div>
    </div>
  );
};

export default TreatmentPlanPage;
