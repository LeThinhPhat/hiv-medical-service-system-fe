import React, { useState } from "react";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import viLocale from "date-fns/locale/vi";
import { toast } from "react-hot-toast";
import doctorService from "../../Services/ManagerService/doctorService";

const CreateDoctor = () => {
  const [formData, setFormData] = useState({
    room: "",
    experiences: "",
    degrees: "",
    specializations: "",
    email: "",
    password: "",
    name: "",
    gender: "",
    dob: null,
    address: "",
    phone: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateChange = (newDate) => {
    setFormData((prev) => ({
      ...prev,
      dob: newDate
        ? new Date(
            Date.UTC(
              newDate.getFullYear(),
              newDate.getMonth(),
              newDate.getDate()
            )
          ).toISOString()
        : "",
    }));
  };

  const validatePhone = (phone) => {
    const regex = /^[0-9]{9,12}$/;
    return regex.test(phone);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (
        !formData.name ||
        !formData.email ||
        !formData.password ||
        !formData.dob
      ) {
        toast.error("Vui lòng điền đầy đủ các trường bắt buộc!");
        return;
      }

      if (!["Nam", "Nữ", "Khác"].includes(formData.gender)) {
        toast.error("Vui lòng chọn giới tính hợp lệ!");
        return;
      }

      if (formData.phone && !validatePhone(formData.phone)) {
        toast.error("Số điện thoại phải từ 9 đến 12 chữ số!");
        return;
      }

      const experiencesArray = formData.experiences
        ? formData.experiences
            .split(",")
            .map((exp) => exp.trim())
            .filter((exp) => exp !== "")
        : [];

      if (experiencesArray.length === 0) {
        toast.error("Vui lòng nhập ít nhất một kinh nghiệm!");
        return;
      }

      const payload = {
        ...formData,
        experiences: experiencesArray,
      };

      await doctorService.createDoctor(payload);
      toast.success("Tạo bác sĩ thành công!");

      setFormData({
        room: "",
        experiences: "",
        degrees: "",
        specializations: "",
        email: "",
        password: "",
        name: "",
        gender: "",
        dob: null,
        address: "",
        phone: "",
      });
    } catch (err) {
      console.error("API Error:", err.response?.data || err.message);
      toast.error(
        `Tạo bác sĩ thất bại: ${err.response?.data?.message || err.message}`
      );
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={viLocale}>
      <div className="container mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-teal-600 mb-6">
          Tạo Mới Bác Sĩ
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Tên *"
              className="w-full p-2 bg-teal-50 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email *"
              className="w-full p-2 bg-teal-50 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Mật khẩu *"
              className="w-full p-2 bg-teal-50 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full p-2 bg-teal-50 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            >
              <option value="">Chọn giới tính</option>
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
              <option value="Khác">Khác</option>
            </select>
            <DatePicker
              label="Ngày sinh *"
              value={formData.dob ? new Date(formData.dob) : null}
              onChange={handleDateChange}
              format="dd/MM/yyyy"
              slotProps={{
                textField: {
                  className:
                    "w-full p-2 bg-teal-50 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500",
                  required: true,
                },
              }}
            />
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Số điện thoại"
              className="w-full p-2 bg-teal-50 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <input
              type="text"
              name="room"
              value={formData.room}
              onChange={handleChange}
              placeholder="Phòng"
              className="w-full p-2 bg-teal-50 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Địa chỉ"
              className="w-full md:col-span-2 p-2 bg-teal-50 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <input
              type="text"
              name="degrees"
              value={formData.degrees}
              onChange={handleChange}
              placeholder="Bằng cấp"
              className="w-full md:col-span-2 p-2 bg-teal-50 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <input
              type="text"
              name="specializations"
              value={formData.specializations}
              onChange={handleChange}
              placeholder="Chuyên môn"
              className="w-full md:col-span-2 p-2 bg-teal-50 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <input
              type="text"
              name="experiences"
              value={formData.experiences}
              onChange={handleChange}
              placeholder="Kinh nghiệm (cách nhau bởi dấu phẩy)"
              className="w-full md:col-span-2 p-2 bg-teal-50 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div className="flex justify-end gap-4 mt-6">
            <button
              type="submit"
              className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
            >
              Tạo Bác Sĩ
            </button>
            <button
              type="button"
              onClick={() => {
                setFormData({
                  room: "",
                  experiences: "",
                  degrees: "",
                  specializations: "",
                  email: "",
                  password: "",
                  name: "",
                  gender: "",
                  dob: null,
                  address: "",
                  phone: "",
                });
                toast.success("Đã xóa tất cả thông tin!");
              }}
              className="px-4 py-2 border border-red-500 text-red-500 rounded-md hover:bg-red-50 transition-colors"
            >
              Xóa Tất Cả
            </button>
          </div>
        </form>
      </div>
    </LocalizationProvider>
  );
};

export default CreateDoctor;
