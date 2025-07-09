import React, { useEffect, useState } from "react";
import {
  Typography,
  CircularProgress,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemText,
  Box,
  Paper,
} from "@mui/material";
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

  if (!regimen) {
    return null;
  }

  const { baseRegimentID, customDrugs, prescribedDate } = regimen;

  return (
    <Box className="mt-8 space-y-6">
      <Paper className="p-6 shadow-md rounded-lg border border-green-200">
        <Typography variant="h6" className="text-green-700 font-semibold">
          📋 Thông tin phác đồ cá nhân hóa
        </Typography>

        <Typography variant="body2" className="mt-2 text-gray-600">
          Ngày kê đơn: {new Date(prescribedDate).toLocaleString()}
        </Typography>

        <Divider className="my-4" />

        <Typography variant="subtitle1" className="text-green-800 font-bold">
          🧠 Phác đồ gốc: {baseRegimentID.name} ({baseRegimentID.regimenType})
        </Typography>

        <Typography variant="body2" className="mt-1">
          ⚠️ <strong>Tác dụng phụ:</strong> {baseRegimentID.sideEffects}
        </Typography>

        <Divider className="my-4" />

        <Typography variant="subtitle1" className="font-semibold mb-2">
          💊 Thuốc đã được điều chỉnh:
        </Typography>

        <List dense>
          {customDrugs.map((drug, index) => (
            <ListItem key={index} className="mb-2">
              <ListItemText
                primary={`• ${drug.drugId.genericName} (${drug.dosage})`}
                secondary={`Nhóm: ${drug.drugId.group.join(
                  ", "
                )} | Uống: ${drug.frequency.join(", ")}`}
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default DetailPersonalARV;
