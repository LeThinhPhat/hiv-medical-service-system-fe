import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { IconButton, Menu as MuiMenu, MenuItem } from "@mui/material";
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
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="text-3xl font-extrabold text-blue-600 hover:text-blue-800 transition-colors duration-300">
          <Link to="/">HIV Medical</Link>
        </div>

        <nav className="hidden md:flex items-center space-x-8 text-gray-600 text-base font-semibold">
          <Link
            to="/"
            className="hover:text-blue-600 hover:scale-105 transition-all duration-300"
          >
            Trang chủ
          </Link>
          <Link
            to="/about"
            className="hover:text-blue-600 hover:scale-105 transition-all duration-300"
          >
            Giới thiệu
          </Link>
          <Link
            to="/booking"
            className="hover:text-blue-600 hover:scale-105 transition-all duration-300"
          >
            Đặt lịch khám
          </Link>
          <Link
            to="/services"
            className="hover:text-blue-600 hover:scale-105 transition-all duration-300"
          >
            Các dịch vụ
          </Link>
          <Link
            to="/blogs"
            className="hover:text-blue-600 hover:scale-105 transition-all duration-300"
          >
            Blogs
          </Link>
        </nav>

        <div className="md:hidden">
          <button
            onClick={toggleMenu}
            className="text-blue-600 hover:text-blue-800 transition-colors duration-300"
          >
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        <div className="hidden md:flex items-center space-x-4">
          {token && (
            <div className="flex items-center space-x-2 text-sm font-semibold text-blue-600 bg-blue-100 px-3 py-1 rounded-full hover:bg-blue-200 transition-colors duration-300">
              <AccountBalanceWalletIcon
                fontSize="small"
                sx={{ color: "#60A5FA" }}
              />
              <span>{walletBalance.toLocaleString("vi-VN")} ₫</span>
            </div>
          )}

          {token && (
            <IconButton
              component={Link}
              to="/treatment-plan"
              className="hover:bg-blue-100 transition-colors duration-300"
            >
              <AssignmentIcon fontSize="large" sx={{ color: "#60A5FA" }} />
            </IconButton>
          )}

          {token && (
            <IconButton
              component={Link}
              to="/profile"
              className="hover:bg-blue-100 transition-colors duration-300"
            >
              <PersonSearchIcon fontSize="large" sx={{ color: "#60A5FA" }} />
            </IconButton>
          )}

          <IconButton
            onClick={handleProfileMenuOpen}
            className="hover:bg-blue-100 transition-colors duration-300"
          >
            <AccountCircleIcon fontSize="large" sx={{ color: "#60A5FA" }} />
          </IconButton>

          <MuiMenu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleProfileMenuClose}
            PaperProps={{
              sx: { mt: 1, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" },
            }}
          >
            {token ? (
              <MenuItem
                onClick={logout}
                className="hover:bg-blue-50 transition-colors duration-200"
              >
                Đăng xuất
              </MenuItem>
            ) : (
              <>
                <MenuItem onClick={handleProfileMenuClose}>
                  <Link
                    to="/signin"
                    className="w-full text-gray-700 hover:text-blue-600 transition-colors duration-200"
                  >
                    Đăng nhập
                  </Link>
                </MenuItem>
                <MenuItem onClick={handleProfileMenuClose}>
                  <Link
                    to="/register"
                    className="w-full text-gray-700 hover:text-blue-600 transition-colors duration-200"
                  >
                    Đăng ký
                  </Link>
                </MenuItem>
              </>
            )}
          </MuiMenu>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden px-4 pb-6 bg-gray-50">
          <nav className="flex flex-col space-y-3 text-gray-600 text-base font-semibold">
            <Link
              to="/"
              onClick={toggleMenu}
              className="hover:text-blue-600 hover:scale-105 transition-all duration-300 py-2"
            >
              Trang chủ
            </Link>
            <Link
              to="/about"
              onClick={toggleMenu}
              className="hover:text-blue-600 hover:scale-105 transition-all duration-300 py-2"
            >
              Giới thiệu
            </Link>
            <Link
              to="/booking"
              onClick={toggleMenu}
              className="hover:text-blue-600 hover:scale-105 transition-all duration-300 py-2"
            >
              Đặt lịch khám
            </Link>
            <Link
              to="/news"
              onClick={toggleMenu}
              className="hover:text-blue-600 hover:scale-105 transition-all duration-300 py-2"
            >
              Tin tức
            </Link>
            <Link
              to="/blogs"
              onClick={toggleMenu}
              className="hover:text-blue-600 hover:scale-105 transition-all duration-300 py-2"
            >
              Blogs
            </Link>
            <Link
              to="/test"
              onClick={toggleMenu}
              className="hover:text-blue-600 hover:scale-105 transition-all duration-300 py-2"
            >
              Test
            </Link>

            {token && (
              <Link to="/treatment-plan" onClick={toggleMenu}>
                <button className="w-full text-left px-4 py-2 text-blue-600 font-semibold hover:bg-blue-100 rounded-lg transition-colors duration-300">
                  Xem lộ trình điều trị
                </button>
              </Link>
            )}

            {token && (
              <div className="flex items-center space-x-2 text-sm font-semibold text-blue-600 bg-blue-100 px-4 py-2 rounded-lg">
                <AccountBalanceWalletIcon
                  fontSize="small"
                  sx={{ color: "#60A5FA" }}
                />
                <span>{walletBalance.toLocaleString("vi-VN")} ₫</span>
              </div>
            )}

            {token ? (
              <button
                onClick={() => {
                  logout();
                  toggleMenu();
                }}
                className="bg-red-500 w-full text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600 transition-colors duration-300 mt-4"
              >
                Đăng xuất
              </button>
            ) : (
              <>
                <Link to="/signin" onClick={toggleMenu}>
                  <button className="bg-blue-500 w-full text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-600 transition-colors duration-300 mt-4">
                    Đăng nhập
                  </button>
                </Link>
                <Link to="/register" onClick={toggleMenu}>
                  <button className="border border-blue-500 w-full text-blue-500 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors duration-300 mt-2">
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
