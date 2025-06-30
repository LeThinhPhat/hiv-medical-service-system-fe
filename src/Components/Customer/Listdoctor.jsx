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
} from "@mui/material";
import { Link } from "react-router-dom";
import docService from "../../Services/CusService/docterListService";

const ListDoctor = () => {
  const [doctors, setDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("Tất cả bác sĩ");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const response = await docService.getAllDoctors();
        const data = Array.isArray(response.data) ? response.data : response;
        const mappedDoctors = data.map((doctor) => ({
          id: doctor._id,
          name: doctor.userID?.name || `Dr. ${doctor.userID?._id?.slice(-6) || "Unknown"}`,
          specialty: doctor.specializations || "Không có chuyên khoa",
          avatar: "https://nguoinoitieng.tv/images/nnt/107/0/bjur.jpg",
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

  return (
    <Box sx={{ bgcolor: "#f5f7fa", minHeight: "100vh", py: 6 }}>
      <Container maxWidth="lg">
        {/* Header Section */}
        <Box sx={{ mb: 6, textAlign: "center" }}>
          <Typography
            variant="h3"
            fontWeight={700}
            color="primary.main"
            sx={{ mb: 1, fontSize: { xs: "2rem", md: "3rem" } }}
          >
            Đội ngũ bác sĩ chuyên khoa
          </Typography>
        </Box>

        {/* Search Section */}
        <Paper
          elevation={3}
          sx={{
            p: 3,
            borderRadius: 2,
            mb: 4,
            bgcolor: "white",
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
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
              sx={{
                flex: 1,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  bgcolor: "white",
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
                  borderRadius: 2,
                  bgcolor: "white",
                },
              }}
            >
              {departments.map((dept, idx) => (
                <MenuItem key={idx} value={dept}>
                  {dept}
                </MenuItem>
              ))}
            </TextField>
            <Button
              variant="contained"
              color="primary"
              sx={{
                height: 56,
                px: 4,
                borderRadius: 2,
                fontWeight: 600,
                textTransform: "none",
                "&:hover": {
                  bgcolor: "primary.dark",
                  transform: "translateY(-2px)",
                  transition: "all 0.2s ease",
                },
              }}
            >
              Tìm kiếm
            </Button>
          </Stack>
        </Paper>

        {/* Doctors List */}
        <Paper elevation={0} sx={{ p: { xs: 2, md: 4 }, borderRadius: 2, bgcolor: "transparent" }}>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
              <CircularProgress size={48} />
            </Box>
          ) : error ? (
            <Typography color="error" align="center" variant="h6">
              {error}
            </Typography>
          ) : (
            <Fade in timeout={800}>
              <Box>
                <Typography
                  variant="h5"
                  fontWeight={600}
                  color="text.primary"
                  sx={{ mb: 3 }}
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
                            borderRadius: 3,
                            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                            transition: "transform 0.3s ease, box-shadow 0.3s ease",
                            "&:hover": {
                              transform: "translateY(-5px)",
                              boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                            },
                          }}
                        >
                          <CardMedia
                            component="img"
                            image={doctor.avatar}
                            alt={doctor.name}
                            sx={{
                              width: 120,
                              height: 120,
                              borderRadius: "50%",
                              objectFit: "cover",
                              mt: 3,
                              mx: "auto",
                              border: "2px solid #e0e0e0",
                            }}
                          />
                          <CardContent sx={{ flexGrow: 1, textAlign: "center" }}>
                            <Typography
                              variant="h6"
                              fontWeight={600}
                              color="text.primary"
                              sx={{ mb: 1 }}
                            >
                              {doctor.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {doctor.specialty}
                            </Typography>
                          </CardContent>
                          <CardActions sx={{ justifyContent: "center", pb: 3 }}>
                            <Button
                              component={Link}
                              to={`/docs/${doctor.id}`}
                              variant="outlined"
                              color="primary"
                              size="small"
                              sx={{
                                borderRadius: 2,
                                textTransform: "none",
                                mr: 1,
                                "&:hover": {
                                  bgcolor: "primary.main",
                                  color: "white",
                                },
                              }}
                            >
                              Xem chi tiết
                            </Button>
                            <Button
                              component={Link}
                              to={`/book/${doctor.id}`}
                              variant="contained"
                              color="primary"
                              size="small"
                              sx={{
                                borderRadius: 2,
                                textTransform: "none",
                                "&:hover": {
                                  bgcolor: "primary.dark",
                                },
                              }}
                            >
                              Đặt lịch khám
                            </Button>
                          </CardActions>
                        </Card>
                      </Grid>
                    ))
                  ) : (
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      align="center"
                      sx={{ width: "100%", py: 4 }}
                    >
                      Không tìm thấy bác sĩ nào.
                    </Typography>
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