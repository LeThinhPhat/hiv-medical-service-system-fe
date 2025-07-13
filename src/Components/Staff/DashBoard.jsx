import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Grid,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  CircularProgress,
} from "@mui/material";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import dayjs from "dayjs";
import dashboardService from "../../Services/StaffService/dashboardService";

const Dashboard = () => {
  const [month, setMonth] = useState(dayjs().month() + 1);
  const [year, setYear] = useState(dayjs().year());
  const [rawData, setRawData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);

  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const years = [2024, 2025, 2026];

  // Call API once
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await dashboardService.getRevenueStatistics("day");
        setRawData(data || []);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter data by month/year
  useEffect(() => {
    const filtered = rawData.filter((item) => {
      const date = dayjs(item._id);
      return date.month() + 1 === parseInt(month) && date.year() === parseInt(year);
    });
    setFilteredData(filtered);
  }, [month, year, rawData]);

  // Tính tổng doanh thu và lịch hẹn
  const totalRevenue = filteredData.reduce((sum, d) => sum + d.totalRevenue, 0);
  const totalAppointments = filteredData.reduce((sum, d) => sum + d.totalAppointments, 0);

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" sx={{ mt: 4, mb: 2 }}>
        Báo Cáo Hoạt Động Y Tế
      </Typography>

      {/* Bộ lọc tháng / năm */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <FormControl fullWidth>
            <InputLabel>Tháng</InputLabel>
            <Select value={month} label="Tháng" onChange={(e) => setMonth(e.target.value)}>
              {months.map((m) => (
                <MenuItem key={m} value={m}>
                  Tháng {m}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={3}>
          <FormControl fullWidth>
            <InputLabel>Năm</InputLabel>
            <Select value={year} label="Năm" onChange={(e) => setYear(e.target.value)}>
              {years.map((y) => (
                <MenuItem key={y} value={y}>
                  {y}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* Tổng quan nhanh */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Card sx={{ background: "#e3f2fd", minHeight: 120, height: "100%" }}>
            <CardContent
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <Typography variant="subtitle1">Tổng doanh thu</Typography>
              <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                {totalRevenue.toLocaleString("vi-VN")} ₫
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ background: "#fce4ec", minHeight: 120, height: "100%" }}>
            <CardContent
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <Typography variant="subtitle1">Tổng lịch hẹn</Typography>
              <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                {totalAppointments}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Biểu đồ */}
      {loading ? (
        <Box display="flex" justifyContent="center" mt={6}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Box sx={{ height: 400, mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Doanh thu theo ngày
            </Typography>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={filteredData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="_id" />
                <YAxis />
                <Tooltip
                  formatter={(value) =>
                    new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(value)
                  }
                />
                <Legend />
                <Bar dataKey="totalRevenue" fill="#1976d2" name="Doanh thu (VNĐ)" />
              </BarChart>
            </ResponsiveContainer>
          </Box>

          <Box sx={{ height: 400, mt: 6 }}>
            <Typography variant="h6" gutterBottom>
              Lịch hẹn theo ngày
            </Typography>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={filteredData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="_id" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="totalAppointments"
                  stroke="#e91e63"
                  name="Lịch hẹn"
                />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        </>
      )}
    </Container>
  );
};

export default Dashboard;
