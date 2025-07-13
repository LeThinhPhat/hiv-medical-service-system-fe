import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import dayjs from "dayjs";
import dashboardService from "../../Services/StaffService/dashboardService";

const Dashboard = () => {
  const currentYear = dayjs().year();
  const [month, setMonth] = useState(dayjs().month() + 1);
  const [year, setYear] = useState(currentYear);
  const [rawData, setRawData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);

  const months = Array.from({ length: 12 }, (_, i) => ({
    value: i + 1,
    label: `Tháng ${i + 1}`,
  }));
  const years = Array.from({ length: currentYear - 1999 }, (_, i) => 2000 + i);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await dashboardService.getRevenueStatistics("day");
        setRawData(data || []);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const filtered = rawData.filter((item) => {
      const date = dayjs(item._id);
      return (
        date.month() + 1 === parseInt(month) && date.year() === parseInt(year)
      );
    });
    setFilteredData(filtered);
  }, [month, year, rawData]);

  const totalRevenue = filteredData.reduce((sum, d) => sum + d.totalRevenue, 0);
  const totalAppointments = filteredData.reduce(
    (sum, d) => sum + d.totalAppointments,
    0
  );

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-gray-700 font-medium">{`Ngày: ${label}`}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-gray-600">
              {entry.name}:{" "}
              {entry.name.includes("Doanh thu")
                ? new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(entry.value)
                : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="container mx-auto px-4 py-12   min-h-screen">
      <h1 className="text-4xl font-extrabold text-gray-800 mb-10 text-center animate-fade-in">
        Báo Cáo Hoạt Động Y Tế
      </h1>

      {/* Filter Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Chọn Tháng
          </label>
          <select
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 bg-white"
          >
            {months.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </div>
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Chọn Năm
          </label>
          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 bg-white"
          >
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-700">
                Tổng Doanh Thu
              </h3>
              <p className="text-3xl font-bold text-blue-600 mt-2 animate-pulse-once">
                {totalRevenue.toLocaleString("vi-VN")} ₫
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-pink-100 rounded-full">
              <svg
                className="w-6 h-6 text-pink-600"
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
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-700">
                Tổng Lịch Hẹn
              </h3>
              <p className="text-3xl font-bold text-pink-600 mt-2 animate-pulse-once">
                {totalAppointments}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      {loading ? (
        <div className="grid grid-cols-1 gap-8">
          <div className="bg-white p-8 rounded-2xl shadow-lg animate-pulse">
            <div className="h-6 w-48 bg-gray-200 rounded mb-4"></div>
            <div className="h-96 w-full bg-gray-200 rounded"></div>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-lg animate-pulse">
            <div className="h-6 w-48 bg-gray-200 rounded mb-4"></div>
            <div className="h-96 w-full bg-gray-200 rounded"></div>
          </div>
        </div>
      ) : (
        <>
          <div className="bg-white p-8 rounded-2xl shadow-lg mb-8 transition-all duration-300">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              Doanh Thu Theo Ngày
            </h2>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={filteredData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="_id" stroke="#6b7280" fontSize={14} />
                  <YAxis stroke="#6b7280" fontSize={14} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 14, paddingTop: 10 }} />
                  <Bar
                    dataKey="totalRevenue"
                    fill="#3b82f6"
                    name="Doanh thu (VNĐ)"
                    radius={[4, 4, 0, 0]}
                    barSize={30}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg transition-all duration-300">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              Lịch Hẹn Theo Ngày
            </h2>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={filteredData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="_id" stroke="#6b7280" fontSize={14} />
                  <YAxis stroke="#6b7280" fontSize={14} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 14, paddingTop: 10 }} />
                  <Line
                    type="monotone"
                    dataKey="totalAppointments"
                    stroke="#ec4899"
                    name="Lịch hẹn"
                    strokeWidth={3}
                    dot={{ r: 5, fill: "#ec4899" }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out;
        }
        @keyframes pulseOnce {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
          100% {
            transform: scale(1);
          }
        }
        .animate-pulse-once {
          animation: pulseOnce 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
