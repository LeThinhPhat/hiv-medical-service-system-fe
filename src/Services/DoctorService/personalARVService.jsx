// // 📁 personalARVService.js (hoặc prescribedRegimenService.js)
// import axios from "axios";

// const BASE_URL = "http://localhost:3000/prescribedRegiments";

// // 🧠 Gợi ý phát đồ
// const suggestRegimen = async (token, treatmentID) => {
//   try {
//     const response = await axios.post(
//       `${BASE_URL}/suggest`,
//       { treatmentID },
//       {
//         headers: {
//           "Content-Type": "application/json",
//           Accept: "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );
//     return response.data;
//   } catch (error) {
//     console.error(
//       "❌ Lỗi khi gọi gợi ý phát đồ:",
//       error.response?.data || error.message
//     );
//     throw error;
//   }
// };

// // 🩺 Tạo phác đồ điều trị cá nhân hóa
// const createPrescribedRegimen = async (token, data) => {
//   try {
//     const response = await axios.post(BASE_URL, data, {
//       headers: {
//         "Content-Type": "application/json",
//         Accept: "*/*",
//         Authorization: `Bearer ${token}`,
//       },
//     });
//     return response.data;
//   } catch (error) {
//     console.error(
//       "❌ Lỗi khi tạo phác đồ cá nhân hóa:",
//       error.response?.data || error.message
//     );
//     throw error;
//   }
// };

// export default {
//   suggestRegimen,
//   createPrescribedRegimen,
// };

import axios from "axios";

const BASE_URL = "http://localhost:3000/prescribedRegiments";

// 🧠 Gợi ý phác đồ điều trị
const suggestRegimen = async (token, treatmentID) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/suggest`,
      { treatmentID },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "❌ Lỗi khi gọi gợi ý phác đồ:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// 🩺 Tạo phác đồ điều trị cá nhân hóa
const createPrescribedRegimen = async (token, data) => {
  try {
    const response = await axios.post(BASE_URL, data, {
      headers: {
        "Content-Type": "application/json",
        Accept: "*/*",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      "❌ Lỗi khi tạo phác đồ cá nhân hóa:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// 🔍 Lấy thông tin phác đồ theo ID
const getPrescribedRegimenById = async (token, regimenId) => {
  try {
    const response = await axios.get(`${BASE_URL}/${regimenId}`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      "❌ Lỗi khi lấy phác đồ theo ID:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export default {
  suggestRegimen,
  createPrescribedRegimen,
  getPrescribedRegimenById,
};
