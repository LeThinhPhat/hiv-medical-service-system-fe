// import React, { useState } from "react";
// import { Link } from "react-router-dom";

// const doctors = [
//   {
//     id: 1,
//     name: "Dr. Nguyễn Văn A",
//     specialty: "Khoa Nội Tổng Quát",
//     avatar: "https://nguoinoitieng.tv/images/nnt/107/0/bjur.jpg",
//   },
//   {
//     id: 2,
//     name: "Dr. Trần Thị B",
//     specialty: "Khoa Nhi",
//     avatar: "https://nguoinoitieng.tv/images/nnt/107/0/bjur.jpg",
//   },
//   {
//     id: 3,
//     name: "Dr. Lê Văn C",
//     specialty: "Khoa Da Liễu",
//     avatar: "https://nguoinoitieng.tv/images/nnt/107/0/bjur.jpg",
//   },
//   {
//     id: 4,
//     name: "Dr. Phạm Thị D",
//     specialty: "Khoa Chấn Thương",
//     avatar: "https://nguoinoitieng.tv/images/nnt/107/0/bjur.jpg",
//   },
// ];

// const ListDoctor = () => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedDepartment, setSelectedDepartment] = useState("Tất cả bác sĩ");

//   const departments = [
//     "Khoa Nội Tổng Quát",
//     "Khoa Nhi",
//     "Khoa Da Liễu",
//     "Khoa Chấn Thương",
//   ];

//   const filteredDoctors = doctors.filter(
//     (doctor) =>
//       doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
//       (selectedDepartment === "Tất cả bác sĩ" ||
//         doctor.specialty === selectedDepartment)
//   );

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <header className="container mx-auto py-6">
//         <h1 className="text-3xl font-bold text-gray-800">
//           Đội ngũ bác sĩ chuyên khoa
//         </h1>
//         <p className="text-gray-600 mt-2">
//           <Link to="/" className="text-gray-600 hover:underline">
//             Trang chủ
//           </Link>{" "}
//           /<span className="text-gray-800"> Danh sách bác sĩ</span>
//         </p>
//       </header>

//       {/* Main Content */}
//       <main className="container mx-auto flex space-x-6">
//         {/* Sidebar */}
//         <aside className="w-1/4 bg-white p-4 rounded-lg shadow">
//           <div className="mb-4">
//             <input
//               type="text"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               placeholder="Tìm kiếm bác sĩ..."
//               className="w-full p-2 border rounded-lg"
//             />
//             <button className="w-full mt-2 bg-green-600 text-white p-2 rounded-lg">
//               Tìm kiếm
//             </button>
//           </div>
//           <div>
//             <button
//               onClick={() => setSelectedDepartment("Tất cả bác sĩ")}
//               className={`flex justify-between items-center w-full text-left py-2 border-b ${
//                 selectedDepartment === "Tất cả bác sĩ"
//                   ? "text-green-600"
//                   : "text-gray-600"
//               }`}
//             >
//               <span>Tất cả bác sĩ</span>
//               <svg
//                 className="w-4 h-4"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="M19 9l-7 7-7-7"
//                 />
//               </svg>
//             </button>
//             {departments.map((dept, index) => (
//               <button
//                 key={index}
//                 onClick={() => setSelectedDepartment(dept)}
//                 className={`flex justify-between items-center w-full text-left py-2 border-b ${
//                   selectedDepartment === dept
//                     ? "text-green-600"
//                     : "text-gray-600"
//                 }`}
//               >
//                 <span>{dept}</span>
//                 <svg
//                   className="w-4 h-4"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth="2"
//                     d="M19 9l-7 7-7-7"
//                   />
//                 </svg>
//               </button>
//             ))}
//           </div>
//         </aside>

//         {/* Doctor List */}
//         <section className="w-3/4">
//           <h2 className="text-xl font-semibold mb-4">{selectedDepartment}</h2>
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//             {filteredDoctors.map((doctor) => (
//               <div
//                 key={doctor.id}
//                 className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-all duration-300 border border-gray-200"
//               >
//                 <img
//                   src={doctor.avatar}
//                   alt={doctor.name}
//                   className="w-full h-40 object-cover rounded-lg mb-4"
//                 />
//                 <h3 className="text-lg font-semibold text-gray-800">
//                   {doctor.name}
//                 </h3>
//                 <p className="text-sm text-gray-600">{doctor.specialty}</p>
//                 <Link
//                   to={`/news/${doctor.id}`}
//                   className="mt-4 inline-block px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all"
//                 >
//                   Xem Chi Tiết
//                 </Link>
//               </div>
//             ))}
//           </div>
//         </section>
//       </main>

//       {/* Floating Buttons */}
//       <div className="fixed bottom-4 right-4 flex flex-col space-y-2">
//         <button className="bg-green-600 text-white p-3 rounded-full">
//           <svg
//             className="w-6 h-6"
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth="2"
//               d="M3 5h18M3 12h18M3 19h18"
//             />
//           </svg>
//         </button>
//         <button className="bg-yellow-400 text-white p-3 rounded-full">
//           <svg
//             className="w-6 h-6"
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth="2"
//               d="M8 10h.01M12 10h.01M16 10h.01M9 16h6M21 12c0 4.418-3.582 8-8 8s-8-3.582-8-8 3.582-8 8-8 8 3.582 8 8z"
//             />
//           </svg>
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ListDoctor;
