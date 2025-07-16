const BASE_URL = "http://localhost:3000";

const paymentService =  {
  createPayment: async (paymentData) => {
    try {
      const token = localStorage.getItem("token");
      console.log("Creating payment with data:", paymentData);
      const response = await fetch(`${BASE_URL}/payments/vnpay-url`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(paymentData),
      });
      const result = await response.json();

      if (!response.ok || result.statusCode !== 201) {
        throw new Error(result.message || "Failed to create payment");
      }
      console.log("Payment created successfully:", result);
      return result.data;

    } catch (error) {
      console.error("Error creating payment:", error);
      throw error;
    }
  },
  fundWallet: async (data) => { 
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${BASE_URL}/payments/fund-wallet`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount: data.amount }), // Sử dụng 'amount' theo yêu cầu API
      });

      const result = await response.json();

      if (!response.ok || result.statusCode !== 201) {
        throw new Error(result.message || "Failed to fund wallet");
      }

      return result.data; // Trả về dữ liệu từ response
    } catch (error) {
      console.error("Error funding wallet:", error.message);
      throw error;
    }
  },
    payWithWallet: async (data) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${BASE_URL}/payments/wallet`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data), // data là { appointmentID: "..." }
    });

    const result = await response.json();

    if (!response.ok || result.statusCode !== 201) {
      throw new Error(result.message || "Failed to pay with wallet");
    }

    // ✅ Dùng đúng ID để redirect
    window.location.href = `/payments/vnpay-return?vnp_TxnRef=${data.appointmentID}`;
  } catch (error) {
    console.error("Error paying with wallet:", error.message);
    throw error;
  }
},
getPatientTransactions: async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${BASE_URL}/payments/patient-transactions`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (!response.ok || result.statusCode !== 200) {
        throw new Error(result.message || "Failed to fetch patient transactions");
      }

      return result.data;
    } catch (error) {
      console.error("Error fetching patient transactions:", error);
      throw error;
    }
  },
};
export default paymentService;