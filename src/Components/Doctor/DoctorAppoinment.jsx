import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import doctorAppointmentService from "../../Services/DoctorService/doctorAppointmentService";

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const data = await doctorAppointmentService.getAppointmentsByToken();
        setAppointments(data);
      } catch (err) {
        console.error("Không thể tải danh sách cuộc hẹn:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  if (loading) return <p>Đang tải dữ liệu...</p>;

  return (
    <div className="p-6 bg-white shadow rounded-lg">
      <h2 className="text-xl font-bold mb-4">Danh sách cuộc hẹn</h2>
      {appointments.length === 0 ? (
        <p>Không có cuộc hẹn nào.</p>
      ) : (
        <table className="w-full table-auto border">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="p-2">#</th>
              <th className="p-2">Ngày tạo</th>
              <th className="p-2">Bệnh nhân</th>
              <th className="p-2">Dịch vụ</th>
              <th className="p-2">Giờ bắt đầu</th>
              <th className="p-2">Trạng thái</th>
              <th className="p-2">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appt, index) => (
              <tr key={appt._id} className="border-t">
                <td className="p-2">{index + 1}</td>
                <td className="p-2">
                  {new Date(appt.createdAt).toLocaleString()}
                </td>
                <td className="p-2">{appt.patientID}</td>
                <td className="p-2">{appt.serviceID}</td>
                <td className="p-2">
                  {new Date(appt.startTime).toLocaleString()}
                </td>
                <td className="p-2">{appt.status}</td>
                <td className="p-2">
                  <button
                    className="bg-green-600 text-white px-3 py-1 rounded mr-2 hover:bg-green-700"
                    onClick={() =>
                      navigate(`medical-records/view/${appt.patientID}`)
                    }
                  >
                    Xem hồ sơ
                  </button>
                  <button
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                    onClick={() =>
                      navigate(`medical-records/create/${appt.patientID}`)
                    }
                  >
                    Tạo bệnh án
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default DoctorAppointments;
