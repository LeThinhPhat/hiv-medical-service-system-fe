import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import "moment/locale/vi";
import { Toaster } from "react-hot-toast";
import appointmentFinishService from "../../Services/DoctorService/appointmentFinishService";

moment.locale("vi");

const FinishAppointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("thisWeek");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState({});
  const [followUpDates, setFollowUpDates] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Không tìm thấy token. Vui lòng đăng nhập lại.");
          navigate("/login");
          return;
        }

        const res = await appointmentFinishService(token);
        if (res.data && Array.isArray(res.data)) {
          setAppointments(res.data);
          applyFilters(
            res.data,
            searchTerm,
            dateFilter,
            customStartDate,
            customEndDate
          );
          console.log("check finish : ", res.data);
          const initialExpanded = res.data.reduce((acc, appt) => {
            acc[appt._id] = false;
            return acc;
          }, {});
          const initialFollowUpDates = res.data.reduce((acc, appt) => {
            acc[appt._id] = "";
            return acc;
          }, {});
          setExpanded(initialExpanded);
          setFollowUpDates(initialFollowUpDates);
        } else {
          setError("Không tìm thấy lịch hẹn đã hoàn tất.");
        }
      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu lịch hẹn:", err);
        if (err.response?.status === 401) {
          setError(
            "Token không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập lại."
          );
          navigate("/login");
        } else {
          setError("Không thể lấy thông tin lịch hẹn. Vui lòng thử lại sau.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [navigate]);

  const applyFilters = (data, search, filter, start, end) => {
    let filtered = [...data];

    // Apply name search filter
    if (search) {
      filtered = filtered.filter((appointment) =>
        appointment.patientID.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Apply date filter
    const now = moment().utcOffset(7); // Vietnam timezone (UTC+7)
    if (filter === "thisWeek") {
      const startOfWeek = now.clone().startOf("week");
      const endOfWeek = now.clone().endOf("week");
      filtered = filtered.filter((appointment) =>
        moment(appointment.startTime).isBetween(
          startOfWeek,
          endOfWeek,
          null,
          "[]"
        )
      );
    } else if (filter === "custom" && start && end) {
      filtered = filtered.filter((appointment) =>
        moment(appointment.startTime).isBetween(
          moment(start).startOf("day"),
          moment(end).endOf("day"),
          null,
          "[]"
        )
      );
    }

    setFilteredAppointments(filtered);
  };

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    applyFilters(
      appointments,
      term,
      dateFilter,
      customStartDate,
      customEndDate
    );
  };

  const handleDateFilterChange = (e) => {
    const filter = e.target.value;
    setDateFilter(filter);
    applyFilters(
      appointments,
      searchTerm,
      filter,
      customStartDate,
      customEndDate
    );
  };

  const handleCustomDateChange = (type, value) => {
    if (type === "start") {
      setCustomStartDate(value);
    } else {
      setCustomEndDate(value);
    }
    if (customStartDate && customEndDate && type === "end" && value) {
      applyFilters(appointments, searchTerm, "custom", customStartDate, value);
    } else if (customStartDate && type === "start" && customEndDate) {
      applyFilters(appointments, searchTerm, "custom", value, customEndDate);
    }
  };

  const handleToggleExpand = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <svg
          className="animate-spin h-8 w-8 text-blue-600 mr-3"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        <span className="text-lg text-gray-600">
          Đang tải dữ liệu lịch hẹn...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto mt-8">
        <p className="text-center text-red-600 text-lg font-medium">{error}</p>
      </div>
    );
  }

  if (!filteredAppointments.length && (searchTerm || dateFilter)) {
    return (
      <div className="max-w-2xl mx-auto mt-8">
        <div className="mb-6 space-y-4">
          <input
            type="text"
            placeholder="Tìm kiếm theo tên bệnh nhân..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Tìm kiếm lịch hẹn"
          />
          <div className="flex flex-col sm:flex-row gap-4">
            <select
              value={dateFilter}
              onChange={handleDateFilterChange}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Lọc theo ngày"
            >
              <option value="thisWeek">Tuần này</option>
              <option value="custom">Tùy chỉnh</option>
            </select>
            {dateFilter === "custom" && (
              <div className="flex gap-4">
                <input
                  type="date"
                  value={customStartDate}
                  onChange={(e) =>
                    handleCustomDateChange("start", e.target.value)
                  }
                  className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Ngày bắt đầu"
                />
                <input
                  type="date"
                  value={customEndDate}
                  onChange={(e) =>
                    handleCustomDateChange("end", e.target.value)
                  }
                  className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Ngày kết thúc"
                />
              </div>
            )}
          </div>
        </div>
        <p className="text-center text-gray-500 text-lg">
          Không tìm thấy lịch hẹn phù hợp với bộ lọc.
        </p>
      </div>
    );
  }

  if (!appointments.length) {
    return (
      <div className="max-w-2xl mx-auto mt-8">
        <p className="text-center text-gray-500 text-lg">
          Không tìm thấy lịch hẹn đã hoàn tất.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto my-8 px-4">
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
        Danh Sách Lịch Hẹn Đã Hoàn Tất
      </h1>
      <div className="mb-6 max-w-2xl mx-auto space-y-4">
        <input
          type="text"
          placeholder="Tìm kiếm theo tên bệnh nhân..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Tìm kiếm lịch hẹn"
        />
        <div className="flex flex-col sm:flex-row gap-4">
          <select
            value={dateFilter}
            onChange={handleDateFilterChange}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Lọc theo ngày"
          >
            <option value="thisWeek">Tuần này</option>
            <option value="custom">Tùy chỉnh</option>
          </select>
          {dateFilter === "custom" && (
            <div className="flex gap-4">
              <input
                type="date"
                value={customStartDate}
                onChange={(e) =>
                  handleCustomDateChange("start", e.target.value)
                }
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Ngày bắt đầu"
              />
              <input
                type="date"
                value={customEndDate}
                onChange={(e) => handleCustomDateChange("end", e.target.value)}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Ngày kết thúc"
              />
            </div>
          )}
        </div>
      </div>
      {filteredAppointments.map((appointment) => (
        <div
          key={appointment._id}
          className="bg-white shadow-md rounded-lg mb-4 hover:shadow-lg transition-shadow"
          role="region"
          aria-label={`Lịch hẹn với ${appointment.patientID.name}`}
        >
          <div className="p-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-blue-600">
                {appointment.patientID.name} - {appointment.serviceID.name} 
              </h2>
              <button
                onClick={() => handleToggleExpand(appointment._id)}
                className="text-blue-600 hover:text-blue-800"
                aria-label={expanded[appointment._id] ? "Thu gọn" : "Mở rộng"}
              >
                {expanded[appointment._id] ? (
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 15l7-7 7 7"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                )}
              </button>
            </div>
            {expanded[appointment._id] && (
              <>
                <hr className="my-4 border-gray-200" />
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <svg
                      className="w-5 h-5 text-blue-500 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    <span>
                      <strong>Bệnh nhân:</strong>{" "}
                      {appointment.patientID.name || "N/A"}
                    </span>
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="w-5 h-5 text-blue-500 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 10h18M3 14h18M3 6h18M3 18h18"
                      />
                    </svg>
                    <span>
                      <strong>CMND/CCCD:</strong>{" "}
                      {appointment.patientID.personalID || "N/A"}
                    </span>
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="w-5 h-5 text-blue-500 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                      />
                    </svg>
                    <span>
                      <strong>Bác sĩ:</strong>{" "}
                      {appointment.updatedBy?.email || "N/A"}
                    </span>
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="w-5 h-5 text-blue-500 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 6h16M4 10h16M4 14h16M4 18h16"
                      />
                    </svg>
                    <span>
                      <strong>Dịch vụ:</strong>{" "}
                      {appointment.serviceID.name || "N/A"}
                    </span>
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="w-5 h-5 text-blue-500 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08 0 3 2-1.11 0-2.08 0-3 2m-5 0a7 7 0 0114 0"
                      />
                    </svg>
                    <span>
                      <strong>Giá:</strong>{" "}
                      {`${appointment.serviceID.price.toLocaleString(
                        "vi-VN"
                      )} VND`}
                    </span>
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="w-5 h-5 text-blue-500 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>
                      <strong>Thời lượng:</strong>{" "}
                      {`${appointment.serviceID.durationMinutes} phút`}
                    </span>
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="w-5 h-5 text-blue-500 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span>
                      <strong>Thời gian bắt đầu:</strong>{" "}
                      {moment(appointment.startTime)
                        .utcOffset(7)
                        .format("DD/MM/YYYY HH:mm")}
                    </span>
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="w-5 h-5 text-blue-500 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span>
                      <strong>Ngày tạo:</strong>{" "}
                      {moment(appointment.createdAt)
                        .utcOffset(7)
                        .format("DD/MM/YYYY HH:mm")}
                    </span>
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="w-5 h-5 text-green-500 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>
                      <strong>Trạng thái:</strong>{" "}
                      <span className="text-green-600 font-medium">
                        {appointment.status}
                      </span>
                    </span>
                  </li>
                </ul>
              </>
            )}
          </div>
        </div>
      ))}
      <Toaster />
    </div>
  );
};

export default FinishAppointment;
