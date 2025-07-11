import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Card,
  CardContent,
  CardActions,
  Grid,
} from "@mui/material";
import educationalDocumentService from "../../../Services/StaffService/educationalDocumentService";
import { toast } from "react-toastify";

const EducationalDocumentManager = () => {
  const [docs, setDocs] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [docToDelete, setDocToDelete] = useState(null);

  const [form, setForm] = useState({
    title: "",
    content: "",
    fileURL: "",
    status: "",
  });

  const token = localStorage.getItem("token");

  const fetchDocuments = async () => {
    try {
      const result = await educationalDocumentService.getAllDocuments();
      setDocs(result);
    } catch (err) {
      console.error("Lỗi khi lấy danh sách tài liệu:", err);
      toast.error("Lỗi khi tải tài liệu", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleOpen = (doc = null) => {
    setEditing(doc);
    setForm(
      doc || {
        title: "",
        content: "",
        fileURL: "",
        status: "",
      }
    );
    setOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      if (editing) {
        const updated = await educationalDocumentService.updateDocument(editing._id, form, token);
        setDocs((prev) =>
          prev.map((d) => (d.id === editing._id ? updated : d))
        );
        toast.success("Cập nhật tài liệu thành công!", {
          position: "top-right",
          autoClose: 3000,
        });
      } else {
        const created = await educationalDocumentService.createDocument(form, token);
        setDocs((prev) => [...prev, created]);
        toast.success("Tạo tài liệu thành công!", {
          position: "top-right",
          autoClose: 3000,
        });
      }
      setOpen(false);
    } catch (err) {
      console.error("Lỗi khi lưu tài liệu:", err);
      toast.error("Lỗi khi lưu tài liệu", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handleDelete = (id) => {
    setDocToDelete(id);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await educationalDocumentService.deleteDocument(docToDelete, token);
      setDocs((prev) => prev.filter((d) => d.id !== docToDelete));
      toast.success("Xóa tài liệu thành công!", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (err) {
      console.error("Lỗi khi xóa tài liệu:", err);
      toast.error("Lỗi khi xóa tài liệu", {
        position: "top-right",
        autoClose: 3000,
      });
    }
    setConfirmOpen(false);
    setDocToDelete(null);
  };

  const handleCancelDelete = () => {
    setConfirmOpen(false);
    setDocToDelete(null);
  };

  return (
    <>
      <Button variant="contained" onClick={() => handleOpen()}>
        Thêm tài liệu
      </Button>
      <Grid container spacing={2} sx={{ mt: 2 }}>
        {docs.map((d) => (
          <Grid item xs={12} md={6} key={d._id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{d.title}</Typography>
                <Typography>{d.content}</Typography>
                <Typography>File: {d.fileURL}</Typography>
                <Typography variant="caption">
                  Trạng thái: {d.status}
                </Typography>
              </CardContent>
              <CardActions>
                <Button onClick={() => handleOpen(d)}>Sửa</Button>
                <Button color="error" onClick={() => handleDelete(d.id)}>
                  Xoá
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{editing ? "Sửa" : "Thêm"} tài liệu</DialogTitle>
        <DialogContent>
          <TextField
            label="Tiêu đề"
            fullWidth
            margin="dense"
            name="title"
            value={form.title}
            onChange={handleChange}
          />
          <TextField
            label="Nội dung"
            fullWidth
            multiline
            rows={3}
            margin="dense"
            name="content"
            value={form.content}
            onChange={handleChange}
          />
          <TextField
            label="URL file"
            fullWidth
            margin="dense"
            name="fileURL"
            value={form.fileURL}
            onChange={handleChange}
          />
          <TextField
            label="Trạng thái"
            fullWidth
            margin="dense"
            name="status"
            value={form.status}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Hủy</Button>
          <Button onClick={handleSave} variant="contained">
            Lưu
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={confirmOpen} onClose={handleCancelDelete}>
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
          <Typography>Bạn có chắc chắn muốn xóa tài liệu này?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete}>Không</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            Có
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default EducationalDocumentManager;