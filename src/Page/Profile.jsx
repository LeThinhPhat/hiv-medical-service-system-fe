import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Grid,
  Divider,
  Button,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

const mockUser = {
  fullName: "Nguyễn Văn A",
  username: "nguyenvana",
  email: "nguyenvana@example.com",
  phone: "0123 456 789",
  gender: "Nam",
  address: "123 Đường ABC, Quận 1, TP.HCM",
  avatar:
    "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=100",
};

const Profile = () => {
  return (
    <Box sx={{ p: 4, backgroundColor: "#f4f6f8", minHeight: "100vh" }}>
      <Card
        sx={{ maxWidth: 700, margin: "auto", boxShadow: 3, borderRadius: 4 }}
      >
        <CardContent>
          <Box display="flex" alignItems="center" gap={3}>
            <Avatar
              src={mockUser.avatar}
              alt={mockUser.fullName}
              sx={{ width: 100, height: 100 }}
            />
            <Box>
              <Typography variant="h5" fontWeight="bold">
                {mockUser.fullName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                @{mockUser.username}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Email
              </Typography>
              <Typography>{mockUser.email}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Số điện thoại
              </Typography>
              <Typography>{mockUser.phone}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Giới tính
              </Typography>
              <Typography>{mockUser.gender}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Địa chỉ
              </Typography>
              <Typography>{mockUser.address}</Typography>
            </Grid>
          </Grid>

          <Box textAlign="right" mt={4}>
            <Button
              variant="contained"
              startIcon={<EditIcon />}
              sx={{ borderRadius: 2 }}
            >
              Chỉnh sửa hồ sơ
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Profile;
