import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import docService from "../Services/CusService/docterListService";
import {
  CircularProgress,
  Container,
  Typography,
  Box,
  Button,
} from "@mui/material";

const IntroDoctor = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const response = await docService.getAllDoctors();
        const data = Array.isArray(response.data) ? response.data : response;

        const mappedDoctors = data.slice(0, 4).map((doctor) => ({
          id: doctor._id,
          name:
            doctor.userID?.name ||
            `Dr. ${doctor.userID?._id?.slice(-6) || "Unknown"}`,
          specialty: doctor.specializations || "Không có chuyên khoa",
          avatar:
            doctor.avatarURL || "https://via.placeholder.com/120?text=Doctor",
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

  return (
    <div className="bg-gradient-to-br from-green-50 to-indigo-100 py-20">
      <Container maxWidth="lg">
        {/* Header */}
        <Box className="text-center mb-16 max-w-3xl mx-auto">
          <Typography
            variant="h4"
            component="h2"
            gutterBottom
            sx={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 800,
              fontSize: {
                xs: "2rem",
                sm: "2.5rem",
                md: "3rem",
              },
              color: "#1E40AF",
            }}
          >
            Gặp Gỡ Đội Ngũ Bác Sĩ Chuyên Gia
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{
              color: "#4B5563",
              fontSize: {
                xs: "1rem",
                md: "1.125rem",
              },
              mt: 1,
              fontFamily: "'Inter', sans-serif",
            }}
          >
            Đội ngũ bác sĩ giàu kinh nghiệm, tận tâm và chuyên môn cao luôn sẵn
            sàng chăm sóc sức khỏe cho bạn.
          </Typography>
        </Box>

        {/* Content */}
        {loading ? (
          <Box className="flex justify-center py-12">
            <CircularProgress size={56} sx={{ color: "#3B82F6" }} />
          </Box>
        ) : error ? (
          <Box className="text-center py-8">
            <Typography className="text-red-600 text-lg font-medium">
              {error}
            </Typography>
          </Box>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-2">
            {doctors.map((doctor) => (
              <div
                key={doctor.id}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transform hover:-translate-y-1 transition duration-300 p-6 flex flex-col items-center text-center"
              >
                <img
                  src={doctor.avatar}
                  alt={doctor.name}
                  className="w-28 h-28 rounded-full border-4 border-blue-200 shadow-md object-cover mb-4"
                />
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  {doctor.name}
                </h3>
                <p className="text-sm text-gray-600 mb-3">{doctor.specialty}</p>
                <Link to={`/docs/${doctor.id}`} className="w-full">
                  <Button
                    fullWidth
                    variant="contained"
                    sx={{
                      textTransform: "none",
                      fontWeight: 600,
                      borderRadius: "9999px",
                      fontFamily: "'Inter', sans-serif",
                      background: "linear-gradient(to right, #3B82F6, #A855F7)",
                      "&:hover": {
                        background:
                          "linear-gradient(to right, #2563EB, #9333EA)",
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
                      },
                    }}
                  >
                    Xem chi tiết
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        )}
      </Container>
    </div>
  );
};

export default IntroDoctor;
