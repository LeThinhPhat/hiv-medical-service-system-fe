import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import authService from "../Services/authService";

const SignUp = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: "", email: "", personalID: "", dob: "",
    gender: "", address: "", phone: "",
    password: "", confirmPassword: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleNext = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const handleBack = () => {
    setError("");
    setStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Mật khẩu không trùng khớp.");
      setLoading(false);
      return;
    }

    const payload = {
      name: form.name,
      email: form.email,
      personalID: form.personalID,
      dob: form.dob,
      gender: form.gender,
      address: form.address,
      phone: form.phone,
      password: form.password
    };

    try {
      await authService.signup(payload);
      toast.success("Đăng ký thành công!");
      navigate("/signin");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Đăng ký thất bại. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Create Account</h2>
        <form onSubmit={step === 1 ? handleNext : handleSubmit} className="space-y-4">
          {step === 1 && (
            <>
              {/* Các input bước 1 giống như trước */}
              <Input label="Họ và tên" name="name" value={form.name} onChange={handleChange} />
              <Input label="Email" name="email" type="email" value={form.email} onChange={handleChange} />
              <Input label="Mã CCCD" name="personalID" value={form.personalID} onChange={handleChange} />
              <Input label="Ngày sinh" name="dob" type="date" value={form.dob} onChange={handleChange} />
              <div>
                <label className="block text-sm font-medium">Giới tính</label>
                <select name="gender" value={form.gender} onChange={handleChange}
                  className="mt-1 w-full px-3 py-2 border rounded shadow-sm focus:ring-2 focus:ring-indigo-500" required>
                  <option value="">-- Giới tính --</option>
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                  <option value="Khác">Khác</option>
                </select>
              </div>
              <Input label="Địa chỉ" name="address" value={form.address} onChange={handleChange} />
              <Input label="Số điện thoại" name="phone" value={form.phone} onChange={handleChange} />

              <button type="submit" className="w-full py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
                Tiếp theo
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <Input label="Mật khẩu" name="password" type="password" value={form.password} onChange={handleChange} />
              <Input label="Xác nhận mật khẩu" name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} />
              {error && <p className="text-red-500 text-sm">{error}</p>}

              <div className="flex justify-between items-center space-x-2">
                <button
                  type="button"
                  onClick={handleBack}
                  disabled={loading}
                  className="flex-1 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                >
                  Quay lại
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  {loading ? "Đăng ký..." : "Đăng ký"}
                </button>
              </div>
            </>
          )}
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <a href="/signin" className="text-indigo-600 hover:underline font-medium">
            Sign In
          </a>
        </p>
      </div>
    </div>
  );
};

const Input = ({ label, name, type = "text", value, onChange }) => (
  <div>
    <label className="block text-sm font-medium">{label}</label>
    <input
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      className="mt-1 w-full px-3 py-2 border rounded shadow-sm focus:ring-2 focus:ring-indigo-500"
      required
    />
  </div>
);

export default SignUp;
