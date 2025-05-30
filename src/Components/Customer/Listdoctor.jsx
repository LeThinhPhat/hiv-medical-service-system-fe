import React from "react";
import { Link } from "react-router-dom";

const doctors = [
  {
    id: 1,
    name: "Dr. Nguyễn Văn A",
    specialty: "Khoa Nội Tổng Quát",
    avatar: "https://nguoinoitieng.tv/images/nnt/107/0/bjur.jpg",
  },
  {
    id: 2,
    name: "Dr. Trần Thị B",
    specialty: "Khoa Nhi",
    avatar: "https://nguoinoitieng.tv/images/nnt/107/0/bjur.jpg",
  },
  {
    id: 3,
    name: "Dr. Lê Văn C",
    specialty: "Khoa Da Liễu",
    avatar: "https://nguoinoitieng.tv/images/nnt/107/0/bjur.jpg",
  },
  {
    id: 4,
    name: "Dr. Phạm Thị D",
    specialty: "Khoa Chấn Thương",
    avatar: "https://nguoinoitieng.tv/images/nnt/107/0/bjur.jpg",
  },
];

const ListDoctor = () => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
        Danh Sách Bác Sĩ
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {doctors.map((doctor) => (
          <div
            key={doctor.id}
            className="flex flex-col items-center p-6 rounded-lg bg-white shadow-md border border-gray-200 hover:shadow-lg transition-all duration-300"
          >
            <img
              src={doctor.avatar}
              alt={doctor.name}
              className="w-24 h-24 rounded-full mb-4"
            />
            <h3 className="text-lg font-semibold text-gray-800">
              {doctor.name}
            </h3>
            <p className="text-sm text-gray-600">{doctor.specialty}</p>
            <Link
              to={`/news/${doctor.id}`}
              className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all text-center"
            >
              Xem Chi Tiết
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListDoctor;
