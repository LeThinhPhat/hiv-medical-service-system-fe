import React, { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  TextField,
} from "@mui/material";
import TransactionHistoryDialog from "./TransactionHistoryDialog";
import paymentService from "../Services/CusService/PaymentService";

const WalletManagement = ({  setCurrentBalance, setToast, openWalletOptionsDialog, setOpenWalletOptionsDialog }) => {
  const [openTransactionDialog, setOpenTransactionDialog] = useState(false);
  const [openAddFundsDialog, setOpenAddFundsDialog] = useState(false);
  const [addFundsAmount, setAddFundsAmount] = useState("");

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

  return (
    <>
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
    </>
  );
};

export default WalletManagement;