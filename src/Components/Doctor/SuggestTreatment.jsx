import React, { useEffect, useState } from "react";
import {
  Typography,
  Box,
  CircularProgress,
  Alert,
  Card,
  CardContent,
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

  useEffect(() => {
    const fetchSuggestion = async () => {
      setLoading(true);
      setError("");

      try {
        const res = await personalARVService.suggestRegimen(token, treatmentID);
        if (Array.isArray(res.data)) {
          setRegimens(res.data);
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

  if (loading) {
    return (
      <Box mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box mt={4}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (regimens.length === 0) {
    return (
      <Box mt={4}>
        <Typography color="textSecondary">
          Không có phác đồ gợi ý phù hợp.
        </Typography>
      </Box>
    );
  }

  return (
    <Box mt={6}>
      <Typography variant="h6" className="text-green-700 mb-4">
        💊 Danh sách phác đồ được gợi ý:
      </Typography>

      {regimens.map((regimen, idx) => (
        <Card key={regimen._id || idx} className="mb-4 border border-green-300">
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {regimen.name} ({regimen.regimenType})
            </Typography>

            <Typography variant="body2" gutterBottom>
              📄 <strong>Mô tả:</strong> {regimen.description}
            </Typography>
            <Typography variant="body2" gutterBottom>
              ⚠️ <strong>Tác dụng phụ:</strong> {regimen.sideEffects}
            </Typography>

            <Divider className="my-2" />
            <Typography variant="subtitle2">🧪 Tiêu chí áp dụng:</Typography>
            <List dense>
              {regimen.criteria.map((c, i) => (
                <ListItem key={i}>
                  <ListItemText
                    primary={`• ${c.test_type} ${c.operator} ${c.value}`}
                  />
                </ListItem>
              ))}
            </List>

            <Typography variant="subtitle2">💊 Danh sách thuốc:</Typography>
            <List dense>
              {regimen.drugs.map((d, i) => (
                <ListItem key={i}>
                  <ListItemText
                    primary={`• ${d.drugId?.genericName} (${d.dosage})`}
                    secondary={`Nhà sản xuất: ${
                      d.drugId?.manufacturer
                    } | Uống: ${d.frequency.join(", ")}`}
                  />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default SuggestTreatment;
