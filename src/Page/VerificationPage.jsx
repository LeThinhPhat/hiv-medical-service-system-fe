import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function VerificationPage() {
  const navigate = useNavigate();
  const [seconds, setSeconds] = useState(5);

  useEffect(() => {
    document.title = 'Xác Thực Email Thành Công';

    const timer = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/signin');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  const containerStyle = {
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f4f8ff',
    margin: 0,
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  };

  const cardStyle = {
    backgroundColor: '#ffffff',
    padding: '3rem 4rem', // tăng padding
    borderRadius: '16px',
    boxShadow: '0 10px 25px rgba(0, 123, 255, 0.25)',
    textAlign: 'center',
    maxWidth: '600px', // tăng chiều rộng tối đa
    width: '90%', // chiếm 90% chiều rộng màn hình trên thiết bị nhỏ
  };

  const checkmarkStyle = {
    fontSize: '4.5rem', // tăng size
    color: '#007BFF',
    marginBottom: '1.5rem',
  };

  const titleStyle = {
    fontSize: '2.2rem', // tăng size
    fontWeight: '700',
    color: '#007BFF',
    marginBottom: '1rem',
  };

  const messageStyle = {
    fontSize: '1.3rem', // tăng size
    color: '#333',
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div style={checkmarkStyle}>✔</div>
        <div style={titleStyle}>Xác Thực Tài Khoản Thành Công!</div>
        <p style={messageStyle}>
          Email của bạn đã được xác minh thành công. Bạn sẽ được chuyển hướng trong {seconds} giây...
        </p>
      </div>
    </div>
  );
}

export default VerificationPage;
