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
import blogService from "../../../Services/StaffService/blogService";
import { toast } from "react-hot-toast";


const BlogPostManager = () => {
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);

  const [form, setForm] = useState({
    title: "",
    content: "",
    status: "",
    images: [""],
    authorID: "admin-id-test",
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await blogService.getAllBlogPosts();
        setPosts(data);
      } catch (err) {
        console.error(err);
        toast.error("Lỗi khi tải bài viết", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    };
    fetchData();
  }, []);

  const handleOpen = (post = null) => {
    setEditing(post);
    setForm(
      post || {
        title: "",
        content: "",
        status: "",
        images: [""],
        authorID: "admin-id-test",
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
        const updated = await blogService.updateBlogPost(editing._id, form, token);
        setPosts((prev) =>
          prev.map((p) => (p._id === editing._id ? updated : p))
        );
        toast.success("Cập nhật bài viết thành công!", {
          position: "top-right",
          autoClose: 3000,
        });
      } else {
        const created = await blogService.createBlogPost(form, token);
        setPosts((prev) => [...prev, created]);
        toast.success("Tạo bài viết thành công!", {
          position: "top-right",
          autoClose: 3000,
        });
      }
      setOpen(false);
    } catch (err) {
      console.error(err);
      toast.error("Lỗi khi lưu bài viết", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handleDelete = (id) => {
    setPostToDelete(id);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await blogService.deleteBlogPost(postToDelete, token);
      setPosts((prev) => prev.filter((p) => p._id !== postToDelete));
      toast.success("Xóa bài viết thành công!", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (err) {
      console.error(err);
      toast.error("Lỗi khi xóa bài viết", {
        position: "top-right",
        autoClose: 3000,
      });
    }
    setConfirmOpen(false);
    setPostToDelete(null);
  };

  const handleCancelDelete = () => {
    setConfirmOpen(false);
    setPostToDelete(null);
  };

  return (
    <>
      <Button variant="contained" onClick={() => handleOpen()}>
        Thêm bài viết
      </Button>

      <Grid container spacing={2} sx={{ mt: 2 }}>
        {posts.map((p) => (
          <Grid item xs={12} md={6} key={p._id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{p.title}</Typography>
                <Typography>{p.content}</Typography>
                <Typography variant="caption">
                  Trạng thái: {p.status}
                </Typography>
              </CardContent>
              <CardActions>
                <Button onClick={() => handleOpen(p)}>Sửa</Button>
                <Button color="error" onClick={() => handleDelete(p._id)}>
                  Xoá
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{editing ? "Sửa" : "Thêm"} bài viết</DialogTitle>
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
          <Typography>Bạn có chắc chắn muốn xóa bài viết này?</Typography>
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

export default BlogPostManager;