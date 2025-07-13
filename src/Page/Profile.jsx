import React, { useEffect, useState } from "react";
import { Box, Container, Typography, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import PatientInfo from "./PatientInfo";
import { AppointmentsSection } from "./AppointmentsAndRecords";
import MedicalRecordsSection from "./MedicalRecordsSection";
import appointmentService from "../Services/CusService/AppointmentService";
import medicalRecordService from "../Services/DoctorService/medicalRecordService";

// Utility functions
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
  const [walletBalance, setWalletBalance] = useState(0);

  const user = JSON.parse(localStorage.getItem("user")) || {};
  const patient = JSON.parse(localStorage.getItem("patient")) || {};
  const wallet = patient.wallet || { balance: 0 };

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

    setWalletBalance(wallet);
    setTimeout(() => setLoading(false), 600);

    fetchAppointments();
    fetchMedicalRecords();
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
        <Box sx={{ mb: 3, textAlign: "center" }}>
          <Typography variant="h4" sx={{ color: "#0277bd", fontWeight: 600, mb: 1 }}>
            HỒ SƠ BỆNH NHÂN
          </Typography>
        </Box>

        <PatientInfo 
          user={user}
          patient={patient}
          walletBalance={walletBalance}
          editMode={editMode}
          setEditMode={setEditMode}
          formValues={formValues}
          handleChange={handleChange}
          handleSave={handleSave}
        />

        <AppointmentsSection 
          appointments={appointments}
          loadingAppointments={loadingAppointments}
          handlePayment={handlePayment}
          formatDate={formatDate}
          formatTime={formatTime}
        />

        <MedicalRecordsSection 
          medicalRecords={medicalRecords}
          loadingMedicalRecords={loadingMedicalRecords}
        />
      </Container>
    </Box>
  );
};

export default Profile;