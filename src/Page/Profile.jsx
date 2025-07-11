import React, { useEffect, useState } from "react";
import {
  Box,
  CardHeader,
  Avatar,
  Typography,
  Grid,
  Divider,
  Button,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Chip,
  Container,
  Paper,
  ListItemSecondaryAction,
  TextField,
  Card,
  CardContent,
  Fade,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import PaymentIcon from "@mui/icons-material/Payment";
import PersonIcon from "@mui/icons-material/Person";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import BadgeIcon from "@mui/icons-material/Badge";
import WcIcon from "@mui/icons-material/Wc";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import appointmentService from "../Services/CusService/AppointmentService";
import { useNavigate } from "react-router-dom";
import medicalRecordService from "../Services/DoctorService/medicalRecordService";

function formatDate(dateStr) {
  if (!dateStr) return "Không xác định";
  const date = new Date(dateStr);
  return `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()}`;
}

function formatTime(isoString) {
  const date = new Date(isoString);
  const adjustedDate = new Date(date.getTime() - 7 * 60 * 60 * 1000);
  return adjustedDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
}

const Profile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState([]);
  const [loadingAppointments, setLoadingAppointments] = useState(true);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [loadingMedicalRecords, setLoadingMedicalRecords] = useState(true);

  const user = JSON.parse(localStorage.getItem("user")) || {};
  const patient = JSON.parse(localStorage.getItem("patient")) || {};

  const [editMode, setEditMode] = useState(false);
  const [formValues, setFormValues] = useState({
    name: user.name || "",
    email: user.email || "",
    gender: user.gender || "",
    address: user.address || "",
    contactPhones: patient.contactPhones || "",
    personalID: patient.personalID || "",
  });

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const data = await appointmentService.getAppointmentByToken();
        setAppointments(data?.data || []);
      } catch (error) {
        console.error("Lỗi lấy lịch hẹn:", error);
      } finally {
        setLoadingAppointments(false);
      }
    };

    const fetchMedicalRecords = async () => {
      try {
        const data = await medicalRecordService.getMedicalRecordByPersonalID(patient.personalID);
        console.log("Medical Records:", data);
        setMedicalRecords(data ? [data] : []);
      } catch (error) {
        console.error("Lỗi lấy hồ sơ bệnh án:", error);
      } finally {
        setLoadingMedicalRecords(false);
      }
    };

    fetchAppointments();
    fetchMedicalRecords();
    setTimeout(() => setLoading(false), 600);
  }, []);

  const handleChange = (field) => (e) => {
    setFormValues((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSave = () => {
    const updatedUser = {
      ...user,
      name: formValues.name,
      email: formValues.email,
      gender: formValues.gender,
      address: formValues.address,
    };

    const updatedPatient = {
      ...patient,
      contactPhones: formValues.contactPhones,
      personalID: formValues.personalID,
    };

    localStorage.setItem("user", JSON.stringify(updatedUser));
    localStorage.setItem("patient", JSON.stringify(updatedPatient));
    setEditMode(false);
    window.location.reload();
  };

  const handlePayment = (appointment) => {
    navigate("/booking-payment", {
      state: {
        appointment,
      },
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Chờ thanh toán":
        return { color: "warning", bgcolor: "#fff8e1", textColor: "#ed6c02", borderColor: "#ed6c02" };
      case "Thanh toán thất bại":
        return { color: "error", bgcolor: "#ffebee", textColor: "#d32f2f", borderColor: "#d32f2f" };
      case "Đang xét duyệt":
        return { color: "default", bgcolor: "#f5f5f5", textColor: "#616161", borderColor: "#616161" };
      case "Hoàn tất đặt lịch":
        return { color: "success", bgcolor: "#e8f5e8", textColor: "#2e7d32", borderColor: "#2e7d32" };
      case "Hủy bởi người khách hàng":
        return { color: "error", bgcolor: "#ffcccb", textColor: "#b71c1c", borderColor: "#b71c1c" };
      case "Hủy bởi nhân viên":
        return { color: "error", bgcolor: "#ffcdd2", textColor: "#c62828", borderColor: "#c62828" };
      case "Đã hủy & hoàn tiền bởi nhân viên":
        return { color: "info", bgcolor: "#e0f7fa", textColor: "#0277bd", borderColor: "#0277bd" };
      case "Hoàn tất quá trình khám":
        return { color: "success", bgcolor: "#c8e6c9", textColor: "#1b5e20", borderColor: "#1b5e20" };
      default:
        return { color: "default", bgcolor: "#f5f5f5", textColor: "#616161", borderColor: "#616161" };
    }
  };

  console.log("Appointments:", appointments);

  if (loading) {
    return (
      <Box 
        sx={{ 
          p: 4, 
          minHeight: "100vh", 
          display: "flex", 
          justifyContent: "center", 
          alignItems: "center",
          bgcolor: "#f8fafc"
        }}
      >
        <Box sx={{ textAlign: "center" }}>
          <CircularProgress size={50} sx={{ color: "#0277bd", mb: 2 }} />
          <Typography variant="h6" color="text.secondary">Đang tải thông tin bệnh nhân...</Typography>
        </Box>
      </Box>
    );
  }

  if (!user) {
    return (
      <Box sx={{ p: 4, minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Typography color="error">Không có dữ liệu người dùng</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      bgcolor: "#f8fafc", 
      minHeight: "100vh", 
      py: 3 
    }}>
      <Container maxWidth="lg">
        {/* Header với logo bệnh viện */}
        <Box sx={{ mb: 3, textAlign: "center" }}>
          <Typography variant="h4" sx={{ color: "#0277bd", fontWeight: 600, mb: 1 }}>
            HỒ SƠ BỆNH NHÂN
          </Typography>
        </Box>

        {/* Thông tin cá nhân */}
        <Fade in={true} timeout={800}>
          <Paper 
            elevation={2} 
            sx={{ 
              p: 4, 
              borderRadius: 2, 
              bgcolor: "white",
              border: "1px solid #e3f2fd",
              mb: 3
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <MedicalServicesIcon sx={{ color: "#0277bd", mr: 2, fontSize: 28 }} />
              <Typography variant="h5" sx={{ color: "#0277bd", fontWeight: 600 }}>
                Thông tin bệnh nhân
              </Typography>
            </Box>

            <CardHeader
              avatar={
                <Avatar 
                  src={user.avatarURL} 
                  sx={{ 
                    width: 80, 
                    height: 80, 
                    border: "3px solid #0277bd",
                    bgcolor: "#e3f2fd"
                  }} 
                >
                  <PersonIcon sx={{ fontSize: 40, color: "#0277bd" }} />
                </Avatar>
              }
              title={
                editMode ? (
                  <TextField 
                    variant="outlined" 
                    fullWidth 
                    value={formValues.name} 
                    onChange={handleChange("name")} 
                    label="Họ và tên"
                    sx={{ 
                      maxWidth: 400,
                      "& .MuiOutlinedInput-root": {
                        "&.Mui-focused fieldset": {
                          borderColor: "#0277bd",
                        }
                      }
                    }}
                  />
                ) : (
                  <Typography variant="h5" sx={{ color: "#0277bd", fontWeight: 600 }}>
                    {user.name || "Chưa có tên"}
                  </Typography>
                )
              }
              subheader={
                editMode ? (
                  <TextField 
                    variant="outlined" 
                    fullWidth 
                    value={formValues.email} 
                    onChange={handleChange("email")} 
                    label="Email"
                    sx={{ 
                      maxWidth: 400,
                      mt: 2,
                      "& .MuiOutlinedInput-root": {
                        "&.Mui-focused fieldset": {
                          borderColor: "#0277bd",
                        }
                      }
                    }}
                  />
                ) : (
                  <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                    {user.email}
                  </Typography>
                )
              }
              action={
                editMode ? (
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Button 
                      variant="contained" 
                      startIcon={<SaveIcon />}
                      onClick={handleSave} 
                      sx={{ 
                        bgcolor: "#0277bd",
                        "&:hover": { bgcolor: "#01579b" }
                      }}
                    >
                      Lưu
                    </Button>
                    <Button 
                      variant="outlined" 
                      startIcon={<CancelIcon />}
                      onClick={() => setEditMode(false)}
                      sx={{ 
                        borderColor: "#616161",
                        color: "#616161",
                        "&:hover": { 
                          borderColor: "#424242",
                          color: "#424242"
                        }
                      }}
                    >
                      Hủy
                    </Button>
                  </Box>
                ) : (
                  <Button 
                    variant="outlined" 
                    startIcon={<EditIcon />} 
                    onClick={() => setEditMode(true)} 
                    sx={{ 
                      borderColor: "#0277bd",
                      color: "#0277bd",
                      "&:hover": { 
                        borderColor: "#01579b",
                        color: "#01579b",
                        bgcolor: "#f3f8ff"
                      }
                    }}
                  >
                    Chỉnh sửa
                  </Button>
                )
              }
            />
            
            <Divider sx={{ my: 3, borderColor: "#e0e0e0" }} />
            
            <Grid container spacing={3}>
              {[
                { 
                  label: "Số điện thoại", 
                  value: formValues.contactPhones, 
                  key: "contactPhones", 
                  icon: <PhoneIcon sx={{ color: "#0277bd" }} /> 
                },
                { 
                  label: "Giới tính", 
                  value: formValues.gender, 
                  key: "gender", 
                  icon: <WcIcon sx={{ color: "#0277bd" }} /> 
                },
                { 
                  label: "Địa chỉ", 
                  value: formValues.address, 
                  key: "address", 
                  icon: <LocationOnIcon sx={{ color: "#0277bd" }} /> 
                },
                { 
                  label: "Số CCCD", 
                  value: formValues.personalID, 
                  key: "personalID", 
                  icon: <BadgeIcon sx={{ color: "#0277bd" }} /> 
                },
              ].map((item, idx) => (
                <Grid key={idx} item xs={12} sm={6} md={3}>
                  <Box 
                    sx={{ 
                      p: 2,
                      bgcolor: "#fafafa",
                      borderRadius: 1,
                      border: "1px solid #e0e0e0",
                      height: "100%"
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      {item.icon}
                      <Typography 
                        variant="subtitle2" 
                        color="text.secondary" 
                        fontWeight="600"
                        sx={{ ml: 1 }}
                      >
                        {item.label}
                      </Typography>
                    </Box>
                    {editMode ? (
                      item.key === "gender" ? (
                        <TextField 
                          select 
                          fullWidth 
                          size="small" 
                          value={item.value} 
                          onChange={handleChange(item.key)} 
                          SelectProps={{ native: true }}
                          sx={{ 
                            "& .MuiOutlinedInput-root": {
                              "&.Mui-focused fieldset": {
                                borderColor: "#0277bd",
                              }
                            }
                          }}
                        >
                          <option value="">Chọn giới tính</option>
                          <option value="Nam">Nam</option>
                          <option value="Nữ">Nữ</option>
                        </TextField>
                      ) : (
                        <TextField 
                          variant="outlined" 
                          fullWidth 
                          size="small" 
                          value={item.value} 
                          onChange={handleChange(item.key)} 
                          sx={{ 
                            "& .MuiOutlinedInput-root": {
                              "&.Mui-focused fieldset": {
                                borderColor: "#0277bd",
                              }
                            }
                          }}
                        />
                      )
                    ) : (
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          color: item.value ? "#212121" : "#9e9e9e",
                          fontWeight: item.value ? "500" : "400"
                        }}
                      >
                        {item.value || "Chưa cập nhật"}
                      </Typography>
                    )}
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Fade>

        {/* Lịch khám */}
        <Paper 
          elevation={2} 
          sx={{ 
            p: 4, 
            borderRadius: 2, 
            bgcolor: "white",
            border: "1px solid #e3f2fd",
            mb: 3
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
            <CalendarTodayIcon sx={{ color: "#0277bd", mr: 2, fontSize: 28 }} />
            <Typography variant="h5" sx={{ color: "#0277bd", fontWeight: 600 }}>
              Lịch khám bệnh
            </Typography>
          </Box>
          
          {loadingAppointments ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress size={32} sx={{ color: "#0277bd" }} />
            </Box>
          ) : appointments.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 4, color: "text.secondary" }}>
              <CalendarTodayIcon sx={{ fontSize: 48, color: "#bdbdbd", mb: 2 }} />
              <Typography variant="h6">Chưa có lịch khám</Typography>
              <Typography variant="body2">
                Hiện tại chưa có lịch khám nào được đặt.
              </Typography>
            </Box>
          ) : (
            <List disablePadding>
              {appointments.map((ap, idx) => {
                const statusInfo = getStatusColor(ap.status);
                return (
                  <ListItem 
                    key={ap._id || idx} 
                    sx={{ 
                      py: 2, 
                      px: 3,
                      mb: 2,
                      bgcolor: "#fafafa",
                      borderRadius: 1,
                      border: "1px solid #e0e0e0",
                      "&:hover": { 
                        bgcolor: "#f5f5f5"
                      },
                      position: "relative",
                      alignItems: "flex-start"
                    }}
                  >
                    <ListItemText
                      primary={
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
                          <Typography variant="subtitle1" fontWeight="600" color="#212121">
                            {ap.serviceID?.name || "Không xác định"}
                          </Typography>
                          <Chip 
                            label={ap.status || "Đang xử lý"} 
                            size="small"
                            sx={{ 
                              bgcolor: statusInfo.bgcolor,
                              color: statusInfo.textColor,
                              border: `1px solid ${statusInfo.borderColor}`,
                              fontWeight: "500"
                            }} 
                          />
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                            <strong>Bác sĩ:</strong> {ap.doctorID?.userID?.name || "Chưa chỉ định"}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            <strong>Thời gian:</strong> {formatDate(ap.startTime)} - {formatTime(ap.startTime)}
                          </Typography>
                        </Box>
                      }
                    />
                    <ListItemSecondaryAction sx={{ top: 16, transform: "none" }}>
                      {ap.status === "Chờ thanh toán" ? (
                        <Button 
                          variant="contained" 
                          startIcon={<PaymentIcon />} 
                          onClick={() => handlePayment(ap)} 
                          sx={{ 
                            bgcolor: "#0277bd",
                            "&:hover": { bgcolor: "#01579b" },
                            borderRadius: 2,
                            textTransform: "none",
                            fontWeight: 500
                          }}
                        >
                          Thanh toán
                        </Button>
                      ) : ap.status !== "Thanh toán thất bại" ? (
                        <Chip
                          label="Đã thanh toán"
                          size="small"
                          sx={{
                            bgcolor: "#e8f5e8",
                            color: "#2e7d32",
                            border: "1px solid #2e7d32",
                            fontWeight: "500",
                            borderRadius: 2,
                          }}
                        />
                      ) : null}
                    </ListItemSecondaryAction>
                  </ListItem>
                );
              })}
            </List>
          )}
        </Paper>

        {/* Hồ sơ bệnh án */}
        <Paper 
          elevation={2} 
          sx={{ 
            p: 4, 
            borderRadius: 2, 
            bgcolor: "white",
            border: "1px solid #e3f2fd"
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
            <MedicalServicesIcon sx={{ color: "#0277bd", mr: 2, fontSize: 28 }} />
            <Typography variant="h5" sx={{ color: "#0277bd", fontWeight: 600 }}>
              Hồ sơ bệnh án
            </Typography>
          </Box>
          
          {loadingMedicalRecords ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress size={32} sx={{ color: "#0277bd" }} />
            </Box>
          ) : medicalRecords.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 4, color: "text.secondary" }}>
              <MedicalServicesIcon sx={{ fontSize: 48, color: "#bdbdbd", mb: 2 }} />
              <Typography variant="h6">Chưa có hồ sơ bệnh án</Typography>
              <Typography variant="body2">
                Hồ sơ bệnh án sẽ được tạo sau khi hoàn thành khám bệnh.
              </Typography>
            </Box>
          ) : (
            <List disablePadding>
              {medicalRecords.map((record, idx) => (
                <ListItem
                  key={idx}
                  sx={{
                    py: 2,
                    px: 3,
                    mb: 2,
                    bgcolor: "#fafafa",
                    borderRadius: 1,
                    border: "1px solid #e0e0e0",
                    "&:hover": { 
                      bgcolor: "#f5f5f5"
                    }
                  }}
                >
                  <ListItemText
                    primary={
                      <Typography variant="subtitle1" fontWeight="600" color="#212121" sx={{ mb: 1 }}>
                        <strong>Chẩn đoán:</strong> {record.diagnosis || "Không rõ"}
                      </Typography>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                          <strong>Triệu chứng:</strong> {record.symptoms || "Không có mô tả"}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          <strong>Ghi chú:</strong> {record.clinicalNotes || "Không có"}
                        </Typography>
                      </Box>
                    }
                  />
                  <ListItemSecondaryAction>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => alert(`Chi tiết hồ sơ:\n${record.diagnosis}`)}
                      sx={{
                        borderColor: "#0277bd",
                        color: "#0277bd",
                        "&:hover": {
                          borderColor: "#01579b",
                          color: "#01579b",
                          bgcolor: "#f3f8ff"
                        }
                      }}
                    >
                      Chi tiết
                    </Button>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default Profile;
