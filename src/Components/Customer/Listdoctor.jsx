import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  CircularProgress,
  MenuItem,
  Fade,
  Stack,
  Tooltip,
  IconButton,
} from "@mui/material";
import { Link } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import PersonOffIcon from "@mui/icons-material/PersonOff";
import docService from "../../Services/CusService/docterListService";

const ListDoctor = () => {
  const [doctors, setDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("Tất cả bác sĩ");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    setToken(savedToken);

    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const response = await docService.getAllDoctors();
        const data = Array.isArray(response.data) ? response.data : response;
        const mappedDoctors = data.map((doctor) => ({
          id: doctor._id,
          name: doctor.userID?.name || `Dr. ${doctor.userID?._id?.slice(-6) || "Unknown"}`,
          specialty: doctor.specializations || "Không có chuyên khoa",
          avatar: doctor.avatar || "https://via.placeholder.com/120?text=Doctor",
        }));
        setDoctors(mappedDoctors);
      } catch (err) {
        setError("Không thể tải danh sách bác sĩ. Vui lòng thử lại sau.");
        console.error("Error fetching doctors:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  const departments = ["Tất cả bác sĩ", ...new Set(doctors.map((doctor) => doctor.specialty))];

  const filteredDoctors = doctors.filter(
    (doctor) =>
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedDepartment === "Tất cả bác sĩ" || doctor.specialty === selectedDepartment)
  );

  const handleReset = () => {
    setSearchTerm("");
    setSelectedDepartment("Tất cả bác sĩ");
  };

  return (
    <Box sx={{ bgcolor: "linear-gradient(180deg, #f5f7fa 0%, #e8ecef 100%)", minHeight: "100vh", py: 6 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ mb: 6, textAlign: "center" }}>
          <Typography
            variant="h3"
            fontWeight={700}
            sx={{
              color: "#1976d2",
              mb: 1,
              fontSize: { xs: "2rem", md: "3rem" },
              textShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            Đội ngũ bác sĩ chuyên khoa
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ fontSize: { xs: "1rem", md: "1.2rem" } }}>
            Tìm kiếm bác sĩ phù hợp với nhu cầu của bạn
          </Typography>
        </Box>

        {/* Search Filter */}
        <Paper
          elevation={4}
          sx={{
            p: 3,
            borderRadius: 3,
            mb: 4,
            bgcolor: "white",
            boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
          }}
        >
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            alignItems="center"
            justifyContent="center"
          >
            <TextField
              label="Tìm kiếm bác sĩ"
              variant="outlined"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />,
                endAdornment: searchTerm && (
                  <IconButton onClick={() => setSearchTerm("")} size="small">
                    <ClearIcon />
                  </IconButton>
                ),
              }}
              sx={{
                flex: 1,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 3,
                  bgcolor: "white",
                  "&:hover fieldset": { borderColor: "#1976d2" },
                },
              }}
            />
            <TextField
              select
              label="Chuyên khoa"
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              sx={{
                flex: 1,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 3,
                  bgcolor: "white",
                  "&:hover fieldset": { borderColor: "#1976d2" },
                },
              }}
            >
              {departments.map((dept, idx) => (
                <MenuItem key={idx} value={dept}>
                  {dept}
                </MenuItem>
              ))}
            </TextField>
            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<SearchIcon />}
                sx={{
                  height: 56,
                  px: 4,
                  borderRadius: 3,
                  fontWeight: 600,
                  textTransform: "none",
                  bgcolor: "#1976d2",
                  "&:hover": {
                    bgcolor: "#1565c0",
                    transform: "translateY(-2px)",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                  },
                }}
              >
                Tìm kiếm
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                startIcon={<ClearIcon />}
                onClick={handleReset}
                sx={{
                  height: 56,
                  px: 4,
                  borderRadius: 3,
                  fontWeight: 600,
                  textTransform: "none",
                  "&:hover": {
                    borderColor: "#d81b60",
                    color: "#d81b60",
                  },
                }}
              >
                Xóa bộ lọc
              </Button>
            </Stack>
          </Stack>
        </Paper>

        {/* Doctor List */}
        <Paper elevation={0} sx={{ p: { xs: 2, md: 4 }, borderRadius: 3, bgcolor: "transparent" }}>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
              <CircularProgress size={48} color="primary" />
            </Box>
          ) : error ? (
            <Box sx={{ textAlign: "center", py: 6 }}>
              <PersonOffIcon color="error" sx={{ fontSize: 48, mb: 2 }} />
              <Typography color="error" variant="h6">
                {error}
              </Typography>
            </Box>
          ) : (
            <Fade in timeout={800}>
              <Box>
                <Typography
                  variant="h5"
                  fontWeight={600}
                  color="text.primary"
                  sx={{ mb: 3, fontSize: { xs: "1.5rem", md: "1.8rem" } }}
                >
                  {selectedDepartment}
                </Typography>
                <Grid container spacing={3}>
                  {filteredDoctors.length > 0 ? (
                    filteredDoctors.map((doctor) => (
                      <Grid item xs={12} sm={6} md={4} key={doctor.id}>
                        <Card
                          sx={{
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                            borderRadius: 4,
                            boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
                            transition: "all 0.3s ease",
                            "&:hover": {
                              transform: "translateY(-8px)",
                              boxShadow: "0 12px 24px rgba(0,0,0,0.2)",
                            },
                          }}
                        >
                          <CardMedia
                            component="img"
                            image={doctor.avatar}
                            alt={doctor.name}
                            sx={{
                              width: 140,
                              height: 140,
                              borderRadius: "50%",
                              objectFit: "cover",
                              mt: 3,
                              mx: "auto",
                              border: "3px solid #e3f2fd",
                              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                            }}
                          />
                          <CardContent sx={{ flexGrow: 1, textAlign: "center", pt: 2 }}>
                            <Typography
                              variant="h6"
                              fontWeight={600}
                              color="text.primary"
                              sx={{ mb: 1, fontSize: "1.25rem" }}
                            >
                              {doctor.name}
                            </Typography>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ fontSize: "0.9rem" }}
                            >
                              {doctor.specialty}
                            </Typography>
                          </CardContent>
                          <CardActions sx={{ justifyContent: "center", pb: 3, gap: 1 }}>
                            <Button
                              component={Link}
                              to={`/docs/${doctor.id}`}
                              variant="outlined"
                              color="primary"
                              size="medium"
                              sx={{
                                borderRadius: 2,
                                textTransform: "none",
                                px: 3,
                                py: 1,
                                fontWeight: 500,
                                "&:hover": {
                                  bgcolor: "#e3f2fd",
                                  borderColor: "#1976d2",
                                },
                              }}
                            >
                              Xem chi tiết
                            </Button>
                            {token ? (
                              <Button
                                component={Link}
                                to={`/book/${doctor.id}`}
                                variant="contained"
                                color="primary"
                                size="medium"
                                sx={{
                                  borderRadius: 2,
                                  textTransform: "none",
                                  px: 3,
                                  py: 1,
                                  fontWeight: 500,
                                  "&:hover": {
                                    bgcolor: "#1565c0",
                                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
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
                                    size="medium"
                                    disabled
                                    sx={{
                                      borderRadius: 2,
                                      textTransform: "none",
                                      px: 3,
                                      py: 1,
                                      fontWeight: 500,
                                      opacity: 0.6,
                                    }}
                                  >
                                    Đặt lịch khám
                                  </Button>
                                </span>
                              </Tooltip>
                            )}
                          </CardActions>
                        </Card>
                      </Grid>
                    ))
                  ) : (
                    <Box sx={{ textAlign: "center", py: 6, width: "100%" }}>
                      <PersonOffIcon sx={{ fontSize: 48, color: "text.secondary", mb: 2 }} />
                      <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{ fontSize: "1.1rem" }}
                      >
                        Không tìm thấy bác sĩ nào phù hợp.
                      </Typography>
                    </Box>
                  )}
                </Grid>
              </Box>
            </Fade>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default ListDoctor;