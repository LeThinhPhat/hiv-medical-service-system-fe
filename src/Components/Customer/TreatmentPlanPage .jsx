import React, { useEffect, useState } from "react";
import ARVService from "../../Services/CusService/ARVService";

const TreatmentPlanPage = () => {
  const [regimentDetails, setRegimentDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedIndex, setExpandedIndex] = useState(null);

  const itemsPerPage = 5;
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
            return { note: item.note, ...regiment };
          } catch {
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

  const totalPages = Math.ceil(regimentDetails.length / itemsPerPage);
  const currentItems = regimentDetails.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

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

        {currentItems.map((regiment, index) => {
          const globalIndex = (currentPage - 1) * itemsPerPage + index;
          const { data } = regiment;
          const isExpanded = expandedIndex === globalIndex;

          return (
            <div key={globalIndex} className="bg-white p-4 shadow rounded-xl mb-4">
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => toggleExpand(globalIndex)}
              >
                <div>
                  <h2 className="font-semibold text-blue-600">
                    {data?.baseRegimentID?.name || "Phác đồ không xác định"}
                  </h2>
                  <p className="text-sm text-gray-500">
                    Được kê bởi: {data?.createdBy?.name || "N/A"}
                  </p>
                </div>
                <button
                    className="bg-blue-100 text-blue-600 px-3 py-1 rounded-md hover:bg-blue-200 transition"
                  >
                    {isExpanded ? "Ẩn chi tiết" : "Xem chi tiết"}
                  </button>
              </div>

              {isExpanded && (
                <div className="mt-4 text-gray-700 text-sm">
                  <p><strong>📝 Ghi chú:</strong> {regiment.note || "Không có ghi chú"}</p>
                  <p><strong>📆 Ngày kê:</strong> {data?.createdAt ? new Date(data.createdAt).toLocaleDateString() : "N/A"}</p>
                  <p><strong>💊 Loại:</strong> {data?.baseRegimentID?.regimenType || "N/A"}</p>
                  <p><strong>⚠️ Tác dụng phụ:</strong> {data?.baseRegimentID?.sideEffects || "N/A"}</p>

                  <h3 className="font-semibold mt-3">Thuốc được kê:</h3>
                  {Array.isArray(data?.customDrugs) && data.customDrugs.length > 0 ? (
                    <ul className="list-disc ml-5 mt-1">
                      {data.customDrugs.map((drug, i) => (
                        <li key={i}>
                          {`${drug.drugId?.genericName || "Không xác định"} - ${drug.dosage || "N/A"}`}
                          <div className="text-xs text-gray-500">
                            Thời gian uống: {drug.frequency?.join(", ") || "N/A"}
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500">Không có thuốc được kê.</p>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {/* Pagination Controls */}
        <div className="flex justify-center items-center mt-6 space-x-4">
          <button
            className={`px-3 py-1 rounded ${currentPage === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 text-white"}`}
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Trước
          </button>
          <span>Trang {currentPage} / {totalPages}</span>
          <button
            className={`px-3 py-1 rounded ${currentPage === totalPages ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 text-white"}`}
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Tiếp
          </button>
        </div>

        <div className="mt-6 p-4 border-l-4 border-blue-500 bg-blue-50 text-blue-700 rounded">
          Vui lòng không tự ý thay đổi liều lượng hoặc bỏ thuốc nếu không có chỉ định của bác sĩ.
        </div>
      </div>
    </div>
  );
};

export default TreatmentPlanPage;
