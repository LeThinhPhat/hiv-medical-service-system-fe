import React, { useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import personalARVService from "../../Services/DoctorService/personalARVService";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import SaveIcon from "@mui/icons-material/Save";

const SuggestTreatment = ({ treatmentID, token }) => {
  const [regimens, setRegimens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [customRegimens, setCustomRegimens] = useState([]);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [selectedRegimenId, setSelectedRegimenId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [showCriteria, setShowCriteria] = useState({});
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    const fetchSuggestion = async () => {
      setLoading(true);
      setError("");

      try {
        const res = await personalARVService.suggestRegimen(token, treatmentID);
        if (Array.isArray(res.data)) {
          setRegimens(res.data);
          const initial = res.data.map((regimen) => ({
            _id: regimen._id,
            customDrugs: regimen.drugs.map((d) => ({
              drugId: d.drugId._id,
              genericName: d.drugId.genericName,
              manufacturer: d.drugId.manufacturer,
              dosage: parseFloat(d.dosage.replace("mg", "")) || 0,
              frequency: Array.isArray(d.frequency)
                ? Math.max(
                    1,
                    Math.min(
                      6,
                      parseInt(d.frequency[0].replace(" lần/ngày", "")) || 1
                    )
                  )
                : 1,
            })),
          }));
          setCustomRegimens(initial);
          setShowCriteria(
            res.data.reduce((acc, regimen) => {
              acc[regimen._id] = false;
              return acc;
            }, {})
          );
        } else {
          setRegimens([]);
        }
      } catch (err) {
        console.error("Lỗi khi lấy gợi ý phác đồ:", err);
        setError("Không thể lấy gợi ý phác đồ. Vui lòng thử lại sau.");
        toast.error(`Không thể lấy gợi ý phác đồ: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    if (treatmentID && token) {
      fetchSuggestion();
    }
  }, [treatmentID, token]);

  const handleDosageChange = (regimenId, index, value) => {
    const numericValue = value === "" ? "" : parseFloat(value);
    const updated = [...customRegimens];
    const regimen = updated.find((r) => r._id === regimenId);
    if (regimen) {
      regimen.customDrugs[index].dosage = numericValue;
      setCustomRegimens(updated);
    }
  };

  const handleFrequencyChange = (regimenId, index, value) => {
    const numericValue = value === "" ? "" : parseInt(value);
    if (
      value !== "" &&
      (isNaN(numericValue) || numericValue < 1 || numericValue > 6)
    )
      return;
    const updated = [...customRegimens];
    const regimen = updated.find((r) => r._id === regimenId);
    if (regimen) {
      regimen.customDrugs[index].frequency = numericValue;
      setCustomRegimens(updated);
    }
  };

  const handleToggleCriteria = (regimenId) => {
    setShowCriteria((prev) => ({
      ...prev,
      [regimenId]: !prev[regimenId],
    }));
  };

  const handleOpenConfirmDialog = (regimenId) => {
    setSelectedRegimenId(regimenId);
    setOpenConfirmDialog(true);
  };

  const handleCloseConfirmDialog = () => {
    setOpenConfirmDialog(false);
    setSelectedRegimenId(null);
  };

  const handleSaveRegimen = async () => {
    const custom = customRegimens.find((r) => r._id === selectedRegimenId);
    if (!custom) {
      toast.error("Phác đồ không hợp lệ.");
      return;
    }

    const hasInvalidInputs = custom.customDrugs.some(
      (drug) =>
        drug.dosage === "" ||
        drug.frequency === "" ||
        isNaN(drug.dosage) ||
        isNaN(drug.frequency) ||
        drug.dosage < 10 ||
        drug.dosage > 1000 ||
        drug.frequency < 1 ||
        drug.frequency > 6
    );
    if (hasInvalidInputs) {
      toast.error("Vui lòng nhập liều lượng không quá 1000 và thấp hơn 10mg.");
      return;
    }

    const payload = {
      treatmentID,
      baseRegimentID: selectedRegimenId,
      customDrugs: custom.customDrugs.map((d) => ({
        drugId: d.drugId,
        dosage: `${d.dosage}mg`,
        frequency: [`${d.frequency} lần/ngày`],
      })),
      notes: "Phác đồ cá nhân hóa bởi bác sĩ",
    };

    try {
      setSaving(true);
      await personalARVService.createPrescribedRegimen(token, payload);
      toast.success("Đã lưu phác đồ thành công!");
      setIsLocked(true);
      handleCloseConfirmDialog();
    } catch (err) {
      console.error("Lỗi khi lưu phác đồ:", err);
      toast.error(
        `Gặp lỗi khi lưu phác đồ: ${err.response?.data?.message || err.message}`
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="Container mx-auto mt-10 mb-10">
      <div>
        {loading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-teal-600"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-100 rounded-lg p-4 text-red-600 text-center">
            {error}
          </div>
        ) : regimens.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-lg text-gray-500">
              Không có phác đồ gợi ý phù hợp.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {regimens.map((regimen, idx) => {
              const editable = customRegimens.find(
                (r) => r._id === regimen._id
              );
              return (
                <div
                  key={regimen._id || idx}
                  className="bg-teal-50 border border-teal-100 rounded-xl shadow-sm p-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left: Thông tin */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-teal-600">
                          {regimen.name} ({regimen.regimenType})
                        </h3>
                        <button
                          onClick={() => handleToggleCriteria(regimen._id)}
                          className="text-teal-600 hover:text-teal-700 transition-colors"
                          title={
                            showCriteria[regimen._id]
                              ? "Ẩn tiêu chí"
                              : "Hiện tiêu chí"
                          }
                        >
                          {showCriteria[regimen._id] ? (
                            <VisibilityOffIcon fontSize="small" />
                          ) : (
                            <VisibilityIcon fontSize="small" />
                          )}
                        </button>
                      </div>
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Mô tả:</span>{" "}
                        {regimen.description || "N/A"}
                      </p>
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Tác dụng phụ:</span>{" "}
                        {regimen.sideEffects || "N/A"}
                      </p>
                      {showCriteria[regimen._id] && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-2">
                            Tiêu chí áp dụng:
                          </h4>
                          <ul className="pl-4 space-y-1 text-sm text-gray-700">
                            {regimen.criteria.map((c, i) => (
                              <li key={i} className="list-disc">
                                {c.test_type} {c.operator} {c.value}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* Right: Danh sách thuốc chỉnh sửa */}
                    <div className="space-y-4">
                      <h4 className="text-sm font-medium text-gray-700">
                        Chỉnh sửa liều lượng & tần suất:
                      </h4>
                      {editable?.customDrugs.map((drug, i) => (
                        <div
                          key={i}
                          className="p-4 bg-white border border-teal-100 rounded-lg"
                        >
                          <p className="font-medium text-gray-800 mb-2">
                            {drug.genericName} ({drug.manufacturer})
                          </p>
                          <div className="space-y-2">
                            <div className="relative">
                              <label className="block text-sm font-medium text-gray-700">
                                Liều lượng (mg)
                              </label>
                              <input
                                type="number"
                                value={drug.dosage}
                                onChange={(e) =>
                                  handleDosageChange(
                                    regimen._id,
                                    i,
                                    e.target.value
                                  )
                                }
                                className="w-full bg-white border border-teal-100 rounded-lg px-3 py-2 pr-12 text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600"
                                disabled={isLocked}
                                min="10"
                                max="1000"
                                step="1"
                              />
                              <span className="absolute right-3 top-9 text-gray-500 text-sm">
                                mg
                              </span>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700">
                                Tần suất (lần/ngày)
                              </label>
                              <select
                                value={drug.frequency}
                                onChange={(e) =>
                                  handleFrequencyChange(
                                    regimen._id,
                                    i,
                                    e.target.value
                                  )
                                }
                                className="w-full bg-white border border-teal-100 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600"
                                disabled={isLocked}
                              >
                                {[1, 2, 3, 4, 5, 6].map((num) => (
                                  <option key={num} value={num}>
                                    {num} lần/ngày
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </div>
                      ))}
                      <button
                        onClick={() => handleOpenConfirmDialog(regimen._id)}
                        className={`flex items-center gap-2 bg-teal-600 text-white rounded-lg px-4 py-2 hover:bg-teal-700 transition-colors ${
                          isLocked ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                        disabled={isLocked}
                      >
                        <SaveIcon fontSize="small" />
                        Lưu phác đồ
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
            {isLocked && (
              <div className="mt-6 flex justify-end">
                <a
                  href="http://localhost:5173/doctor/doctorsappoinment"
                  className="flex items-center gap-2 bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700 transition-colors"
                >
                  Checkout
                </a>
              </div>
            )}
          </div>
        )}

        {/* Save Confirmation Dialog */}
        {openConfirmDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            <div className="bg-teal-50 rounded-xl p-6 w-full max-w-sm">
              <h2 className="text-xl font-bold text-teal-600 mb-4">
                Xác Nhận Lưu
              </h2>
              <p className="text-gray-700 mb-6">
                Bạn có chắc chắn muốn lưu phác đồ này?
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={handleCloseConfirmDialog}
                  className="bg-gray-200 text-gray-700 rounded-lg px-4 py-2 hover:bg-gray-300 transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={handleSaveRegimen}
                  disabled={saving}
                  className={`flex items-center gap-2 bg-teal-600 text-white rounded-lg px-4 py-2 hover:bg-teal-700 transition-colors ${
                    saving ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <SaveIcon fontSize="small" />
                  {saving ? "Đang lưu..." : "Lưu"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Toaster />
    </div>
  );
};

export default SuggestTreatment;
