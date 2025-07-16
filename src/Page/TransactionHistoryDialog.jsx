import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Box,
} from "@mui/material";
import paymentService from "../Services/CusService/PaymentService";

const TransactionHistoryDialog = ({ open, onClose }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (open) {
      const fetchTransactions = async () => {
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
      fetchTransactions();
    }
  }, [open]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
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
          onClick={onClose} 
          sx={{ color: "#0277bd" }}
        >
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TransactionHistoryDialog;