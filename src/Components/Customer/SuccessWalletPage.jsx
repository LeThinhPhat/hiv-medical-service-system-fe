import React from 'react';
import { useLocation } from 'react-router-dom';

// Component hiển thị thông báo nạp tiền thành công
const SuccessWalletPage = () => {
  // Lấy query parameters từ URL
  const location = useLocation();
  const query = new URLSearchParams(location.search);

  // Lấy dữ liệu từ query
  const params = {
    vnp_Amount: query.get('vnp_Amount') || '0',
    vnp_BankCode: query.get('vnp_BankCode') || 'N/A',
    vnp_BankTranNo: query.get('vnp_BankTranNo') || 'N/A',
    vnp_CardType: query.get('vnp_CardType') || 'N/A',
    vnp_OrderInfo: decodeURIComponent(query.get('vnp_OrderInfo') || 'N/A'),
    vnp_PayDate: query.get('vnp_PayDate') || 'N/A',
    vnp_ResponseCode: query.get('vnp_ResponseCode') || 'N/A',
    vnp_TmnCode: query.get('vnp_TmnCode') || 'N/A',
    vnp_TransactionNo: query.get('vnp_TransactionNo') || 'N/A',
    vnp_TransactionStatus: query.get('vnp_TransactionStatus') || 'N/A',
    vnp_TxnRef: query.get('vnp_TxnRef') || 'N/A',
  };

  // Định dạng số tiền
  const formattedAmount = (parseInt(params.vnp_Amount) / 100).toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });

  // Định dạng ngày giờ
  let payDate = 'N/A';
  if (params.vnp_PayDate !== 'N/A') {
    payDate = new Date(
      params.vnp_PayDate.slice(0, 4) +
        "-" +
        params.vnp_PayDate.slice(4, 6) +
        "-" +
        params.vnp_PayDate.slice(6, 8) +
        "T" +
        params.vnp_PayDate.slice(8, 10) +
        ":" +
        params.vnp_PayDate.slice(10, 12) +
        ":" +
        params.vnp_PayDate.slice(12, 14)
    ).toLocaleString("vi-VN", {
      dateStyle: "short",
      timeStyle: "short",
    });
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
        <h1 className="text-2xl font-bold text-green-600 text-center mb-4">
          Nạp Tiền Thành Công
        </h1>
        <p className="text-gray-700 text-center mb-6">
          Giao dịch nạp tiền vào ví của bạn đã được thực hiện thành công. Dưới đây là chi tiết:
        </p>
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="font-semibold">Số tiền:</span>
            <span>{formattedAmount}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Ngân hàng:</span>
            <span>{params.vnp_BankCode}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Mã giao dịch ngân hàng:</span>
            <span>{params.vnp_BankTranNo}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Loại thẻ:</span>
            <span>{params.vnp_CardType}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Mô tả:</span>
            <span>{params.vnp_OrderInfo}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Thời gian giao dịch:</span>
            <span>{payDate}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Mã giao dịch VNPAY:</span>
            <span>{params.vnp_TransactionNo}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Trạng thái:</span>
            <span className="text-green-600">
              {params.vnp_TransactionStatus === '00' ? 'Thành công' : 'Không xác định'}
            </span>
          </div>
        </div>
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi! Nếu có thắc mắc, vui lòng liên hệ bộ phận hỗ trợ.
          </p>
          <a
            href="/"
            className="mt-4 inline-block bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition"
          >
            Quay về trang chủ
          </a>
        </div>
      </div>
    </div>
  );
};

export default SuccessWalletPage;