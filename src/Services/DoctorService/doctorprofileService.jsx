// import axios from "axios";

// // Tạo base URL
// const API_BASE_URL = "http://localhost:3000";

// const doctorprofileService = {
//   getDoctorById: async (id, token) => {
//     try {
//       console.log("id:", id, "token:", token);
//       const response = await axios.get(`${API_BASE_URL}/doctors/${id}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           Accept: "*/*",
//         },
//       });
//       console.log("API response:", response);
//       return response.data;
//     } catch (error) {
//       console.error("Error fetching doctor profile:", error);
//       throw error;
//     }
//   },
// };

// export default doctorprofileService;
// src/Services/DoctorService/profileService.jsx

// import axios from "axios";

// const API_URL = "http://localhost:3000/api/doctors"; // endpoint backend của bạn

// const doctorprofileService = {
//   getDoctorById: async (id) => {
//     try {
//       const response = await axios.get(`${API_URL}/${id}`);
//       return response.data.data; // ✅ chỉ trả về dữ liệu doctor
//     } catch (error) {
//       console.error("Lỗi khi lấy thông tin bác sĩ:", error);
//       throw error;
//     }
//   },
// };

// export default doctorprofileService;
// Services/DoctorService/doctorprofileService.jsx

import axios from "axios";

const API_URL = "http://localhost:3000/doctors/token";

const getDoctorProfile = async () => {
  const token = localStorage.getItem("token");
  console.log("Token đang dùng:", token);

  try {
    const response = await axios.post(
      API_URL,
      {},
      {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
          Accept: "application/json",
        },
      }
    );

    return response.data.data;
  } catch (error) {
    console.error(
      "Lỗi khi lấy thông tin bác sĩ:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export default {
  getDoctorProfile,
};
