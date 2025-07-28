import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Paper,
  CardMedia,
  Button,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import {
  Person as PersonIcon,
  LocalHospital,
  School,
  Event,
  Phone,
  CheckCircle,
  Cancel,
} from "@mui/icons-material";
import docService from "../../Services/CusService/docterListService";

const DetailDoctor = () => {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    setToken(savedToken);
  }, []);

  useEffect(() => {
    const fetchDoctorDetails = async () => {
      try {
        setLoading(true);
        const data = await docService.getDoctorById(id);
        setDoctor({
          id: data._id,
          name: data.userID?.name || "Unknown",
          phone: data.userID?.phone || "N/A",
          room: data.room || "N/A",
          avatarURL:
            data.avatarURL || "https://via.placeholder.com/120?text=Doctor",
          experiences: data.experiences || [],
          degrees: data.degrees || "N/A",
          specializations: data.specializations || "Không có chuyên khoa",
          isActive: data.isActive,
          createdAt: new Date(data.createdAt).toLocaleDateString(),
        });
      } catch (err) {
        setError("Không thể tải thông tin bác sĩ. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };
    fetchDoctorDetails();
  }, [id]);

  if (loading) {
    return (
      <Box className="min-h-screen bg-gray-50 flex items-center justify-center">
        <CircularProgress size={48} sx={{ color: "#60A5FA" }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Typography className="text-red-500 text-lg font-semibold">
          {error}
        </Typography>
      </Box>
    );
  }

  if (!doctor) {
    return (
      <Box className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Typography className="text-gray-600 text-lg font-semibold">
          Không tìm thấy thông tin bác sĩ.
        </Typography>
      </Box>
    );
  }

  return (
    <Box className="min-h-screen bg-blue-50 py-12">
      <Container maxWidth="lg">
        <Box className="mb-10 text-center">
          <Typography
            variant="h4"
            className="text-3xl sm:text-4xl font-bold text-blue-700"
          >
            Thông Tin Bác Sĩ
          </Typography>
        </Box>

        <Paper
          elevation={3}
          className="p-6 sm:p-8 rounded-2xl bg-white shadow-lg"
        >
          <Box className="flex flex-col md:flex-row gap-8">
            {/* Avatar */}
            <Box className="flex justify-center md:w-1/3">
              <CardMedia
                component="img"
                image={doctor.avatarURL}
                alt={doctor.name}
                className="w-full max-w-[280px] h-[300px] rounded-2xl object-cover border-4 border-blue-100 shadow"
              />
            </Box>

            {/* Info */}
            <Box className="flex-1 text-gray-700">
              <Typography className="text-2xl font-bold text-blue-800 mb-4">
                {doctor.name}
              </Typography>

              <Box className="space-y-3 text-base">
                <Typography>
                  <LocalHospital className="text-blue-600 mr-2" />
                  <strong>Chuyên khoa:</strong> {doctor.specializations}
                </Typography>

                <Typography>
                  <Phone className="text-green-600 mr-2" />
                  <strong>Số điện thoại:</strong> {doctor.phone}
                </Typography>

                <Typography>
                  <strong>Phòng:</strong> {doctor.room}
                </Typography>

                <Typography>
                  <School className="text-purple-600 mr-2" />
                  <strong>Bằng cấp:</strong> {doctor.degrees}
                </Typography>

                <Typography>
                  <strong>Kinh nghiệm:</strong>{" "}
                  {doctor.experiences.length > 0
                    ? doctor.experiences.join(", ")
                    : "Chưa cập nhật"}
                </Typography>

                <Typography>
                  {doctor.isActive ? (
                    <CheckCircle className="text-green-500 mr-2" />
                  ) : (
                    <Cancel className="text-red-500 mr-2" />
                  )}
                  <strong>Trạng thái:</strong>{" "}
                  {doctor.isActive ? "Đang hoạt động" : "Ngừng hoạt động"}
                </Typography>

                <Typography>
                  <Event className="text-pink-500 mr-2" />
                  <strong>Ngày tham gia:</strong> {doctor.createdAt}
                </Typography>
              </Box>

              {/* Actions */}
              <Box className="flex flex-wrap gap-4 mt-8">
                {token ? (
                  <Button
                    component={Link}
                    to={`/book/${doctor.id}`}
                    variant="contained"
                    className="rounded-full"
                    sx={{
                      background: "linear-gradient(to right, #3B82F6, #9333EA)",
                      textTransform: "none",
                      fontWeight: "bold",
                      px: 4,
                      py: 1.5,
                      "&:hover": {
                        background:
                          "linear-gradient(to right, #2563EB, #7E22CE)",
                      },
                    }}
                  >
                    Đặt lịch khám
                  </Button>
                ) : (
                  <Tooltip title="Vui lòng đăng nhập để đặt lịch khám">
                    <span>
                      <Button
                        disabled
                        variant="contained"
                        className="rounded-full opacity-60"
                        sx={{ textTransform: "none", px: 4, py: 1.5 }}
                      >
                        Đặt lịch khám
                      </Button>
                    </span>
                  </Tooltip>
                )}

                <Button
                  component={Link}
                  to="/booking"
                  variant="outlined"
                  className="rounded-full"
                  sx={{
                    borderColor: "#3B82F6",
                    color: "#3B82F6",
                    textTransform: "none",
                    px: 4,
                    py: 1.5,
                    "&:hover": {
                      backgroundColor: "#EFF6FF",
                      borderColor: "#2563EB",
                      color: "#2563EB",
                    },
                  }}
                >
                  Quay lại danh sách
                </Button>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default DetailDoctor;
