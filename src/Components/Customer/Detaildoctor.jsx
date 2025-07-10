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
  Fade,
  Tooltip,
} from "@mui/material";
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
          experiences: data.experiences || [],
          degrees: data.degrees || "N/A",
          specializations: data.specializations || "Không có chuyên khoa",
          isActive: data.isActive,
          createdAt: new Date(data.createdAt).toLocaleDateString(),
        });
      } catch (err) {
        setError("Không thể tải thông tin bác sĩ. Vui lòng thử lại sau.",err);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctorDetails();
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ minHeight: "100vh", bgcolor: "#f5f7fa", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <CircularProgress size={48} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ minHeight: "100vh", bgcolor: "#f5f7fa", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Typography variant="h6" color="error.main">
          {error}
        </Typography>
      </Box>
    );
  }

  if (!doctor) {
    return (
      <Box sx={{ minHeight: "100vh", bgcolor: "#f5f7fa", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Typography variant="h6" color="text.secondary">
          Không tìm thấy thông tin bác sĩ.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f7fa", py: 6 }}>
      <Container maxWidth="lg">
        {/* Header Section */}
        <Box sx={{ mb: 6, textAlign: "center" }}>
          <Typography
            variant="h3"
            fontWeight={700}
            color="primary.main"
            sx={{ mb: 1, fontSize: { xs: "2rem", md: "3rem" } }}
          >
            Thông tin chi tiết bác sĩ
          </Typography>
        </Box>

        {/* Main Content */}
        <Fade in timeout={800}>
          <Paper
            elevation={3}
            sx={{
              p: { xs: 3, md: 4 },
              borderRadius: 3,
              bgcolor: "white",
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            }}
          >
            <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 4 }}>
              {/* Doctor Image */}
              <Box sx={{ flex: { xs: "1 0 100%", md: "0 0 300px" }, display: "flex", justifyContent: "center" }}>
                <CardMedia
                  component="img"
                  image="https://nguoinoitieng.tv/images/nnt/107/0/bjur.jpg"
                  alt={doctor.name}
                  sx={{
                    width: { xs: "100%", md: 300 },
                    height: { xs: 200, md: 300 },
                    borderRadius: 3,
                    objectFit: "cover",
                    border: "2px solid #e0e0e0",
                  }}
                />
              </Box>

              {/* Doctor Details */}
              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="h4"
                  fontWeight={600}
                  color="text.primary"
                  sx={{ mb: 3 }}
                >
                  Bác sĩ {doctor.name}
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <Typography variant="body1" color="text.secondary">
                    <strong>Chuyên khoa:</strong> {doctor.specializations}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    <strong>Số điện thoại:</strong> {doctor.phone}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    <strong>Phòng:</strong> {doctor.room}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    <strong>Kinh nghiệm:</strong>{" "}
                    {doctor.experiences.length > 0 ? doctor.experiences.join(", ") : "N/A"}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    <strong>Bằng cấp:</strong> {doctor.degrees}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    <strong>Trạng thái:</strong>{" "}
                    {doctor.isActive ? "Đang hoạt động" : "Không hoạt động"}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    <strong>Ngày tham gia:</strong> {doctor.createdAt}
                  </Typography>
                </Box>

                {/* Action Buttons */}
                <Box sx={{ display: "flex", gap: 2, mt: 4 }}>
                  {token ? (
                    <Button
                      component={Link}
                      to={`/book/${doctor.id}`}
                      variant="contained"
                      color="primary"
                      sx={{
                        px: 4,
                        py: 1.5,
                        borderRadius: 2,
                        textTransform: "none",
                        fontWeight: 600,
                        "&:hover": {
                          bgcolor: "primary.dark",
                          transform: "translateY(-2px)",
                          transition: "all 0.2s ease",
                        },
                      }}
                    >
                      Đặt lịch khám
                    </Button>
                  ) : (
                    <Tooltip title="Vui lòng đăng nhập để đặt lịch khám">
                      <span>
                        <Button
                          variant="contained"
                          color="primary"
                          disabled
                          sx={{
                            px: 4,
                            py: 1.5,
                            borderRadius: 2,
                            textTransform: "none",
                            fontWeight: 600,
                            opacity: 0.6,
                          }}
                        >
                          Đặt lịch khám
                        </Button>
                      </span>
                    </Tooltip>
                  )}

                  <Button
                    component={Link}
                    to="/docs"
                    variant="outlined"
                    color="primary"
                    sx={{
                      px: 4,
                      py: 1.5,
                      borderRadius: 2,
                      textTransform: "none",
                      fontWeight: 600,
                      "&:hover": {
                        bgcolor: "#f0f0f0",
                        transform: "translateY(-2px)",
                        transition: "all 0.2s ease",
                      },
                    }}
                  >
                    Quay lại danh sách bác sĩ
                  </Button>
                </Box>
              </Box>
            </Box>
          </Paper>
        </Fade>
      </Container>
    </Box>
  );
};

export default DetailDoctor;
