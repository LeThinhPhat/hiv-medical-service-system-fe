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
import facilityInfoService from "../../../Services/StaffService/facilityInfoService";
import { toast } from "react-hot-toast";

const FacilityInfoManager = () => {
  const [facilities, setFacilities] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [facilityToDelete, setFacilityToDelete] = useState(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
    contactInfo: "",
  });

  const token = localStorage.getItem("token");

  // Load facilities on mount
  useEffect(() => {
    loadFacilities();
  }, []);

  const loadFacilities = async () => {
    if (!token) {
      toast.error("Vui lòng đăng nhập để tiếp tục", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    setLoading(true);
    try {
      const data = await facilityInfoService.getAll(token);
      setFacilities(data);
    } catch (error) {
      console.error("Lỗi khi tải cơ sở:", error);
      toast.error(error.response?.data?.message || "Lỗi khi tải cơ sở", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = (facility = null) => {
    setEditing(facility);
    setForm(
      facility || {
        name: "",
        description: "",
        contactInfo: "",
      }
    );
    setOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!form.name || !form.description || !form.contactInfo) {
      toast.error("Vui lòng điền đầy đủ thông tin", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    try {
      if (editing) {
        const updated = await facilityInfoService.update(editing._id, form, token);
        setFacilities((prev) =>
          prev.map((f) => (f._id === editing._id ? updated : f))
        );
        toast.success("Cập nhật cơ sở thành công!", {
          position: "top-right",
          autoClose: 3000,
        });
      } else {
        const created = await facilityInfoService.create(form, token);
        setFacilities((prev) => [...prev, created]);
        toast.success("Tạo cơ sở thành công!", {
          position: "top-right",
          autoClose: 3000,
        });
      }
      setOpen(false);
    } catch (error) {
      console.error("Lỗi khi lưu:", error);
      toast.error(error.response?.data?.message || "Lỗi khi lưu cơ sở", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handleDelete = (id) => {
    setFacilityToDelete(id);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await facilityInfoService.delete(facilityToDelete, token);
      setFacilities((prev) => prev.filter((f) => f._id !== facilityToDelete));
      toast.success("Xóa cơ sở thành công!", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error) {
      console.error("Lỗi khi xóa:", error);
      toast.error(error.response?.data?.message || "Lỗi khi xóa cơ sở", {
        position: "top-right",
        autoClose: 3000,
      });
    }
    setConfirmOpen(false);
    setFacilityToDelete(null);
  };

  const handleCancelDelete = () => {
    setConfirmOpen(false);
    setFacilityToDelete(null);
  };

  return (
    <>
      <Button variant="contained" onClick={() => handleOpen()}>
        Thêm cơ sở
      </Button>
      {loading ? (
        <Typography>Đang tải...</Typography>
      ) : (
        <Grid container spacing={2} sx={{ mt: 2 }}>
          {facilities.map((f) => (
            <Grid item xs={12} md={6} key={f._id}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{f.name}</Typography>
                  <Typography>
                    {f.description.length > 100
                      ? `${f.description.substring(0, 100)}...`
                      : f.description}
                  </Typography>
                  <Typography variant="caption">
                    Liên hệ: {f.contactInfo}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button onClick={() => handleOpen(f)}>Sửa</Button>
                  <Button color="error" onClick={() => handleDelete(f._id)}>
                    Xoá
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{editing ? "Sửa" : "Thêm"} cơ sở</DialogTitle>
        <DialogContent>
          <TextField
            label="Tên cơ sở"
            fullWidth
            margin="dense"
            name="name"
            value={form.name}
            onChange={handleChange}
          />
          <TextField
            label="Mô tả"
            fullWidth
            multiline
            rows={3}
            margin="dense"
            name="description"
            value={form.description}
            onChange={handleChange}
          />
          <TextField
            label="Thông tin liên hệ"
            fullWidth
            margin="dense"
            name="contactInfo"
            value={form.contactInfo}
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
          <Typography>Bạn có chắc chắn muốn xóa cơ sở này?</Typography>
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

export default FacilityInfoManager;