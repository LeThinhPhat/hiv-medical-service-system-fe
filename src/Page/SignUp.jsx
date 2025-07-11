import React, { useState } from "react";
import toast from "react-hot-toast";
import authService from "../Services/authService";

const SignUp = () => {
 // const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: "", email: "", personalID: "", dob: "",
    gender: "", address: "", phone: "",
    password: "", confirmPassword: ""
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const validateStep1 = () => {
    const newErrors = {};
    if (!form.name || form.name.trim().length < 2) newErrors.name = "Họ tên phải ít nhất 2 ký tự.";
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) newErrors.email = "Email không hợp lệ.";
    if (!form.personalID || !/^\d{12}$/.test(form.personalID)) newErrors.personalID = "CCCD phải gồm 12 chữ số.";
    if (!form.dob) newErrors.dob = "Vui lòng chọn ngày sinh.";
    if (!form.gender) newErrors.gender = "Vui lòng chọn giới tính.";
    if (!form.address) newErrors.address = "Vui lòng nhập địa chỉ.";
    if (!form.phone || !/^0\d{9}$/.test(form.phone)) newErrors.phone = "Số điện thoại không hợp lệ.";
    return newErrors;
  };

  const validateStep2 = () => {
    const newErrors = {};
    if (!form.password || form.password.length < 6) newErrors.password = "Mật khẩu phải ít nhất 6 ký tự.";
    if (form.password !== form.confirmPassword) newErrors.confirmPassword = "Mật khẩu không trùng khớp.";
    return newErrors;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleNext = (e) => {
    e.preventDefault();
    const validationErrors = validateStep1();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      setShowConfirmModal(true);
    }
  };

  const handleBack = () => {
    setErrors({});
    setStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateStep2();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

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
      toast.success("Đăng ký thành công! Đang chuyển hướng đến Gmail...");
setTimeout(() => {
  window.location.href = "https://mail.google.com/mail/u/0/?ogbl#inbox";
}, 1500);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Đăng ký thất bại. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md relative z-10">
        <h2 className="text-2xl font-bold text-center mb-6">
          {step === 1 ? "Tạo Tài Khoản" : "Xác nhận mật khẩu"}
        </h2>

        <form onSubmit={step === 1 ? handleNext : handleSubmit} className="space-y-4">
          {step === 1 && (
            <>
              <Input label="Họ và tên" name="name" value={form.name} onChange={handleChange} error={errors.name} />
              <Input label="Email" name="email" type="email" value={form.email} onChange={handleChange} error={errors.email} />
              <Input label="Mã CCCD" name="personalID" value={form.personalID} onChange={handleChange} error={errors.personalID} />
              <Input label="Ngày sinh" name="dob" type="date" value={form.dob} onChange={handleChange} error={errors.dob} />
              <div>
                <label className="block text-sm font-medium">Giới tính</label>
                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  className={`mt-1 w-full px-3 py-2 border rounded shadow-sm focus:ring-2 focus:ring-indigo-500 ${
                    errors.gender ? "border-red-500" : ""
                  }`}
                >
                  <option value="">-- Giới tính --</option>
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                  <option value="Khác">Khác</option>
                </select>
                {errors.gender && <p className="text-red-500 text-sm">{errors.gender}</p>}
              </div>
              <Input label="Địa chỉ" name="address" value={form.address} onChange={handleChange} error={errors.address} />
              <Input label="Số điện thoại" name="phone" value={form.phone} onChange={handleChange} error={errors.phone} />

              <button type="submit" className="w-full py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
                Tiếp theo
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <Input
                label="Mật khẩu"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                error={errors.password}
              />
              <Input
                label="Xác nhận mật khẩu"
                name="confirmPassword"
                type="password"
                value={form.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword}
              />
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
                  {loading ? "Đang đăng ký..." : "Đăng ký"}
                </button>
              </div>
            </>
          )}
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Đã có tài khoản?{" "}
          <a href="/signin" className="text-indigo-600 hover:underline font-medium">
            Đăng nhập
          </a>
        </p>
      </div>

      {/* Modal xác nhận */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-20">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-sm">
            <h3 className="text-lg font-semibold mb-4">Xác nhận</h3>
            <p className="text-gray-700 text-sm mb-6">Bạn có chắc chắn muốn tiếp tục bước nhập mật khẩu?</p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Hủy
              </button>
              <button
                onClick={() => {
                  setShowConfirmModal(false);
                  setStep(2);
                }}
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Input = ({ label, name, type = "text", value, onChange, error }) => (
  <div>
    <label className="block text-sm font-medium">{label}</label>
    <input
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      className={`mt-1 w-full px-3 py-2 border rounded shadow-sm focus:ring-2 focus:ring-indigo-500 ${
        error ? "border-red-500" : ""
      }`}
      required
    />
    {error && <p className="text-red-500 text-sm">{error}</p>}
  </div>
);

export default SignUp;
