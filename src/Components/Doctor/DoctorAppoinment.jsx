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
    <div className="p-6 bg-white shadow rounded-lg overflow-x-auto">
      <h2 className="text-xl font-bold mb-4 text-gray-800">
        Danh sách cuộc hẹn
      </h2>
      {appointments.length === 0 ? (
        <p className="text-gray-600">Không có cuộc hẹn nào.</p>
      ) : (
        <table className="w-full table-auto border border-gray-300">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-2 border">#</th>
              <th className="p-2 border">Ngày tạo</th>
              <th className="p-2 border">Bệnh nhân</th>
              <th className="p-2 border">CMND/CCCD</th>
              <th className="p-2 border">Dịch vụ</th>
              <th className="p-2 border">Giờ bắt đầu</th>
              <th className="p-2 border">Trạng thái</th>
              <th className="p-2 border">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appt, index) => (
              <tr key={appt._id} className="border-t hover:bg-gray-50">
                <td className="p-2 border text-center">{index + 1}</td>
                <td className="p-2 border">
                  {new Date(appt.createdAt).toLocaleString("vi-VN")}
                </td>
                <td className="p-2 border">
                  {appt.patientID?.name || "Không có tên"}
                </td>
                <td className="p-2 border">
                  {appt.patientID?.personalID || "Không có"}
                </td>
                <td className="p-2 border">
                  {appt.serviceID?.name || "Không có dịch vụ"}
                </td>
                <td className="p-2 border">
                  {new Date(appt.startTime).toLocaleString("vi-VN")}
                </td>
                <td className="p-2 border text-center">
                  {appt.status || "Không rõ"}
                </td>
                <td className="p-2 border text-center space-x-2">
                  <button
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                    onClick={() =>
                      navigate(
                        `medical-records/personal-id/${appt.patientID?.personalID}`
                      )
                    }
                  >
                    Xem hồ sơ
                  </button>
                  {/* <button
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                    onClick={() =>
                      navigate(`medical-records/create/${appt.patientID?._id}`)
                    }
                  >
                    Tạo bệnh án
                  </button> */}
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
