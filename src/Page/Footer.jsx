import React from "react";
import { FaFacebookF, FaInstagram, FaMapMarkerAlt } from "react-icons/fa";
import { SiZalo } from "react-icons/si";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-blue-50 text-gray-700 mt-12 border-t border-blue-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Cột 1: Công ty */}
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-6">Công Ty</h2>
          <ul className="space-y-3 text-sm font-medium">
            <li>
              <Link
                to="/about"
                className="hover:text-blue-400 transition-colors duration-300"
              >
                Giới thiệu
              </Link>
            </li>
            <li>
              <Link
                to="/careers"
                className="hover:text-blue-400 transition-colors duration-300"
              >
                Tuyển dụng
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className="hover:text-blue-400 transition-colors duration-300"
              >
                Liên hệ
              </Link>
            </li>
          </ul>
        </div>

        {/* Cột 2: Hỗ trợ */}
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-6">Hỗ Trợ</h2>
          <ul className="space-y-3 text-sm font-medium">
            <li>
              <Link
                to="/warranty"
                className="hover:text-blue-400 transition-colors duration-300"
              >
                Chính sách bảo hành
              </Link>
            </li>
            <li>
              <Link
                to="/returns"
                className="hover:text-blue-400 transition-colors duration-300"
              >
                Chính sách đổi trả
              </Link>
            </li>
            <li>
              <Link
                to="/guide"
                className="hover:text-blue-400 transition-colors duration-300"
              >
                Hướng dẫn mua hàng
              </Link>
            </li>
          </ul>
        </div>

        {/* Cột 3: Kết nối với chúng tôi */}
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-6">
            Kết Nối Với Chúng Tôi
          </h2>
          <ul className="space-y-4 text-sm font-medium">
            <li>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 hover:text-blue-400 transition-colors duration-300"
              >
                <FaFacebookF
                  className="text-blue-400 hover:text-blue-500"
                  size={20}
                />
                <span>Facebook</span>
              </a>
            </li>
            <li>
              <a
                href="https://zalo.me"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 hover:text-blue-400 transition-colors duration-300"
              >
                <SiZalo
                  className="text-blue-400 hover:text-blue-500"
                  size={20}
                />
                <span>Zalo</span>
              </a>
            </li>
            <li>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 hover:text-blue-400 transition-colors duration-300"
              >
                <FaInstagram
                  className="text-blue-400 hover:text-blue-500"
                  size={20}
                />
                <span>Instagram</span>
              </a>
            </li>
          </ul>
        </div>

        {/* Cột 4: Địa chỉ */}
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-6">Địa Chỉ</h2>
          <div className="flex items-start space-x-2 text-sm font-medium text-gray-600">
            <FaMapMarkerAlt className="text-blue-400 mt-1" size={20} />
            <p>
              Đại Học FPT, Khu Công Nghệ Cao, <br />
              TP. Hồ Chí Minh, Việt Nam
            </p>
          </div>
        </div>
      </div>

      <div className="text-center text-sm text-gray-500 py-6 border-t border-blue-100 bg-blue-50">
        © {new Date().getFullYear()} GoldenAge. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
