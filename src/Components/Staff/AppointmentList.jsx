import React, { useEffect, useState } from "react";
import { FaCheckCircle, FaTimesCircle, FaEdit } from "react-icons/fa";
import appointmentlistService from "../../Services/StaffService/appointmentlistService";

const AppointmentList = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await appointmentlistService.getAllAppointments();
        setAppointments(res.data); // lấy "data" từ API response
      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu lịch hẹn:", err);
      }
    };

    fetchAppointments();
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white p-4 rounded-md shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-700">
            Appointments List
          </h2>
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Book Appointment
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left border border-gray-200">
            <thead className="bg-gray-100 text-gray-600 font-semibold">
              <tr>
                <th className="p-2 border">#</th>
                <th className="p-2 border">Patient</th>
                <th className="p-2 border">Doctor</th>
                <th className="p-2 border">Date</th>
                <th className="p-2 border">Start</th>
                <th className="p-2 border">End</th>
                <th className="p-2 border">Service</th>
                <th className="p-2 border">Status</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((item, index) => {
                const doctorEmail = item?.createdBy?.email || "N/A";
                const patientID = item?.patientID?._id?.slice(-4) || "----";
                const date = new Date(item.date).toLocaleDateString();
                const startTime = new Date(
                  item.doctorSlotID?.[0]?.startTime
                ).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                });
                const endTime = new Date(
                  item.doctorSlotID?.[0]?.endTime
                ).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                });
                const status =
                  item.doctorSlotID?.[0]?.status || item.status || "N/A";
                const service = item?.serviceID?.name || "N/A";

                return (
                  <tr key={item._id} className="hover:bg-gray-50">
                    <td className="p-2 border">{index + 1}</td>
                    <td className="p-2 border">#{patientID}</td>
                    <td className="p-2 border">{doctorEmail}</td>
                    <td className="p-2 border">{date}</td>
                    <td className="p-2 border">{startTime}</td>
                    <td className="p-2 border">{endTime}</td>
                    <td className="p-2 border">{service}</td>
                    <td className="p-2 border capitalize">
                      {status.replace(/_/g, " ")}
                    </td>
                    <td className="p-2 border flex justify-center gap-2">
                      <button className="text-green-600 hover:text-green-800 border border-green-500 p-1 rounded">
                        <FaCheckCircle />
                      </button>
                      <button className="text-red-600 hover:text-red-800 border border-red-500 p-1 rounded">
                        <FaTimesCircle />
                      </button>
                      <button className="text-blue-600 hover:text-blue-800 border border-blue-500 p-1 rounded">
                        <FaEdit />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-4 text-sm text-gray-600">
          Showing {appointments.length} records
        </div>
      </div>
    </div>
  );
};

export default AppointmentList;
