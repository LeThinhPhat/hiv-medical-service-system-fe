import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Paper,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from "@mui/material";
import { Edit, Delete, Visibility } from "@mui/icons-material";
import ARVmanagementService from "../../Services/ManagerService/ARVmanagement";

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
  };

  return (
    <Box sx={{ px: 4, py: 6 }}>
      <Typography variant="h4" fontWeight={600} gutterBottom>
        Quản Lý Phác Đồ ARV
      </Typography>

      <Paper sx={{ p: 2, mb: 3 }}>
        <TextField
          fullWidth
          label="Tìm kiếm phác đồ"
          value={searchTerm}
          onChange={handleSearch}
        />
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Tên phác đồ</TableCell>
              <TableCell>Loại</TableCell>
              <TableCell>Mô tả</TableCell>
              <TableCell>Tác dụng phụ</TableCell>
              <TableCell>Người tạo</TableCell>
              <TableCell align="right">Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRegimens.map((regimen) => (
              <TableRow key={regimen._id}>
                <TableCell>{regimen.name}</TableCell>
                <TableCell>
                  <Chip label={regimen.regimenType} color="info" />
                </TableCell>
                <TableCell>{regimen.description}</TableCell>
                <TableCell>{regimen.sideEffects}</TableCell>
                <TableCell>{regimen.createdBy?.email}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleViewDetails(regimen)} color="info">
                    <Visibility />
                  </IconButton>
                  <IconButton color="primary" onClick={() => alert("Sửa - chưa làm")}>
                    <Edit />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDelete(regimen._id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {filteredRegimens.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  Không có phác đồ nào phù hợp
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Xem chi tiết */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>Chi tiết phác đồ</DialogTitle>
        <DialogContent dividers>
          {selectedRegimen && (
            <>
              <Typography variant="h6">{selectedRegimen.name}</Typography>
              <Typography variant="body2" gutterBottom>
                Loại: <strong>{selectedRegimen.regimenType}</strong>
              </Typography>
              <Typography variant="body2" gutterBottom>
                Mô tả: {selectedRegimen.description}
              </Typography>
              <Typography variant="body2" gutterBottom>
                Tác dụng phụ: {selectedRegimen.sideEffects}
              </Typography>
              <Typography variant="subtitle1" mt={2} fontWeight={600}>
                Tiêu chí áp dụng:
              </Typography>
              <ul>
                {selectedRegimen.criteria.map((c) => (
                  <li key={c._id}>
                    {c.test_type} {c.operator} {c.value}
                  </li>
                ))}
              </ul>
              <Typography variant="subtitle1" mt={2} fontWeight={600}>
                Thuốc sử dụng:
              </Typography>
              <ul>
                {selectedRegimen.drugs.map((d) => (
                  <li key={d._id}>
                    {d.drugId.genericName} - {d.dosage} ({d.frequency.join(", ")})
                  </li>
                ))}
              </ul>
              <Typography variant="body2" color="text.secondary">
                Người tạo: {selectedRegimen.createdBy?.email}
              </Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Đóng</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ARVManagement;
