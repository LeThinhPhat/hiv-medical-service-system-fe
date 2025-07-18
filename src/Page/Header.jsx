import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import {
  IconButton,
  Menu as MuiMenu,
  MenuItem
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import AssignmentIcon from "@mui/icons-material/Assignment";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const patient = JSON.parse(localStorage.getItem("patient")) || {};
  const walletBalance = patient.wallet || 0;

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("patient");
    localStorage.removeItem("treatmentIDs");
    setAnchorEl(null);
    navigate("/signin");
  };

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const handleProfileMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleProfileMenuClose = () => setAnchorEl(null);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-blue-700">
          <Link to="/">GoldenAge</Link>
        </div>

        <nav className="hidden md:flex space-x-6 text-gray-700 text-sm font-medium">
          <Link to="/" className="hover:text-blue-700 transition">Trang chủ</Link>
          <Link to="/about" className="hover:text-blue-700 transition">Giới thiệu</Link>
          <Link to="/booking" className="hover:text-blue-700 transition">Đặt lịch khám</Link>
          <Link to="/services" className="hover:text-blue-700 transition">Các dịch vụ</Link>
          <Link to="/blogs" className="hover:text-blue-700 transition">Blogs</Link>
        </nav>

        <div className="md:hidden">
          <button onClick={toggleMenu} className="text-blue-700">
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <div className="hidden md:flex items-center space-x-3">
          {token && (
            <div className="flex items-center space-x-1 text-sm font-medium text-blue-600">
              <AccountBalanceWalletIcon fontSize="small" sx={{ color: "#3B82F6" }} />
              <span>{walletBalance.toLocaleString("vi-VN")} ₫</span>
            </div>
          )}

          {token && (
            <IconButton component={Link} to="/treatment-plan">
              <AssignmentIcon fontSize="large" sx={{ color: "#3B82F6" }} />
            </IconButton>
          )}

          {token && (
            <IconButton component={Link} to="/profile">
              <PersonSearchIcon fontSize="large" sx={{ color: "#3B82F6" }} />
            </IconButton>
          )}

          <IconButton onClick={handleProfileMenuOpen}>
            <AccountCircleIcon fontSize="large" sx={{ color: "#3B82F6" }} />
          </IconButton>

          <MuiMenu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleProfileMenuClose}
          >
            {token ? (
              <MenuItem onClick={logout}>Đăng xuất</MenuItem>
            ) : (
              <>
                <MenuItem onClick={handleProfileMenuClose}>
                  <Link to="/signin">Đăng nhập</Link>
                </MenuItem>
                <MenuItem onClick={handleProfileMenuClose}>
                  <Link to="/register">Đăng ký</Link>
                </MenuItem>
              </>
            )}
          </MuiMenu>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden px-4 pb-4">
          <nav className="flex flex-col space-y-2 text-gray-700 text-sm font-medium">
            <Link to="/" onClick={toggleMenu} className="hover:text-yellow-700">Trang chủ</Link>
            <Link to="/about" onClick={toggleMenu} className="hover:text-yellow-700">Giới thiệu</Link>
            <Link to="/booking" onClick={toggleMenu} className="hover:text-yellow-700">Đặt lịch khám</Link>
            <Link to="/news" onClick={toggleMenu} className="hover:text-yellow-700">Tin tức</Link>
            <Link to="/blogs" onClick={toggleMenu} className="hover:text-yellow-700">Blogs</Link>
            <Link to="/test" onClick={toggleMenu} className="hover:text-yellow-700">Test</Link>

            {token && (
              <Link to="/treatment-plan" onClick={toggleMenu}>
                <button className="w-full text-left px-4 py-2 text-blue-600 hover:underline">
                  Xem lộ trình điều trị
                </button>
              </Link>
            )}

            {token && (
              <div className="flex items-center space-x-1 mt-2 text-sm font-medium text-blue-600">
                <AccountBalanceWalletIcon fontSize="small" sx={{ color: "#3B82F6" }} />
                <span>{walletBalance.toLocaleString("vi-VN")} ₫</span>
              </div>
            )}

            {token ? (
              <button
                onClick={() => {
                  logout();
                  toggleMenu();
                }}
                className="bg-red-500 w-full text-white px-4 py-2 rounded mt-2"
              >
                Đăng xuất
              </button>
            ) : (
              <>
                <Link to="/signin" onClick={toggleMenu}>
                  <button className="bg-yellow-500 w-full text-white px-4 py-2 rounded mt-2">
                    Đăng nhập
                  </button>
                </Link>
                <Link to="/register" onClick={toggleMenu}>
                  <button className="border border-yellow-500 w-full text-yellow-500 px-4 py-2 rounded mt-1">
                    Đăng ký
                  </button>
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
