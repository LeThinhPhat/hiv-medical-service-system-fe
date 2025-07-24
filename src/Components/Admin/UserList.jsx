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
import UserService from "../../Services/userService";

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
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    gender: "None",
    dob: "",
    role: { name: "CUSTOMER_ROLE" },
    isVerified: false,
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchName, setSearchName] = useState("");
  const [filterRole, setFilterRole] = useState("all");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await UserService.getAllUsers();
        setUsers(data);
        setFilteredUsers(data);
        setLoading(false);
      } catch (error) {
        console.error("Lỗi khi tải danh sách người dùng", error);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    let result = users;
    if (searchName) {
      result = result.filter((user) =>
        user.name.toLowerCase().includes(searchName.toLowerCase())
      );
    }
    if (filterRole !== "all") {
      result = result.filter((user) => user.role.name === filterRole);
    }
    setFilteredUsers(result);
    setPage(0); // Reset to first page when filters change
  }, [searchName, filterRole, users]);

  const handleOpenDialog = (user = null) => {
    if (user) {
      setIsEditing(true);
      setCurrentUserId(user._id);
      setFormData({
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        gender: user.gender,
        dob: user.dob.split("T")[0],
        role: user.role,
        isVerified: user.isVerified,
      });
    } else {
      setIsEditing(false);
      setFormData({
        name: "",
        email: "",
        phone: "",
        address: "",
        gender: "None",
        dob: "",
        role: { name: "CUSTOMER_ROLE" },
        isVerified: false,
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentUserId(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "role") {
      setFormData({ ...formData, role: { name: value } });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async () => {
    try {
      if (isEditing) {
        const updatedUser = await UserService.updateUser(currentUserId, formData);
        setUsers(
          users.map((user) =>
            user._id === currentUserId ? { ...user, ...updatedUser } : user
          )
        );
      } else {
        const newUser = await UserService.createUser(formData);
        setUsers([...users, newUser]);
      }
      handleCloseDialog();
    } catch (error) {
      console.error("Lỗi khi lưu người dùng", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await UserService.deleteUser(id);
      setUsers(users.filter((user) => user._id !== id));
    } catch (error) {
      console.error("Lỗi khi xóa người dùng", error);
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
            {Object.entries(roleTranslations).map(([key, { label }]) => (
              <MenuItem key={key} value={key}>
                {label}
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
                      label={roleTranslations[user.role.name]?.label || user.role.name}
                      color={roleTranslations[user.role.name]?.color || "default"}
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
                      <IconButton onClick={() => handleDelete(user._id)}>
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
            name="name"
            label="Tên"
            fullWidth
            value={formData.name}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="email"
            label="Email"
            fullWidth
            value={formData.email}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="phone"
            label="Điện thoại"
            fullWidth
            value={formData.phone}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="address"
            label="Địa chỉ"
            fullWidth
            value={formData.address}
            onChange={handleInputChange}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Giới tính</InputLabel>
            <Select
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              label="Giới tính"
            >
              <MenuItem value="Nam">Nam</MenuItem>
              <MenuItem value="Nữ">Nữ</MenuItem>
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
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Vai trò</InputLabel>
            <Select
              name="role"
              value={formData.role.name}
              onChange={handleInputChange}
              label="Vai trò"
            >
              {Object.entries(roleTranslations).map(([key, { label }]) => (
                <MenuItem key={key} value={key}>
                  {label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Hủy</Button>
          <Button onClick={handleSubmit} variant="contained">
            {isEditing ? "Cập nhật" : "Thêm"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserList;