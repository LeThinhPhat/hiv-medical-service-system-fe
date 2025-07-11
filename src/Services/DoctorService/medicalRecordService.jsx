// import axios from "axios";

// const API_URL = "http://localhost:3000/medicalrecords";

// const medicalRecordService = {
//   // ✅ Tạo hồ sơ bệnh án
//   createMedicalRecord: async (data) => {
//     try {
//       const token = localStorage.getItem("token");

//       const payload = {
//         patientID: data.patientID,
//         diagnosis: data.diagnosis,
//         symptoms: data.symptoms,
//         clinicalNotes: data.clinicalNotes,
//         createdBy: data.createdBy,
//       };

//       const response = await axios.post(API_URL, payload, {
//         headers: {
//           Accept: "*/*",
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       return response.data;
//     } catch (error) {
//       console.error("Lỗi tạo hồ sơ bệnh án:", error);
//       throw error;
//     }
//   },

//   // ✅ Lấy tất cả hồ sơ bệnh án
//   getAllMedicalRecords: async () => {
//     try {
//       const token = localStorage.getItem("token");

//       const response = await axios.get(API_URL, {
//         headers: {
//           Accept: "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       return response.data.data;
//     } catch (error) {
//       console.error("Lỗi lấy danh sách hồ sơ bệnh án:", error);
//       throw error;
//     }
//   },

//   // ✅ Lấy hồ sơ bệnh án theo personalID
//   getMedicalRecordByPersonalID: async (personalId) => {
//     try {
//       const token = localStorage.getItem("token");

//       const response = await axios.get(`${API_URL}/personalID`, {
//         params: { personalId },
//         headers: {
//           Accept: "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       return response.data.data;
//     } catch (error) {
//       console.error("Lỗi lấy hồ sơ theo Personal ID:", error);
//       throw error;
//     }
//   },
// };

// export default medicalRecordService;

import axios from "axios";

const API_URL = "http://localhost:3000/medicalrecords";

const medicalRecordService = {
  // ✅ Tạo hồ sơ bệnh án
  createMedicalRecord: async (data) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Không tìm thấy token trong localStorage.");
      }

      const { patientID, serviceId, ...payload } = data;

      const response = await axios.post(
        `${API_URL}/${patientID}?serviceId=${serviceId}`,
        payload,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Lỗi tạo hồ sơ bệnh án:", error);
      throw error;
    }
  },

  // ✅ Lấy tất cả hồ sơ bệnh án
  getAllMedicalRecords: async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(API_URL, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data.data;
    } catch (error) {
      console.error("Lỗi lấy danh sách hồ sơ bệnh án:", error);
      throw error;
    }
  },

  // ✅ Lấy hồ sơ bệnh án theo personalID
  getMedicalRecordByPersonalID: async (personalId) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(`${API_URL}/personalID`, {
        params: { personalId },
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data.data;
    } catch (error) {
      console.error("Lỗi lấy hồ sơ theo Personal ID:", error);
      throw error;
    }
  },
};

export default medicalRecordService;
