import React from "react";
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Typography,
  Divider,
} from "@mui/material";
import {
  Menu as MenuIcon,
  LocalHospital,
  Group,
  Event,
  AccountBalance,
  AccountBox,
  Apartment,
  MonetizationOn,
  Hotel,
  LocalShipping,
  PhotoLibrary,
  Newspaper,
  Widgets,
  People,
} from "@mui/icons-material";
import { NavLink } from "react-router-dom";

const sidebarItems = [
  { text: "Doctors", icon: <LocalHospital />, path: "/manager/doctors" },
  { text: "Patients", icon: <Group />, path: "/manager/patients" },
  { text: "Staff", icon: <People />, path: "/manager/staff" },
  { text: "Appointments", icon: <Event />, path: "/manager/appointments" },
  { text: "Departments", icon: <Apartment />, path: "/manager/departments" },
  { text: "Accounts", icon: <AccountBalance />, path: "/manager/accounts" },
  { text: "Human Resources", icon: <AccountBox />, path: "/manager/hr" },
  { text: "Salaries", icon: <MonetizationOn />, path: "/manager/salaries" },
  { text: "Rooms", icon: <Hotel />, path: "/manager/rooms" },
  { text: "Ambulance", icon: <LocalShipping />, path: "/manager/ambulance" },
  { text: "Event Management", icon: <Event />, path: "/manager/events" },
  { text: "Gallery", icon: <PhotoLibrary />, path: "/manager/gallery" },
  { text: "News & Updates", icon: <Newspaper />, path: "/manager/news" },
  { text: "UI Elements", icon: <Widgets />, path: "/manager/ui" },
];

const ManagerSidebar = () => {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 250,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: 250,
          boxSizing: "border-box",
          backgroundColor: "#fff",
          borderRight: "1px solid #e0e0e0",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          bgcolor: "#1976d2",
          color: "#fff",
          height: 64,
          px: 2,
        }}
      >
        <MenuIcon sx={{ mr: 1 }} />
        <Typography variant="h6" noWrap>
          Medflex
        </Typography>
      </Box>

      <Box sx={{ p: 2, display: "flex", alignItems: "center" }}>
        <Avatar
          alt="Nick Gonzalez"
          src="https://randomuser.me/api/portraits/men/75.jpg"
          sx={{ width: 48, height: 48, mr: 2 }}
        />
        <Box>
          <Typography fontWeight="bold">Nick Gonzalez</Typography>
          <Typography variant="body2" color="textSecondary">
            Dept Admin
          </Typography>
        </Box>
      </Box>

      <Divider />

      <List>
        {sidebarItems.map((item) => (
          <NavLink
            key={item.text}
            to={item.path}
            style={({ isActive }) => ({
              textDecoration: "none",
              color: isActive ? "#1976d2" : "#333",
              backgroundColor: isActive ? "#e3f2fd" : "transparent",
            })}
          >
            <ListItemButton>
              <ListItemIcon
                sx={{ color: (isActive) => (isActive ? "#1976d2" : "#555") }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </NavLink>
        ))}
      </List>
    </Drawer>
  );
};

export default ManagerSidebar;
