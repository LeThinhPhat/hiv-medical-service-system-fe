import React, { useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Paper,
  ListItemSecondaryAction,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";

const MedicalRecordsSection = ({ medicalRecords, loadingMedicalRecords }) => {
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const handleOpenDialog = (record) => {
    setSelectedRecord(record);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedRecord(null);
  };

  return (
    <Paper
      elevation={2}
      sx={{
        p: 4,
        borderRadius: 2,
        bgcolor: "white",
        border: "1px solid #e3f2fd",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <MedicalServicesIcon sx={{ color: "#0277bd", mr: 2, fontSize: 28 }} />
        <Typography variant="h5" sx={{ color: "#0277bd", fontWeight: 600 }}>
          Hồ sơ bệnh án
        </Typography>
      </Box>

      {loadingMedicalRecords ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress size={32} sx={{ color: "#0277bd" }} />
        </Box>
      ) : medicalRecords.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 4, color: "text.secondary" }}>
          <MedicalServicesIcon sx={{ fontSize: 48, color: "#bdbdbd", mb: 2 }} />
          <Typography variant="h6">Chưa có hồ sơ bệnh án</Typography>
          <Typography variant="body2">
            Hồ sơ bệnh án sẽ được tạo sau khi hoàn thành khám bệnh.
          </Typography>
        </Box>
      ) : (
        <List disablePadding>
          {medicalRecords.map((record, idx) => (
            <ListItem
              key={idx}
              sx={{
                py: 2,
                px: 3,
                mb: 2,
                bgcolor: "#fafafa",
                borderRadius: 1,
                border: "1px solid #e0e0e0",
                "&:hover": {
                  bgcolor: "#f5f5f5",
                },
              }}
            >
              <ListItemText
                primary={
                  <Typography
                    variant="subtitle1"
                    fontWeight="600"
                    color="#212121"
                    sx={{ mb: 1 }}
                  >
                    <strong>Chẩn đoán:</strong> {record.diagnosis || "Không rõ"}
                  </Typography>
                }
                secondary={
                  <Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 0.5 }}
                    >
                      <strong>Triệu chứng:</strong>{" "}
                      {record.symptoms || "Không có mô tả"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Ghi chú:</strong>{" "}
                      {record.clinicalNotes || "Không có"}
                    </Typography>
                  </Box>
                }
              />
              <ListItemSecondaryAction>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => handleOpenDialog(record)}
                  sx={{
                    borderColor: "#0277bd",
                    color: "#0277bd",
                    "&:hover": {
                      borderColor: "#01579b",
                      color: "#01579b",
                      bgcolor: "#f3f8ff",
                    },
                  }}
                >
                  Chi tiết
                </Button>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      )}

      {/* Dialog chi tiết hồ sơ */}
      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
        <DialogTitle>Chi tiết hồ sơ bệnh án</DialogTitle>
        <DialogContent dividers>
          {selectedRecord && (
            <>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Chẩn đoán:</strong> {selectedRecord.diagnosis || "Không rõ"}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Triệu chứng:</strong> {selectedRecord.symptoms || "Không có mô tả"}
              </Typography>
              <Typography variant="body1">
                <strong>Ghi chú:</strong> {selectedRecord.clinicalNotes || "Không có"}
              </Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} sx={{ color: "#0277bd" }}>
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default MedicalRecordsSection;
