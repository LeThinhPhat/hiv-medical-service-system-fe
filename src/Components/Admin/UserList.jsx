import React, { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  CircularProgress,
  Stack,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  TablePagination,
} from "@mui/material";
import VerifiedIcon from "@mui/icons-material/Verified";
import PersonOffIcon from "@mui/icons-material/PersonOff";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UserService from "../../Services/userService";
import UploadImage from "../../Services/UploadImage";

const roleTranslations = {
  ADMIN_ROLE: { label: "Quản trị viên", color: "error" },
  CUSTOMER_ROLE: { label: "Khách hàng", color: "primary" },
  MANAGER_ROLE: { label: "Quản lý", color: "warning" },
  DOCTOR_ROLE: { label: "Bác sĩ", color: "success" },
  STAFF_ROLE: { label: "Nhân viên", color: "info" },
};

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    gender: "None",
    dob: "",
    address: "",
    phone: "",
    role: "CUSTOMER_ROLE",
    isVerified: false,
    avatarURL: "",
  });
  const [errors, setErrors] = useState({});
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchName, setSearchName] = useState("");
  const [filterRole, setFilterRole] = useState("all");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userData, roleData] = await Promise.all([
          UserService.getAllUsers(),
          UserService.getAllRoles(),
        ]);
        setUsers(userData);
        setFilteredUsers(userData);
        setRoles(roleData);
        setLoading(false);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    let result = users;
    if (searchName) {
      result = result.filter((user) =>
        user.name.toLowerCase().includes(searchName.toLowerCase())
      );
    }
    if (filterRole !== "all") {
      result = result.filter((user) => user.role?.name === filterRole);
    }
    setFilteredUsers(result);
    setPage(0);
  }, [searchName, filterRole, users]);

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10,11}$/;
    const today = new Date();
    const dob = new Date(formData.dob);

    if (!formData.email) {
      newErrors.email = "Email là bắt buộc";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    if (!isEditing && !formData.password) {
      newErrors.password = "Mật khẩu là bắt buộc";
    } else if (!isEditing && formData.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    if (!formData.name) {
      newErrors.name = "Tên là bắt buộc";
    } else if (formData.name.length < 2) {
      newErrors.name = "Tên phải có ít nhất 2 ký tự";
    }

    if (!formData.phone) {
      newErrors.phone = "Số điện thoại là bắt buộc";
    } else if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = "Số điện thoại không hợp lệ (10-11 số)";
    }

    if (!formData.address) {
      newErrors.address = "Địa chỉ là bắt buộc";
    }

    if (!formData.dob) {
      newErrors.dob = "Ngày sinh là bắt buộc";
    } else if (dob >= today) {
      newErrors.dob = "Ngày sinh phải nhỏ hơn ngày hiện tại";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleOpenDialog = (user = null) => {
    if (user) {
      setIsEditing(true);
      setCurrentUserId(user._id);
      setFormData({
        email: user.email,
        password: "",
        name: user.name,
        gender: user.gender,
        dob: user.dob.split("T")[0],
        address: user.address,
        phone: user.phone,
        role: user.role?._id,
        isVerified: user.isVerified,
        avatarURL: user.avatarURL || "",
      });
    } else {
      setIsEditing(false);
      const defaultRole = roles.find((r) => r.name === "CUSTOMER_ROLE")?._id || "";
      setFormData({
        email: "",
        password: "",
        name: "",
        gender: "None",
        dob: "",
        address: "",
        phone: "",
        role: defaultRole,
        isVerified: false,
        avatarURL: "",
      });
    }
    setErrors({});
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentUserId(null);
    setErrors({});
  };

  const handleOpenDeleteDialog = (user) => {
    setUserToDelete(user);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setUserToDelete(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error for the field when user starts typing
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleUploadSuccess = (url) => {
    setFormData({ ...formData, avatarURL: url });
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error("Vui lòng kiểm tra lại các trường dữ liệu!");
      return;
    }

    try {
      if (isEditing) {
        const updateData = {
          email: formData.email,
          name: formData.name,
          gender: formData.gender,
          dob: formData.dob,
          address: formData.address,
          phone: formData.phone,
          role: formData.role,
          avatarURL: formData.avatarURL,
        };
        const updatedUser = await UserService.updateUser(currentUserId, updateData);
        setUsers(
          users.map((user) =>
            user._id === currentUserId ? { ...user, ...updatedUser } : user
          )
        );
        toast.success("Cập nhật người dùng thành công!");
      } else {
        const createData = { ...formData };
        const newUser = await UserService.createUser(createData);
        setUsers([...users, newUser]);
        toast.success("Thêm người dùng thành công!");
      }
      handleCloseDialog();
    } catch (error) {
      console.error("Lỗi khi lưu người dùng", error);
      toast.error("Lỗi khi lưu người dùng!");
    }
  };

  const handleDelete = async () => {
    try {
      await UserService.deleteUser(userToDelete._id);
      setUsers(users.filter((user) => user._id !== userToDelete._id));
      handleCloseDeleteDialog();
      toast.success("Xóa người dùng thành công!");
    } catch (error) {
      console.error("Lỗi khi xóa người dùng", error);
      toast.error("Lỗi khi xóa người dùng!");
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchNameChange = (event) => {
    setSearchName(event.target.value);
  };

  const handleFilterRoleChange = (event) => {
    setFilterRole(event.target.value);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={4}>
      <ToastContainer />
      <Typography variant="h4" gutterBottom>
        Danh sách người dùng
      </Typography>
      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleOpenDialog()}
        >
          Thêm người dùng
        </Button>
        <TextField
          label="Tìm kiếm theo tên"
          variant="outlined"
          value={searchName}
          onChange={handleSearchNameChange}
          size="small"
        />
        <FormControl sx={{ minWidth: 120 }} size="small">
          <InputLabel>Vai trò</InputLabel>
          <Select
            value={filterRole}
            onChange={handleFilterRoleChange}
            label="Vai trò"
          >
            <MenuItem value="all">Tất cả</MenuItem>
            {roles.map((role) => (
              <MenuItem key={role._id} value={role.name}>
                {roleTranslations[role.name]?.label || role.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Avatar</TableCell>
              <TableCell>Tên</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Điện thoại</TableCell>
              <TableCell>Địa chỉ</TableCell>
              <TableCell>Giới tính</TableCell>
              <TableCell>Ngày sinh</TableCell>
              <TableCell>Vai trò</TableCell>
              <TableCell>Xác minh</TableCell>
              <TableCell>Ngày tạo</TableCell>
              <TableCell>Cập nhật</TableCell>
              <TableCell>Đã xóa</TableCell>
              <TableCell>Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((user) => (
                <TableRow key={user._id}>
                  <TableCell>
                    <Avatar src={user.avatarURL || undefined}>
                      {user.name?.charAt(0) || "U"}
                    </Avatar>
                  </TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phone}</TableCell>
                  <TableCell>{user.address}</TableCell>
                  <TableCell>{user.gender}</TableCell>
                  <TableCell>
                    {new Date(user.dob).toLocaleDateString("vi-VN")}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={roleTranslations[user.role?.name]?.label || user.role?.name || "Không xác định"}
                      color={roleTranslations[user.role?.name]?.color || "default"}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {user.isVerified ? (
                      <Chip
                        icon={<VerifiedIcon />}
                        label="Đã xác minh"
                        color="success"
                        size="small"
                      />
                    ) : (
                      <Chip
                        icon={<PersonOffIcon />}
                        label="Chưa xác minh"
                        color="warning"
                        size="small"
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    {new Date(user.createdAt).toLocaleString("vi-VN")}
                  </TableCell>
                  <TableCell>
                    {new Date(user.updatedAt).toLocaleString("vi-VN")}
                  </TableCell>
                  <TableCell>{user.isDeleted ? "Có" : "Không"}</TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <IconButton onClick={() => handleOpenDialog(user)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleOpenDeleteDialog(user)}>
                        <DeleteIcon />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredUsers.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Số hàng mỗi trang"
        labelDisplayedRows={({ from, to, count }) =>
          `${from}–${to} trong số ${count !== -1 ? count : `hơn ${to}`}`
        }
      />

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{isEditing ? "Chỉnh sửa người dùng" : "Thêm người dùng"}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            name="email"
            label="Email"
            fullWidth
            value={formData.email}
            onChange={handleInputChange}
            error={!!errors.email}
            helperText={errors.email}
          />
          <TextField
            margin="dense"
            name="password"
            label="Mật khẩu"
            type="password"
            fullWidth
            value={formData.password}
            onChange={handleInputChange}
            disabled={isEditing}
            error={!!errors.password}
            helperText={errors.password}
          />
          <TextField
            margin="dense"
            name="name"
            label="Tên"
            fullWidth
            value={formData.name}
            onChange={handleInputChange}
            error={!!errors.name}
            helperText={errors.name}
          />
          <TextField
            margin="dense"
            name="phone"
            label="Điện thoại"
            fullWidth
            value={formData.phone}
            onChange={handleInputChange}
            error={!!errors.phone}
            helperText={errors.phone}
          />
          <TextField
            margin="dense"
            name="address"
            label="Địa chỉ"
            fullWidth
            value={formData.address}
            onChange={handleInputChange}
            error={!!errors.address}
            helperText={errors.address}
          />
          <UploadImage onUploadSuccess={handleUploadSuccess} />
          {formData.avatarURL && (
            <Box mt={1}>
              <Typography variant="body2">URL ảnh: {formData.avatarURL}</Typography>
            </Box>
          )}
          <FormControl fullWidth margin="dense">
            <InputLabel>Giới tính</InputLabel>
            <Select
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              label="Giới tính"
            >
              <MenuItem value="Male">Nam</MenuItem>
              <MenuItem value="Female">Nữ</MenuItem>
              <MenuItem value="None">Không xác định</MenuItem>
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            name="dob"
            label="Ngày sinh"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={formData.dob}
            onChange={handleInputChange}
            error={!!errors.dob}
            helperText={errors.dob}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Vai trò</InputLabel>
            <Select
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              label="Vai trò"
            >
              {roles.map((role) => (
                <MenuItem key={role._id} value={role._id}>
                  {roleTranslations[role.name]?.label || role.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {!isEditing && (
            <FormControl fullWidth margin="dense">
              <InputLabel>Xác minh</InputLabel>
              <Select
                name="isVerified"
                value={formData.isVerified}
                onChange={handleInputChange}
                label="Xác minh"
              >
                <MenuItem value={true}>Đã xác minh</MenuItem>
                <MenuItem value={false}>Chưa xác minh</MenuItem>
              </Select>
            </FormControl>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Hủy</Button>
          <Button onClick={handleSubmit} variant="contained">
            {isEditing ? "Cập nhật" : "Thêm"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
          <Typography>
            Bạn có chắc chắn muốn xóa người dùng{" "}
            <strong>{userToDelete?.name}</strong>? Hành động này không thể hoàn tác.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Hủy</Button>
          <Button onClick={handleDelete} variant="contained" color="error">
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserList;