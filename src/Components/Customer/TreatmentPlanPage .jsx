import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Alert,
  CircularProgress,
} from "@mui/material";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

const TreatmentPlanPage = () => {
  const [patientInfo, setPatientInfo] = useState(null);
    const [loading, setLoading] = useState(true);
   const user = JSON.parse(localStorage.getItem("user")) || null;
  useEffect(() => {
    const fetchPatientInfo = async () => {
      try {
        // 👇 Gọi API bằng ID hoặc từ token
        const response = localStorage.getItem("user");
       
        setPatientInfo(response);
        console.log("Thông tin bệnh nhân:", response);
      } catch (error) {
        console.error("Lỗi tải hồ sơ bệnh nhân:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPatientInfo();
  }, []);

  const treatmentPhases = [
    {
      phase: "Giai đoạn 1: Khám & Tư vấn ban đầu",
      duration: "Tuần 1",
      details: {
        goal: "Chẩn đoán chính xác tình trạng nhiễm HIV và chuẩn bị tâm lý điều trị lâu dài.",
        actions: [
          "Xét nghiệm khẳng định HIV.",
          "Đo tải lượng virus (HIV Viral Load) và CD4.",
          "Tư vấn tâm lý cá nhân hoặc nhóm.",
        ],
        notes: ["Cần điều trị nhiễm trùng cơ hội nếu phát hiện."],
      },
    },
    {
      phase: "Giai đoạn 2: Khởi đầu điều trị ARV",
      duration: "Tuần 2 - Tuần 4",
      details: {
        goal: "Bắt đầu dùng thuốc ARV để ức chế virus HIV.",
        actions: [
          "Chỉ định phác đồ ARV gồm 3 loại thuốc (2 NRTI + 1 NNRTI/PI).",
          "Hướng dẫn cách uống thuốc đúng giờ và theo dõi phản ứng.",
        ],
        notes: ["Không được bỏ liều, cần có người hỗ trợ nhắc thuốc nếu cần."],
      },
    },
    {
      phase: "Giai đoạn 3: Theo dõi & Điều chỉnh",
      duration: "Tháng 2 - Tháng 6",
      details: {
        goal: "Theo dõi hiệu quả điều trị, xử lý tác dụng phụ và điều chỉnh phác đồ nếu cần.",
        actions: [
          "Tái khám định kỳ hàng tháng.",
          "Xét nghiệm lại tải lượng virus, CD4.",
          "Đánh giá tác dụng phụ của thuốc.",
        ],
        notes: ["Thông báo ngay nếu có dấu hiệu bất thường như nổi mẩn, sốt, tiêu chảy,..."],
      },
    },
    {
      phase: "Giai đoạn 4: Ổn định lâu dài",
      duration: "Từ tháng 6 trở đi",
      details: {
        goal: "Duy trì điều trị ổn định, ngăn ngừa lây nhiễm và nâng cao chất lượng cuộc sống.",
        actions: [
          "Tiếp tục dùng ARV đều đặn.",
          "Tái khám mỗi 3-6 tháng.",
          "Tham gia hỗ trợ tâm lý, dinh dưỡng, phòng ngừa lây nhiễm.",
        ],
        notes: ["Khuyến khích tham gia nhóm cộng đồng hoặc chương trình hỗ trợ lâu dài."],
      },
    },
  ];

  const importantNotes = [
    "Không được tự ý ngưng thuốc hoặc đổi thuốc khi chưa có chỉ định.",
    "Uống thuốc đúng giờ mỗi ngày để tránh kháng thuốc.",
    "Thường xuyên tái khám để theo dõi tiến triển.",
    "Tham gia các chương trình hỗ trợ tâm lý và cộng đồng nếu cần.",
  ];

  if (loading) {
    return (
      <Box sx={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return (
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Alert severity="error">Không thể tải thông tin cá nhân. Vui lòng thử lại sau.</Alert>
      </Container>
    );
  }

  return (
    <Box sx={{ bgcolor: "#f9fafb", minHeight: "100vh", py: 6 }}>
      <Container maxWidth="md">
        <Typography variant="h5" color="text.primary" sx={{ mb: 1 }}>
          Xin chào, <strong>{user.name}</strong>!
        </Typography>
        <Typography variant="h3" fontWeight={700} color="primary.main" sx={{ mb: 2 }}>
          Lộ Trình Điều Trị HIV Cá Nhân Hóa
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Dưới đây là lộ trình được điều chỉnh theo hồ sơ sức khỏe của bạn.
        </Typography>

        {treatmentPhases.map((phase, index) => (
          <Paper
            key={index}
            elevation={2}
            sx={{
              p: 3,
              mb: 4,
              borderLeft: "6px solid #1976d2",
              borderRadius: 2,
              backgroundColor: "#ffffff",
            }}
          >
            <Box display="flex" alignItems="center" mb={1}>
              <MedicalServicesIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6" fontWeight={600}>
                {phase.phase}
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" fontStyle="italic">
              {phase.duration}
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle1" fontWeight={600}>🎯 Mục tiêu:</Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>{phase.details.goal}</Typography>

            <Typography variant="subtitle1" fontWeight={600}>✅ Hoạt động chính:</Typography>
            <List dense sx={{ mb: 2 }}>
              {phase.details.actions.map((action, idx) => (
                <ListItem key={idx}>
                  <ListItemIcon><CheckCircleOutlineIcon color="success" /></ListItemIcon>
                  <ListItemText primary={action} />
                </ListItem>
              ))}
            </List>

            <Typography variant="subtitle1" fontWeight={600}>⚠️ Lưu ý:</Typography>
            <List dense>
              {phase.details.notes.map((note, idx) => (
                <ListItem key={idx}>
                  <ListItemIcon><InfoOutlinedIcon color="warning" /></ListItemIcon>
                  <ListItemText primary={note} />
                </ListItem>
              ))}
            </List>
          </Paper>
        ))}

        <Alert
          icon={<InfoOutlinedIcon />}
          severity="warning"
          sx={{ backgroundColor: "#fff8e1", border: "1px solid #ffecb3", borderRadius: 2, mt: 3 }}
        >
          <Typography variant="subtitle1" fontWeight={600} color="warning.main">
            Lưu ý chung:
          </Typography>
          <List dense>
            {importantNotes.map((note, idx) => (
              <ListItem key={idx} sx={{ pl: 0 }}>
                <ListItemText primary={`• ${note}`} />
              </ListItem>
            ))}
          </List>
        </Alert>

        {/* 👇 Cá nhân hóa theo hồ sơ */}
        {patientInfo.stage === "early" && (
          <Alert severity="info" sx={{ mt: 3 }}>
            Bạn đang trong giai đoạn đầu điều trị – hãy tuyệt đối tuân thủ phác đồ trong 6 tháng đầu.
          </Alert>
        )}

        {patientInfo.hasCoInfections && (
          <Alert severity="warning" sx={{ mt: 2 }}>
            Bạn có bệnh lý đi kèm – nên kiểm tra chức năng gan, thận định kỳ và báo ngay khi có triệu chứng bất thường.
          </Alert>
        )}

        {patientInfo.adherence === "poor" && (
          <Alert severity="error" sx={{ mt: 2 }}>
            Hệ thống ghi nhận bạn từng bỏ liều thuốc. Vui lòng đặt báo thức và nhờ người thân hỗ trợ nhắc nhở mỗi ngày.
          </Alert>
        )}
      </Container>
    </Box>
  );
};

export default TreatmentPlanPage;
