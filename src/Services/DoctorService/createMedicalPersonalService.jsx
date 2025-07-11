import axios from "axios";

const API_URL = "http://localhost:3000/medicalrecords";

const createMedicalPersonalService = async (personalId, data, token) => {
  try {
    const response = await axios.post(`${API_URL}/${personalId}`, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating medical record:", error);
    throw error;
  }
};

export default createMedicalPersonalService;

// import axios from "axios";

// const API_URL = "http://localhost:3000/medicalrecords";

// const createMedicalPersonalService = async (
//   personalId,
//   data,
//   token,
//   serviceId
// ) => {
//   try {
//     const response = await axios.post(
//       `${API_URL}/${personalId}/${serviceId}`,
//       data,
//       {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//           Accept: "application/json",
//         },
//       }
//     );
//     return response.data;
//   } catch (error) {
//     console.error("Error creating medical record:", error);
//     throw error;
//   }
// };

// export default createMedicalPersonalService;
