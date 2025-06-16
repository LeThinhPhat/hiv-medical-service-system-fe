import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { AuthContext } from "../Services/AuthContext"; // Điều chỉnh đường dẫn nếu cần
import { IconButton, Menu as MuiMenu, MenuItem } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { token, logout } = useContext(AuthContext);
  const [anchorEl, setAnchorEl] = useState(null);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const handleProfileMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleProfileMenuClose = () => setAnchorEl(null);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="text-2xl font-bold text-yellow-700">
          <Link to="/">GoldenAge</Link>
        </div>

        {/* Desktop Menu */}
        <nav className="hidden md:flex space-x-6 text-gray-700 text-sm font-medium">
          <Link to="/" className="hover:text-yellow-700 transition">
            Trang chủ
          </Link>
          <Link to="/about" className="hover:text-yellow-700 transition">
            Giới thiệu
          </Link>
          <Link to="/booking" className="hover:text-yellow-700 transition">
            Đặt lịch khám
          </Link>
          <Link to="/docs" className="hover:text-yellow-700 transition">
            Đội ngũ bác sĩ
          </Link>
          <Link to="/blogs" className="hover:text-yellow-700 transition">
            Blogs
          </Link>
          <Link to="/test" className="hover:text-yellow-700 transition">
            Test
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={toggleMenu} className="text-yellow-700">
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Profile Icons */}
        <div className="hidden md:flex space-x-2">
          {/* Xem Profile */}
          <IconButton component={Link} to="/profile">
            <PersonSearchIcon fontSize="large" sx={{ color: "#F59E0B" }} />
          </IconButton>

          {/* Menu tài khoản */}
          <IconButton onClick={handleProfileMenuOpen}>
            <AccountCircleIcon fontSize="large" sx={{ color: "#F59E0B" }} />
          </IconButton>

          {/* Dropdown Menu */}
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

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden px-4 pb-4">
          <nav className="flex flex-col space-y-2 text-gray-700 text-sm font-medium">
            <Link to="/" onClick={toggleMenu} className="hover:text-yellow-700">
              Trang chủ
            </Link>
            <Link
              to="/about"
              onClick={toggleMenu}
              className="hover:text-yellow-700"
            >
              Giới thiệu
            </Link>
            <Link
              to="/booking"
              onClick={toggleMenu}
              className="hover:text-yellow-700"
            >
              Đặt lịch khám
            </Link>
            <Link
              to="/news"
              onClick={toggleMenu}
              className="hover:text-yellow-700"
            >
              Tin tức
            </Link>
            <Link
              to="/blogs"
              onClick={toggleMenu}
              className="hover:text-yellow-700"
            >
              Blogs
            </Link>
            <Link
              to="/test"
              onClick={toggleMenu}
              className="hover:text-yellow-700"
            >
              Test
            </Link>
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
