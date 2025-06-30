import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import appointmentService from "../../../Services/CusService/AppointmentService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PatientService from "../../../Services/patientService";

function formatTime(isoString) {
  const date = new Date(isoString);
  const adjustedDate = new Date(date.getTime() - 7 * 60 * 60 * 1000);
  return adjustedDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
}

function formatDate(isoDateString) {
  if (!isoDateString) return "";
  const date = new Date(isoDateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

const BookingConfirmPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { doctor, slot, date, service = null } = location.state || {};
  const token = localStorage.getItem("token");
  const serviceName = service?.name || "Chưa chọn dịch vụ";

  const patient = JSON.parse(localStorage.getItem("patient"));
  const [hasPatient, setHasPatient] = useState(false);

  const [info, setInfo] = useState({ name: "", cccd: "", phone: "" });
  const [patientForm, setPatientForm] = useState({
    name: "",
    personalID: "",
    gender: "",
    dob: "",
    contactEmails: [""],
    contactPhones: [""],
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!doctor || !slot) return;
    if (token && patient?._id) {
      setHasPatient(true);
      setInfo({
        name: patient.name || "",
        cccd: patient.personalID || "",
        phone: patient.contactPhones?.[0] || ""
      });
    } else {
      setHasPatient(false);
    }
  }, [token, slot]);

  const handleChange = (e) => {
    setInfo({ ...info, [e.target.name]: e.target.value });
  };

  const handlePatientFormChange = (e) => {
    const { name, value } = e.target;
    setPatientForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitBooking = async (e) => {
    e.preventDefault();
    if (hasPatient) {
      if (!info.name || !info.cccd || !info.phone) {
        toast.warning("Vui lòng nhập đầy đủ thông tin bệnh nhân!");
        return;
      }
    } else {
      if (
        !patientForm.name || !patientForm.personalID || !patientForm.gender ||
        !patientForm.dob || !patientForm.contactEmails[0] || !patientForm.contactPhones[0]
      ) {
        toast.warning("Vui lòng nhập đầy đủ thông tin bệnh nhân mới!");
        return;
      }
    }

    setLoading(true);
      try {
    let createdPatient = null;

    if (!hasPatient) {
      // 🧠 Tạo mới bệnh nhân nếu chưa có
      createdPatient = await PatientService.createPatient(patientForm);
      if (!createdPatient?._id) throw new Error("Tạo bệnh nhân thất bại");
    }

    const appointmentData = {
      patientID: hasPatient ? patient._id : createdPatient._id,doctorSlotID: [slot._id],
      serviceID: service?._id || null,
      treatmentID: null,
    };

    
      const appointment = await appointmentService.createAppointment(appointmentData);
      toast.success(
        <>
          <b>Đặt lịch thành công!</b><br />
          Bệnh nhân: {hasPatient ? info.name : patientForm.name} <br />
          CCCD: {hasPatient ? info.cccd : patientForm.personalID} <br />
          SĐT: {hasPatient ? info.phone : patientForm.contactPhones[0]} <br />
          Bác sĩ: {doctor.userID?.name} <br />
          Ngày: {formatDate(date)}, {formatTime(slot.startTime)} - {formatTime(slot.endTime)}<br />
          Dịch vụ: {serviceName}
        </>
      );
      setTimeout(() => {
        navigate("/booking-payment", {
          state: {
            appointment,
            info: hasPatient ? info : patientForm,
            doctor,
            slot,
            date,
            service
          }
        });
      }, 1800);
    } catch (error) {
      toast.error("Đặt lịch thất bại: " + (error.message || "Lỗi không xác định"));
    } finally {
      setLoading(false);
    }
  };

  if (!doctor || !slot) return <div>Không có dữ liệu đặt lịch!</div>;

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-10 rounded-2xl shadow-2xl" style={{ background: "#f9fafb" }}>
      <h2 className="text-3xl font-extrabold mb-6 text-center drop-shadow-xl" style={{ color: "#1976d2" }}>
        Xác nhận đặt lịch
      </h2>

      <div className="mb-6 border-2 rounded-xl p-5 shadow-md" style={{ borderColor: "#1976d2", background: "#e3f2fd" }}>
        <div className="text-lg mb-2"><b>Bác sĩ:</b> {doctor.userID?.name}</div>
        <div className="text-lg mb-2"><b>Ngày:</b> {formatDate(date)}</div>
        <div className="text-lg mb-2"><b>Giờ:</b> {formatTime(slot.startTime)} - {formatTime(slot.endTime)}</div>
        <div className="text-lg"><b>Dịch vụ:</b> {serviceName}</div>
      </div>

      <form onSubmit={handleSubmitBooking}>
        {hasPatient ? (
          <>
            <label className="block font-semibold mb-1">Họ tên:</label>
            <input type="text" name="name" value={info.name} onChange={handleChange} className="w-full border rounded px-3 py-2 mb-2" placeholder="Nhập họ tên" disabled={loading} />

            <label className="block font-semibold mb-1">CCCD:</label>
            <input type="text" name="cccd" value={info.cccd} onChange={handleChange} className="w-full border rounded px-3 py-2 mb-2" placeholder="Nhập CCCD" disabled={loading} />

            <label className="block font-semibold mb-1">Số điện thoại:</label>
            <input type="text" name="phone" value={info.phone} onChange={handleChange} className="w-full border rounded px-3 py-2" placeholder="Nhập số điện thoại" disabled={loading} />
          </>
        ) : (
          <>
            <label className="block font-semibold mb-1">Họ tên:</label>
            <input type="text" name="name" value={patientForm.name} onChange={handlePatientFormChange} className="w-full border rounded px-3 py-2 mb-2" placeholder="Nhập họ tên" required />

            <label className="block font-semibold mb-1">CCCD:</label>
            <input type="text" name="personalID" value={patientForm.personalID} onChange={handlePatientFormChange} className="w-full border rounded px-3 py-2 mb-2" placeholder="Nhập CCCD" required />
            <label className="block font-semibold mb-1">Giới tính:</label>
            <select
              name="gender"
              value={patientForm.gender}
              onChange={handlePatientFormChange}
              className="w-full border rounded px-3 py-2 mb-2"
              required
            >
              <option value="">Chọn giới tính</option>
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
            </select>

            <label className="block font-semibold mb-1">Ngày sinh:</label>
            <input type="date" name="dob" value={patientForm.dob} onChange={handlePatientFormChange} className="w-full border rounded px-3 py-2 mb-2" required />

            <label className="block font-semibold mb-1">Email:</label>
            <input type="email" name="contactEmails" value={patientForm.contactEmails[0]} onChange={(e) => setPatientForm(p => ({ ...p, contactEmails: [e.target.value] }))} className="w-full border rounded px-3 py-2 mb-2" placeholder="Email" required />

            <label className="block font-semibold mb-1">SĐT:</label>
            <input type="text" name="contactPhones" value={patientForm.contactPhones[0]} onChange={(e) => setPatientForm(p => ({ ...p, contactPhones: [e.target.value] }))} className="w-full border rounded px-3 py-2" placeholder="Số điện thoại" required />
          </>
        )}

        <button type="submit" className="w-full mt-4 text-white text-xl px-6 py-4 rounded-2xl font-bold shadow-lg transition-all duration-200" style={{ background: "#1976d2", border: "none" }} disabled={loading}>
          {loading ? "Đang xử lý..." : "Xác nhận đặt lịch"}
        </button>
      </form>

      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
};

export default BookingConfirmPage;
