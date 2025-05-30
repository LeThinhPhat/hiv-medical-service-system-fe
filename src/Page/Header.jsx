import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react"; // icon nếu đã cài lucide-react hoặc dùng Heroicons nếu thích

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

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
          <Link to="/news" className="hover:text-yellow-700 transition">
            Tin tức
          </Link>
          <Link to="/blogs" className="hover:text-yellow-700 transition">
            Blogs
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={toggleMenu} className="text-yellow-700">
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Actions */}
        <div className="hidden md:flex space-x-3">
          <Link to="/signin">
            <button className="bg-yellow-500 hover:bg-yellow-600 text-white text-sm px-4 py-2 rounded">
              Đăng nhập
            </button>
          </Link>
          <Link to="/register">
            <button className="border border-yellow-500 text-yellow-500 hover:bg-yellow-50 text-sm px-4 py-2 rounded">
              Đăng ký
            </button>
          </Link>
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
              Blog
            </Link>
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
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
