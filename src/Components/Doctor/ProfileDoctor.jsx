import React, { useEffect, useState } from "react";
import doctoprofileService from "../../Services/DoctorService/doctorprofileService";
import {
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Box,
} from "@mui/material";

const ProfileDoctor = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await doctoprofileService.getDoctorProfile();
        setProfile(data);
      } catch (error) {
        console.error("Lỗi khi lấy thông tin bác sĩ:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  if (!profile) {
    return (
      <Typography variant="h6">Không thể tải thông tin bác sĩ.</Typography>
    );
  }

  return (
    <Card sx={{ maxWidth: 600, margin: "auto", mt: 4, boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Thông tin Bác sĩ
        </Typography>
        <Typography>
          <strong>Tên:</strong> {profile.userID.name}
        </Typography>
        <Typography>
          <strong>Email:</strong> {profile.userID.email}
        </Typography>
        <Typography>
          <strong>Số điện thoại:</strong> {profile.userID.phone}
        </Typography>
        <Typography>
          <strong>Phòng:</strong> {profile.room}
        </Typography>
        <Typography>
          <strong>Bằng cấp:</strong> {profile.degrees}
        </Typography>
        <Typography>
          <strong>Chuyên môn:</strong> {profile.specializations}
        </Typography>
        <Typography>
          <strong>Kinh nghiệm:</strong> {profile.experiences.join(", ")}
        </Typography>
        <Typography>
          <strong>Người tạo:</strong> {profile.createdBy.email}
        </Typography>
        <Typography>
          <strong>Trạng thái:</strong>{" "}
          {profile.isActive ? "Hoạt động" : "Không hoạt động"}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default ProfileDoctor;
