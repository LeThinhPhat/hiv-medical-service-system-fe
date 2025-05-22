import React from "react";

const Header = () => {
  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="text-2xl font-bold text-yellow-700">GoldenAge</div>

        {/* Menu */}
        <nav className="hidden md:flex space-x-6 text-gray-700 text-sm font-medium">
          <a href="#" className="hover:text-yellow-700 transition">
            Trang chủ
          </a>
          <a href="#" className="hover:text-yellow-700 transition">
            Sản phẩm
          </a>
          <a href="#" className="hover:text-yellow-700 transition">
            Giới thiệu
          </a>
          <a href="#" className="hover:text-yellow-700 transition">
            Liên hệ
          </a>
        </nav>

        {/* Actions */}
        <div className="space-x-3">
          <button className="bg-yellow-500 hover:bg-yellow-600 text-white text-sm px-4 py-2 rounded">
            Đăng nhập
          </button>
          <button className="border border-yellow-500 text-yellow-500 hover:bg-yellow-50 text-sm px-4 py-2 rounded">
            Đăng ký
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
