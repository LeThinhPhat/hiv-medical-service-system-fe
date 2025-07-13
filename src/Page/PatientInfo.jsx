import React, { useState } from "react";
import {
  Box,
  CardHeader,
  Avatar,
  Typography,
  Grid,
  Divider,
  Button,
  TextField,
  Paper,
  Fade,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import BadgeIcon from "@mui/icons-material/Badge";
import WcIcon from "@mui/icons-material/Wc";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import paymentService from "../Services/CusService/PaymentService";

export const PatientInfoField = ({ label, value, icon, editMode, fieldKey, handleChange, editable = true, onClick }) => (
  <Grid item xs={12} sm={6} md={3}>
    <Box 
      sx={{ 
        p: 2,
        bgcolor: "#fafafa",
        borderRadius: 1,
        border: "1px solid #e0e0e0",
        height: "100%",
        cursor: fieldKey === "walletBalance" && !editMode ? "pointer" : "default",
      }}
      onClick={fieldKey === "walletBalance" && !editMode ? onClick : undefined}
    >
      <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
        {icon}
        <Typography 
          variant="subtitle2" 
          color="text.secondary" 
          fontWeight="600"
          sx={{ ml: 1 }}
        >
          {label}
        </Typography>
      </Box>
      {editMode && editable ? (
        fieldKey === "gender" ? (
          <TextField 
            select 
            fullWidth 
            size="small" 
            value={value} 
            onChange={handleChange(fieldKey)} 
            SelectProps={{ native: true }}
            sx={{ 
              "& .MuiOutlinedInput-root": {
                "&.Mui-focused fieldset": {
                  borderColor: "#0277bd",
                }
              }
            }}
          >
            <option value="">Chọn giới tính</option>
            <option value="Nam">Nam</option>
            <option value="Nữ">Nữ</option>
          </TextField>
        ) : (
          <TextField 
            variant="outlined" 
            fullWidth 
            size="small" 
            value={value} 
            onChange={handleChange(fieldKey)} 
            sx={{ 
              "& .MuiOutlinedInput-root": {
                "&.Mui-focused fieldset": {
                  borderColor: "#0277bd",
                }
              }
            }}
          />
        )
      ) : (
        <Typography 
          variant="body1" 
          sx={{ 
            color: value ? "#212121" : "#9e9e9e",
            fontWeight: value ? "500" : "400"
          }}
        >
          {value || "Chưa cập nhật"}
        </Typography>
      )}
    </Box>
  </Grid>
);

const PatientInfo = ({ user, walletBalance, editMode, setEditMode, formValues, handleChange, handleSave }) => {
  const [openTransactionDialog, setOpenTransactionDialog] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const handleOpenTransactionDialog = async () => {
    setOpenTransactionDialog(true);
    setLoading(true);
    setError(null);
    try {
      const transactionData = await paymentService.getPatientTransactions();
      setTransactions(transactionData);
    } catch (err) {
      setError("Không thể tải lịch sử giao dịch. Vui lòng thử lại.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseTransactionDialog = () => {
    setOpenTransactionDialog(false);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  return (
    <Fade in={true} timeout={800}>
      <Paper 
        elevation={2} 
        sx={{ 
          p: 4, 
          borderRadius: 2, 
          bgcolor: "white",
          border: "1px solid #e3f2fd",
          mb: 3
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <MedicalServicesIcon sx={{ color: "#0277bd", mr: 2, fontSize: 28 }} />
          <Typography variant="h5" sx={{ color: "#0277bd", fontWeight: 600 }}>
            Thông tin bệnh nhân
          </Typography>
        </Box>

        <CardHeader
          avatar={
            <Avatar 
              src={user.avatarURL} 
              sx={{ 
                width: 80, 
                height: 80, 
                border: "3px solid #0277bd",
                bgcolor: "#e3f2fd"
              }} 
            >
              <PersonIcon sx={{ fontSize: 40, color: "#0277bd" }} />
            </Avatar>
          }
          title={
            editMode ? (
              <TextField 
                variant="outlined" 
                fullWidth 
                value={formValues.name} 
                onChange={handleChange("name")} 
                label="Họ và tên"
                sx={{ 
                  maxWidth: 400,
                  "& .MuiOutlinedInput-root": {
                    "&.Mui-focused fieldset": {
                      borderColor: "#0277bd",
                    }
                  }
                }}
              />
            ) : (
              <Typography variant="h5" sx={{ color: "#0277bd", fontWeight: 600 }}>
                {user.name || "Chưa có tên"}
              </Typography>
            )
          }
          subheader={
            editMode ? (
              <TextField 
                variant="outlined" 
                fullWidth 
                value={formValues.email} 
                onChange={handleChange("email")} 
                label="Email"
                sx={{ 
                  maxWidth: 400,
                  mt: 2,
                  "& .MuiOutlinedInput-root": {
                    "&.Mui-focused fieldset": {
                      borderColor: "#0277bd",
                    }
                  }
                }}
              />
            ) : (
              <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                {user.email}
              </Typography>
            )
          }
          action={
            editMode ? (
              <Box sx={{ display: "flex", gap: 1 }}>
                <Button 
                  variant="contained" 
                  startIcon={<SaveIcon />}
                  onClick={handleSave} 
                  sx={{ 
                    bgcolor: "#0277bd",
                    "&:hover": { bgcolor: "#01579b" }
                  }}
                >
                  Lưu
                </Button>
                <Button 
                  variant="outlined" 
                  startIcon={<CancelIcon />}
                  onClick={() => setEditMode(false)}
                  sx={{ 
                    borderColor: "#616161",
                    color: "#616161",
                    "&:hover": { 
                      borderColor: "#424242",
                      color: "#424242"
                    }
                  }}
                >
                  Hủy
                </Button>
              </Box>
            ) : (
              <Button 
                variant="outlined" 
                startIcon={<EditIcon />} 
                onClick={() => setEditMode(true)} 
                sx={{ 
                  borderColor: "#0277bd",
                  color: "#0277bd",
                  "&:hover": { 
                    borderColor: "#01579b",
                    color: "#01579b",
                    bgcolor: "#f3f8ff"
                  }
                }}
              >
                Chỉnh sửa
              </Button>
            )
          }
        />
        
        <Divider sx={{ my: 3, borderColor: "#e0e0e0" }} />
        
        <Grid container spacing={3}>
          {[
            { 
              label: "Số điện thoại", 
              value: formValues.contactPhones, 
              key: "contactPhones", 
              icon: <PhoneIcon sx={{ color: "#0277bd" }} /> 
            },
            { 
              label: "Giới tính", 
              value: formValues.gender, 
              key: "gender", 
              icon: <WcIcon sx={{ color: "#0277bd" }} /> 
            },
            { 
              label: "Địa chỉ", 
              value: formValues.address, 
              key: "address", 
              icon: <LocationOnIcon sx={{ color: "#0277bd" }} /> 
            },
            { 
              label: "Số CCCD", 
              value: formValues.personalID, 
              key: "personalID", 
              icon: <BadgeIcon sx={{ color: "#0277bd" }} /> 
            },
            { 
              label: "Số dư ví", 
              value: walletBalance.toLocaleString("vi-VN") + " VNĐ", 
              key: "walletBalance", 
              icon: <AccountBalanceWalletIcon sx={{ color: "#0277bd" }} />,
              editable: false
            },
          ].map((item, idx) => (
            <PatientInfoField
              key={idx}
              label={item.label}
              value={item.value}
              icon={item.icon}
              editMode={editMode}
              fieldKey={item.key}
              handleChange={handleChange}
              editable={item.editable}
              onClick={item.key === "walletBalance" ? handleOpenTransactionDialog : undefined}
            />
          ))}
        </Grid>

        <Dialog
          open={openTransactionDialog}
          onClose={handleCloseTransactionDialog}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle sx={{ bgcolor: "#0277bd", color: "white" }}>
            Lịch sử giao dịch
          </DialogTitle>
          <DialogContent>
            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
                <CircularProgress sx={{ color: "#0277bd" }} />
              </Box>
            ) : error ? (
              <Typography color="error" sx={{ p: 3 }}>
                {error}
              </Typography>
            ) : transactions.length === 0 ? (
              <Typography sx={{ p: 3 }}>
                Không có giao dịch nào.
              </Typography>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Ngày</TableCell>
                      <TableCell>Loại giao dịch</TableCell>
                      <TableCell>Số tiền</TableCell>
                      <TableCell>Lý do</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {transactions.map((transaction) => (
                      <TableRow key={transaction._id}>
                        <TableCell>{formatDate(transaction.createdAt)}</TableCell>
                        <TableCell>{transaction.type}</TableCell>
                        <TableCell 
                        sx={{ 
                            color: transaction.type === "Giao dịch thanh toán" ? "red" : 
                                transaction.type === "Giao dịch hoàn trả" ? "green" : "inherit"
                        }}
                        >
                        {transaction.amount.toLocaleString("vi-VN")} VNĐ
                        </TableCell>
                        <TableCell>{transaction.reason}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={handleCloseTransactionDialog} 
              sx={{ color: "#0277bd" }}
            >
              Đóng
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Fade>
  );
};

export default PatientInfo;