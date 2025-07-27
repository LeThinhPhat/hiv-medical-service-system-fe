import React, { useState } from "react";
import {
  Box,
  Paper,
  Fade,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Snackbar,
  Alert,
} from "@mui/material";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import authService from "../Services/authService";
import ProfileEditor from "./ProfileEditor";
import WalletManagement from "./WalletManagement";
import PatientService from "../Services/patientService";
import UserService from "../Services/userService";

const PatientInfo = ({ patient, user, walletBalance }) => {
  const [editMode, setEditMode] = useState(false);
  const [formValues, setFormValues] = useState({
    name: user.name || "",
    email: user.email || "",
    contactPhones: patient.contactPhones || "",
    gender: user.gender || "",
    address: user.address || "",
    personalID: patient.personalID || "",
    avatarURL: user.avatarURL || "",
  });
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
  const [openWalletOptionsDialog, setOpenWalletOptionsDialog] = useState(false);
  const [passwordValues, setPasswordValues] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState(null);
  const [toast, setToast] = useState({ open: false, message: "", severity: "success" });
  const [currentBalance, setCurrentBalance] = useState(walletBalance);

  const handleChange = (field) => (event) => {
    setFormValues({ ...formValues, [field]: event.target.value });
  };

  const handleSave = async () => {
    try {
      console.log("Saving user data:", user._id);
      await authService.updateUserById(user._id, formValues); // Gọi API cập nhật
      const patient = await PatientService.getPatientByToken();
      const userData = await UserService.getUserInfo(user._id);
      localStorage.setItem("patient", JSON.stringify(patient));
      localStorage.setItem("user", JSON.stringify(userData));

      setToast({
        open: true,
        message: "Cập nhật thông tin thành công!",
        severity: "success",
      });
      setEditMode(false); 
      //window.location.reload(); 
    } catch (err) {
      setToast({
        open: true,
        message: "Cập nhật thông tin thất bại. Vui lòng thử lại.",
        severity: "error",
      });
      console.error(err);
    }
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

        <ProfileEditor
          user={user}
          editMode={editMode}
          setEditMode={setEditMode}
          formValues={formValues}
          handleChange={handleChange}
          handleSave={handleSave}
          currentBalance={currentBalance}
          setOpenWalletOptionsDialog={setOpenWalletOptionsDialog}
          handleOpenPasswordDialog={handleOpenPasswordDialog}
        />

        <WalletManagement 
          walletBalance={currentBalance}
          setCurrentBalance={setCurrentBalance}
          setToast={setToast}
          openWalletOptionsDialog={openWalletOptionsDialog}
          setOpenWalletOptionsDialog={setOpenWalletOptionsDialog}
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