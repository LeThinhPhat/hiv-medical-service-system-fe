import axios from "axios";

const API_URL = "http://localhost:3000/prescribedRegiments/suggest";

// Gợi ý phát đồ điều trị ARV dựa trên treatmentID
const suggestRegimen = async (token, treatmentID) => {
  try {
    const response = await axios.post(
      API_URL,
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
      "❌ Lỗi khi gọi gợi ý phát đồ:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export default {
  suggestRegimen,
};
