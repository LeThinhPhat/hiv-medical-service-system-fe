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
  Snackbar,
  Alert,
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
import LockIcon from "@mui/icons-material/Lock";
import authService from "../Services/authService";
import TransactionHistoryDialog from "./TransactionHistoryDialog";
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
  const [openWalletOptionsDialog, setOpenWalletOptionsDialog] = useState(false);
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
  const [openAddFundsDialog, setOpenAddFundsDialog] = useState(false);
  const [addFundsAmount, setAddFundsAmount] = useState("");
  const [passwordValues, setPasswordValues] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState(null);
  const [toast, setToast] = useState({ open: false, message: "", severity: "success" });
  const [currentBalance, setCurrentBalance] = useState(walletBalance);

  const handleOpenWalletOptionsDialog = () => {
    setOpenWalletOptionsDialog(true);
  };

  const handleCloseWalletOptionsDialog = () => {
    setOpenWalletOptionsDialog(false);
  };

  const handleOpenTransactionDialog = () => {
    setOpenWalletOptionsDialog(false);
    setOpenTransactionDialog(true);
  };

  const handleCloseTransactionDialog = () => {
    setOpenTransactionDialog(false);
  };

  const handleOpenAddFundsDialog = () => {
    setOpenWalletOptionsDialog(false);
    setOpenAddFundsDialog(true);
    setAddFundsAmount("");
  };

  const handleCloseAddFundsDialog = () => {
    setOpenAddFundsDialog(false);
  };

  const handleAddFunds = async () => {
    const amount = parseFloat(addFundsAmount);
    if (isNaN(amount) || amount <= 0) {
      setToast({
        open: true,
        message: "Vui lòng nhập số tiền hợp lệ.",
        severity: "error",
      });
      return;
    }
    try {
      const data = await paymentService.fundWallet({ amount });
      const redirectUrl = data; 
      if (redirectUrl) {
        window.location.href = redirectUrl;
      } else {
        setCurrentBalance((prev) => prev + amount); 
        setToast({
          open: true,
          message: `Nạp ${amount.toLocaleString("vi-VN")} VNĐ thành công!`,
          severity: "success",
        });
      }
    } catch (error) {
      setToast({
        open: true,
        message: error.message || "Nạp tiền thất bại. Vui lòng thử lại.",
        severity: "error",
      });
    }
    handleCloseAddFundsDialog();
  };

  const handleOpenPasswordDialog = () => {
    setOpenPasswordDialog(true);
    setPasswordError(null);
    setPasswordValues({ oldPassword: "", newPassword: "", confirmPassword: "" });
  };

  const handleClosePasswordDialog = () => {
    setOpenPasswordDialog(false);
  };

  const handlePasswordChange = (field) => (event) => {
    setPasswordValues({ ...passwordValues, [field]: event.target.value });
  };

  const handleCloseToast = () => {
    setToast({ ...toast, open: false });
  };

  const handlePasswordSave = async () => {
    if (passwordValues.newPassword !== passwordValues.confirmPassword) {
      setPasswordError("Mật khẩu mới và xác nhận mật khẩu không khớp.");
      setToast({
        open: true,
        message: "Mật khẩu mới và xác nhận mật khẩu không khớp.",
        severity: "error",
      });
      return;
    }
    try {
      await authService.changePassword(passwordValues.oldPassword, passwordValues.newPassword);
      setPasswordError(null);
      setToast({
        open: true,
        message: "Đổi mật khẩu thành công!",
        severity: "success",
      });
      handleClosePasswordDialog();
    } catch (err) {
      setPasswordError("Đổi mật khẩu thất bại. Vui lòng kiểm tra lại mật khẩu cũ.");
      setToast({
        open: true,
        message: "Đổi mật khẩu thất bại. Vui lòng kiểm tra lại mật khẩu cũ.",
        severity: "error",
      });
      console.error(err);
    }
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
            <Box sx={{ display: "flex", gap: 1 }}>
              {editMode ? (
                <>
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
                </>
              ) : (
                <>
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
                  <Button 
                    variant="outlined" 
                    startIcon={<LockIcon />} 
                    onClick={handleOpenPasswordDialog}
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
                    Đổi mật khẩu
                  </Button>
                </>
              )}
            </Box>
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
              value: currentBalance.toLocaleString("vi-VN") + " VNĐ", 
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
              onClick={item.key === "walletBalance" ? handleOpenWalletOptionsDialog : undefined}
            />
          ))}
        </Grid>

        <Dialog
          open={openWalletOptionsDialog}
          onClose={handleCloseWalletOptionsDialog}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle sx={{ bgcolor: "#0277bd", color: "white" }}>
            Quản lý ví
          </DialogTitle>
          <DialogContent sx={{ mt: 2 }}>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Vui lòng chọn một tùy chọn:
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Button 
                variant="contained"
                onClick={handleOpenTransactionDialog}
                sx={{ bgcolor: "#0277bd", "&:hover": { bgcolor: "#01579b" } }}
              >
                Xem lịch sử ví
              </Button>
              <Button 
                variant="contained"
                onClick={handleOpenAddFundsDialog}
                sx={{ bgcolor: "#0277bd", "&:hover": { bgcolor: "#01579b" } }}
              >
                Nạp tiền vào ví
              </Button>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={handleCloseWalletOptionsDialog} 
              sx={{ color: "#0277bd" }}
            >
              Hủy
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={openAddFundsDialog}
          onClose={handleCloseAddFundsDialog}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle sx={{ bgcolor: "#0277bd", color: "white" }}>
            Nạp tiền vào ví
          </DialogTitle>
          <DialogContent sx={{ mt: 2 }}>
            <TextField
              label="Số tiền (VNĐ)"
              type="number"
              fullWidth
              value={addFundsAmount}
              onChange={(e) => setAddFundsAmount(e.target.value)}
              sx={{ mb: 2, "& .MuiOutlinedInput-root": { "&.Mui-focused fieldset": { borderColor: "#0277bd" } } }}
            />
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={handleCloseAddFundsDialog} 
              sx={{ color: "#0277bd" }}
            >
              Hủy
            </Button>
            <Button 
              variant="contained"
              onClick={handleAddFunds}
              sx={{ bgcolor: "#0277bd", "&:hover": { bgcolor: "#01579b" } }}
            >
              Nạp tiền
            </Button>
          </DialogActions>
        </Dialog>

        <TransactionHistoryDialog
          open={openTransactionDialog}
          onClose={handleCloseTransactionDialog}
        />

        <Dialog
          open={openPasswordDialog}
          onClose={handleClosePasswordDialog}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle sx={{ bgcolor: "#0277bd", color: "white" }}>
            Đổi mật khẩu
          </DialogTitle>
          <DialogContent sx={{ mt: 2 }}>
            {passwordError && (
              <Typography color="error" sx={{ mb: 2 }}>
                {passwordError}
              </Typography>
            )}
            <TextField
              label="Mật khẩu cũ"
              type="password"
              fullWidth
              value={passwordValues.oldPassword}
              onChange={handlePasswordChange("oldPassword")}
              sx={{ mb: 2, "& .MuiOutlinedInput-root": { "&.Mui-focused fieldset": { borderColor: "#0277bd" } } }}
            />
            <TextField
              label="Mật khẩu mới"
              type="password"
              fullWidth
              value={passwordValues.newPassword}
              onChange={handlePasswordChange("newPassword")}
              sx={{ mb: 2, "& .MuiOutlinedInput-root": { "&.Mui-focused fieldset": { borderColor: "#0277bd" } } }}
            />
            <TextField
              label="Xác nhận mật khẩu mới"
              type="password"
              fullWidth
              value={passwordValues.confirmPassword}
              onChange={handlePasswordChange("confirmPassword")}
              sx={{ "& .MuiOutlinedInput-root": { "&.Mui-focused fieldset": { borderColor: "#0277bd" } } }}
            />
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={handleClosePasswordDialog} 
              sx={{ color: "#0277bd" }}
            >
              Hủy
            </Button>
            <Button 
              variant="contained"
              onClick={handlePasswordSave}
              sx={{ bgcolor: "#0277bd", "&:hover": { bgcolor: "#01579b" } }}
            >
              Lưu
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={toast.open}
          autoHideDuration={6000}
          onClose={handleCloseToast}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={handleCloseToast}
            severity={toast.severity}
            sx={{ width: "100%" }}
          >
            {toast.message}
          </Alert>
        </Snackbar>
      </Paper>
    </Fade>
  );
};

export default PatientInfo;