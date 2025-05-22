import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-100 text-gray-800 mt-10 border-t">
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Cột 1 */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Công ty</h2>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#" className="hover:underline">
                Giới thiệu
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Tuyển dụng
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Liên hệ
              </a>
            </li>
          </ul>
        </div>

        {/* Cột 2 */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Hỗ trợ</h2>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#" className="hover:underline">
                Chính sách bảo hành
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Chính sách đổi trả
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Hướng dẫn mua hàng
              </a>
            </li>
          </ul>
        </div>

        {/* Cột 3 */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Kết nối với chúng tôi</h2>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#" className="hover:underline">
                Facebook
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Zalo
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Instagram
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="text-center text-sm text-gray-500 py-4 border-t">
        © {new Date().getFullYear()} Golden Age. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
