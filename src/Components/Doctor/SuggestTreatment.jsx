import React, { useEffect, useState } from "react";
import {
  Typography,
  CircularProgress,
  Alert,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import personalARVService from "../../Services/DoctorService/personalARVService";

const SuggestTreatment = ({ treatmentID, token }) => {
  const [regimens, setRegimens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [customRegimens, setCustomRegimens] = useState([]);

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
              dosage: d.dosage,
              frequency: d.frequency,
            })),
          }));
          setCustomRegimens(initial);
        } else {
          setRegimens([]);
        }
      } catch (err) {
        console.error("❌ Lỗi khi lấy gợi ý phác đồ:", err);
        setError("Không thể lấy gợi ý phác đồ. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    if (treatmentID && token) {
      fetchSuggestion();
    }
  }, [treatmentID, token]);

  const handleDosageChange = (regimenId, index, value) => {
    const updated = [...customRegimens];
    const regimen = updated.find((r) => r._id === regimenId);
    if (regimen) {
      regimen.customDrugs[index].dosage = value;
      setCustomRegimens(updated);
    }
  };

  const handleFrequencyChange = (regimenId, index, value) => {
    const updated = [...customRegimens];
    const regimen = updated.find((r) => r._id === regimenId);
    if (regimen) {
      regimen.customDrugs[index].frequency = value
        .split(",")
        .map((s) => s.trim());
      setCustomRegimens(updated);
    }
  };

  const handleSaveRegimen = async (regimenId) => {
    const custom = customRegimens.find((r) => r._id === regimenId);
    if (!custom) return;

    const payload = {
      treatmentID,
      baseRegimentID: regimenId,
      customDrugs: custom.customDrugs.map((d) => ({
        drugId: d.drugId,
        dosage: d.dosage,
        frequency: d.frequency,
      })),
      notes: "Phác đồ cá nhân hóa bởi bác sĩ",
    };

    try {
      await personalARVService.createPrescribedRegimen(token, payload);
      alert("✅ Đã lưu phác đồ thành công!");
    } catch (err) {
      alert("❌ Gặp lỗi khi lưu phác đồ.");
    }
  };

  if (loading) {
    return (
      <div className="mt-8 flex justify-center">
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-8">
        <Alert severity="error">{error}</Alert>
      </div>
    );
  }

  if (regimens.length === 0) {
    return (
      <div className="mt-8 text-gray-500 text-center">
        Không có phác đồ gợi ý phù hợp.
      </div>
    );
  }

  return (
    <div className="mt-10 space-y-6">
      <h2 className="text-xl font-semibold text-green-700">
        💊 Danh sách phác đồ gợi ý (chỉnh sửa trực tiếp)
      </h2>

      {regimens.map((regimen, idx) => {
        const editable = customRegimens.find((r) => r._id === regimen._id);
        return (
          <div
            key={regimen._id || idx}
            className="border border-green-300 rounded-xl shadow-sm p-6 bg-white"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* LEFT: Info */}
              <div>
                <h3 className="text-lg font-bold text-green-800">
                  {regimen.name} ({regimen.regimenType})
                </h3>
                <p className="text-sm mt-2">
                  📄 <strong>Mô tả:</strong> {regimen.description}
                </p>
                <p className="text-sm mt-1">
                  ⚠️ <strong>Tác dụng phụ:</strong> {regimen.sideEffects}
                </p>

                <Divider className="my-3" />
                <h4 className="font-semibold mb-1 text-sm">
                  🧪 Tiêu chí áp dụng:
                </h4>
                <List dense>
                  {regimen.criteria.map((c, i) => (
                    <ListItem key={i} disablePadding>
                      <ListItemText
                        primary={`• ${c.test_type} ${c.operator} ${c.value}`}
                        primaryTypographyProps={{ fontSize: "14px" }}
                      />
                    </ListItem>
                  ))}
                </List>
              </div>

              {/* RIGHT: Editable Drugs */}
              <div>
                <h4 className="font-semibold text-sm mb-2">
                  💊 Chỉnh sửa thuốc:
                </h4>
                {editable?.customDrugs.map((drug, i) => (
                  <div key={i} className="mb-4">
                    <p className="font-medium">
                      {drug.genericName} ({drug.manufacturer})
                    </p>
                    <TextField
                      label="Liều lượng"
                      value={drug.dosage}
                      onChange={(e) =>
                        handleDosageChange(regimen._id, i, e.target.value)
                      }
                      fullWidth
                      size="small"
                      margin="dense"
                      className="mb-2"
                    />
                    <TextField
                      label="Số lần dùng (phân tách bằng dấu phẩy)"
                      value={drug.frequency.join(", ")}
                      onChange={(e) =>
                        handleFrequencyChange(regimen._id, i, e.target.value)
                      }
                      fullWidth
                      size="small"
                      margin="dense"
                    />
                  </div>
                ))}

                <Button
                  variant="contained"
                  color="success"
                  onClick={() => handleSaveRegimen(regimen._id)}
                >
                  💾 Lưu phác đồ
                </Button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SuggestTreatment;
