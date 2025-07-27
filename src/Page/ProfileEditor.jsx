import React, { useState } from "react";
import {
  Box,
  CardHeader,
  Avatar,
  Typography,
  Grid,
  Divider,
  Button,
  TextField,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import BadgeIcon from "@mui/icons-material/Badge";
import WcIcon from "@mui/icons-material/Wc";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import UploadImage from "../Services/UploadImage";

export const PatientInfoField = ({ label, value, icon, editMode, fieldKey, handleChange, editable = true, onClick }) => (
  <Grid item xs={12} sm={6} md={3}>
    <Box 
      sx={{ 
        p: 2,
        bgcolor: "#fafafa",
        borderRadius: 1,
        border: "1px solid #e0e0e0",
        height: "100%",
        cursor: fieldKey === "walletBalance" && !editMode ? "pointer" : "default",
      }}
      onClick={fieldKey === "walletBalance" && !editMode ? onClick : undefined}
    >
      <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
        {icon}
        <Typography 
          variant="subtitle2" 
          color="text.secondary" 
          fontWeight="600"
          sx={{ ml: 1 }}
        >
          {label}
        </Typography>
      </Box>
      {editMode && editable ? (
        fieldKey === "gender" ? (
          <TextField 
            select 
            fullWidth 
            size="small" 
            value={value} 
            onChange={handleChange(fieldKey)} 
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
            value={value} 
            onChange={handleChange(fieldKey)} 
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
            color: value ? "#212121" : "#9e9e9e",
            fontWeight: value ? "500" : "400"
          }}
        >
          {value || "Chưa cập nhật"}
        </Typography>
      )}
    </Box>
  </Grid>
);

const ProfileEditor = ({ user, editMode, setEditMode, formValues, handleChange, handleSave, currentBalance, setOpenWalletOptionsDialog, handleOpenPasswordDialog }) => {
  const [avatarUrl, setAvatarUrl] = useState(user.avatarURL || "");

  const handleImageUploadSuccess = (url) => {
    setAvatarUrl(url);
    handleChange("avatarURL")({ target: { value: url } });
  };

  return (
    <>
      <CardHeader
        avatar={
          <Avatar 
            src={editMode ? avatarUrl : user.avatarURL} 
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
          <Box sx={{ display: "flex", gap: 1 }}>
            {editMode ? (
              <>
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
              </>
            ) : (
              <>
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
                <Button 
                  variant="outlined" 
                  onClick={handleOpenPasswordDialog}
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
                  Đổi mật khẩu
                </Button>
              </>
            )}
          </Box>
        }
      />
      
      {editMode && (
        <Box sx={{ mt: 2 }}>
          <UploadImage onUploadSuccess={handleImageUploadSuccess} />
        </Box>
      )}
      
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
          { 
            label: "Số dư ví", 
            value: currentBalance.toLocaleString("vi-VN") + " VNĐ", 
            key: "walletBalance", 
            icon: <AccountBalanceWalletIcon sx={{ color: "#0277bd" }} />,
            editable: false
          },
        ].map((item, idx) => (
          <PatientInfoField
            key={idx}
            label={item.label}
            value={item.value}
            icon={item.icon}
            editMode={editMode}
            fieldKey={item.key}
            handleChange={handleChange}
            editable={item.editable}
            onClick={item.key === "walletBalance" ? () => setOpenWalletOptionsDialog(true) : undefined}
          />
        ))}
      </Grid>
    </>
  );
};

export default ProfileEditor;