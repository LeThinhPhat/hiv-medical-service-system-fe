import React, { useState, useEffect, useMemo } from "react";
import { toast } from "react-hot-toast";
import { debounce } from "lodash";
import drugsManagerService from "../../Services/ManagerService/drugsManagerService";
import { RegimenType, TestType, Operator } from "./enum/constants";

const CreateRegimenDialog = ({ open, onClose, onCreate, initialData, isEditMode = false }) => {
  const [newRegimen, setNewRegimen] = useState(
    initialData || {
      name: "",
      regimenType: RegimenType.FirstLine,
      description: "",
      sideEffects: "",
      criteria: [
        { test_type: TestType.HIV_ViralLoad, operator: Operator.LessThan, value: "" },
      ],
      drugs: [{ drugId: "", dosage: "", frequency: ["1 lần/ngày"] }],
      isActive: true,
    }
  );
  const [drugsList, setDrugsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (open) {
      const fetchDrugs = async () => {
        setLoading(true);
        try {
          const drugs = await drugsManagerService.getAllDrugs(token);
          console.log("Drugs List:", drugs); // Debug: Inspect drugsList
          setDrugsList(drugs);

          // Chỉ cập nhật newRegimen khi có initialData và drugsList
          if (initialData && isEditMode && drugs.length > 0) {
            console.log("Initial Data:", initialData); // Debug: Inspect initialData
            setNewRegimen((prev) => ({
              ...prev,
              ...initialData,
              criteria: initialData.criteria.map((c) => ({
                ...c,
                value: String(c.value),
              })),
              drugs: initialData.drugs.map((d) => {
                // Tìm drugId khớp với drugsList
                const matchedDrug = drugs.find((drug) => drug._id === d.drugId || drug._id === d._id);
                return {
                  ...d,
                  drugId: matchedDrug ? matchedDrug._id : d.drugId || d._id || "",
                  frequency: Array.isArray(d.frequency)
                    ? d.frequency
                    : [d.frequency || "1 lần/ngày"],
                };
              }),
            }));
          }
        } catch (error) {
          toast.error("Không thể tải danh sách thuốc!");
          console.error("Error fetching drugs:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchDrugs();
    }
  }, [open, token, initialData, isEditMode]);

  const handleCreateChange = (e, field, index = null, subField = null) => {
    if (index !== null && subField) {
      setNewRegimen((prev) => {
        const updatedArray = [...prev[field]];
        if (subField === "frequency") {
          updatedArray[index] = {
            ...updatedArray[index],
            [subField]: [e.target.value],
          };
        } else {
          updatedArray[index] = {
            ...updatedArray[index],
            [subField]: subField === "value" ? String(e.target.value) : e.target.value,
          };
        }
        return { ...prev, [field]: updatedArray };
      });
    } else {
      setNewRegimen((prev) => ({ ...prev, [field]: e.target.value }));
    }
  };

  const handleAddCriterion = () => {
    setNewRegimen((prev) => ({
      ...prev,
      criteria: [
        ...prev.criteria,
        { test_type: TestType.HIV_ViralLoad, operator: Operator.LessThan, value: "" },
      ],
    }));
  };

  const handleAddDrug = () => {
    if (drugsList.length === 0) {
      toast.error("Không có thuốc nào để thêm!");
      return;
    }
    setNewRegimen((prev) => ({
      ...prev,
      drugs: [
        ...prev.drugs,
        { drugId: drugsList[0]._id, dosage: "", frequency: ["1 lần/ngày"] },
      ],
    }));
  };

  const handleSubmit = useMemo(
    () =>
      debounce(async () => {
        if (!newRegimen.name?.trim() || !newRegimen.description?.trim() || !newRegimen.sideEffects?.trim()) {
          toast.error("Vui lòng điền đầy đủ các trường bắt buộc!");
          return;
        }
        if (
          newRegimen.criteria.some((c) => !c.test_type || !c.operator || !String(c.value).trim())
        ) {
          toast.error("Vui lòng điền đầy đủ các tiêu chí!");
          return;
        }
        if (
          newRegimen.drugs.some(
            (d) =>
              !d.drugId ||
              !d.dosage?.trim() ||
              !d.frequency.length ||
              !/^[0-9a-fA-F]{24}$/.test(d.drugId)
          )
        ) {
          toast.error("Vui lòng chọn thuốc hợp lệ và điền đầy đủ thông tin thuốc!");
          return;
        }

        setLoading(true);
        try {
          console.log("Submitting newRegimen:", newRegimen); // Debug: Inspect newRegimen
          await onCreate(newRegimen);
          toast.success(isEditMode ? "Cập nhật phác đồ thành công!" : "Tạo phác đồ thành công!");
          onClose();
        } catch (error) {
          console.error(`Lỗi khi ${isEditMode ? "cập nhật" : "tạo"} phác đồ:`, error);
          toast.error(`Lỗi khi ${isEditMode ? "cập nhật" : "tạo"} phác đồ: ${error.message}`);
        } finally {
          setLoading(false);
        }
      }, 300),
    [newRegimen, onCreate, isEditMode]
  );

  useEffect(() => {
    return () => {
      handleSubmit.cancel();
    };
  }, [handleSubmit]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <h2 className="text-xl font-bold text-teal-600 mb-4">
          {isEditMode ? "Sửa Phác Đồ ARV" : "Thêm Phác Đồ ARV"}
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tên phác đồ
            </label>
            <input
              type="text"
              value={newRegimen.name}
              onChange={(e) => handleCreateChange(e, "name")}
              className="w-full bg-white border border-teal-100 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Loại phác đồ
            </label>
            <select
              value={newRegimen.regimenType}
              onChange={(e) => handleCreateChange(e, "regimenType")}
              className="w-full bg-white border border-teal-100 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-600"
            >
              {Object.values(RegimenType).map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Mô tả
            </label>
            <textarea
              value={newRegimen.description}
              onChange={(e) => handleCreateChange(e, "description")}
              className="w-full bg-white border border-teal-100 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tác dụng phụ
            </label>
            <textarea
              value={newRegimen.sideEffects}
              onChange={(e) => handleCreateChange(e, "sideEffects")}
              className="w-full bg-white border border-teal-100 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-600"
            />
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              Tiêu chí áp dụng
            </h4>
            {newRegimen.criteria.map((criterion, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <select
                  value={criterion.test_type}
                  onChange={(e) =>
                    handleCreateChange(e, "criteria", index, "test_type")
                  }
                  className="w-1/3 bg-white border border-teal-100 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-600"
                >
                  {Object.values(TestType).map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                <select
                  value={criterion.operator}
                  onChange={(e) =>
                    handleCreateChange(e, "criteria", index, "operator")
                  }
                  className="w-1/3 bg-white border border-teal-100 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-600"
                >
                  {Object.values(Operator).map((op) => (
                    <option key={op} value={op}>
                      {op}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  value={criterion.value}
                  onChange={(e) =>
                    handleCreateChange(e, "criteria", index, "value")
                  }
                  className="w-1/3 bg-white border border-teal-100 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-600"
                  placeholder="Giá trị"
                />
              </div>
            ))}
            <button
              onClick={handleAddCriterion}
              className="text-teal-600 hover:text-teal-700 text-sm"
            >
              + Thêm tiêu chí
            </button>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              Thuốc sử dụng
            </h4>
            {drugsList.length === 0 ? (
              <p className="text-red-500">Không có thuốc nào để chọn!</p>
            ) : (
              newRegimen.drugs.map((drug, index) => {
                console.log(`Drug ${index} ID:`, drug.drugId); // Debug: Inspect each drug
                return (
                  <div key={index} className="flex gap-2 mb-2">
                    <select
                      value={drug.drugId || ""}
                      onChange={(e) => handleCreateChange(e, "drugs", index, "drugId")}
                      className="w-1/3 bg-white border border-teal-100 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-600"
                      disabled={loading}
                    >
                      <option value="">Chọn thuốc</option>
                      {drugsList.map((drugItem) => (
                        <option key={drugItem._id} value={drugItem._id}>
                          {drugItem.genericName}
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      value={drug.dosage}
                      onChange={(e) => handleCreateChange(e, "drugs", index, "dosage")}
                      className="w-1/3 bg-white border border-teal-100 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-600"
                      placeholder="Liều lượng"
                    />
                    <select
                      value={drug.frequency[0] || "1 lần/ngày"}
                      onChange={(e) => handleCreateChange(e, "drugs", index, "frequency")}
                      className="w-1/3 bg-white border border-teal-100 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-600"
                    >
                      <option value="1 lần/ngày">1 lần/ngày</option>
                      <option value="2 lần/ngày">2 lần/ngày</option>
                      <option value="3 lần/ngày">3 lần/ngày</option>
                      <option value="4 lần/ngày">4 lần/ngày</option>
                      <option value="5 lần/ngày">5 lần/ngày</option>
                    </select>
                  </div>
                );
              })
            )}
            <button
              onClick={handleAddDrug}
              className="text-teal-600 hover:text-teal-700 text-sm"
              disabled={drugsList.length === 0 || loading}
            >
              + Thêm thuốc
            </button>
          </div>
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700">
              <input
                type="checkbox"
                checked={newRegimen.isActive}
                onChange={(e) =>
                  setNewRegimen((prev) => ({
                    ...prev,
                    isActive: e.target.checked,
                  }))
                }
                className="mr-2"
              />
              Kích hoạt
            </label>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onClose}
            className="bg-gray-200 text-gray-700 rounded-lg px-4 py-2 hover:bg-gray-300 transition-colors"
            disabled={loading}
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            className="bg-teal-600 text-white rounded-lg px-4 py-2 hover:bg-teal-700 transition-colors"
            disabled={loading}
          >
            {loading ? (isEditMode ? "Đang cập nhật..." : "Đang tạo...") : (isEditMode ? "Cập nhật" : "Tạo")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateRegimenDialog;