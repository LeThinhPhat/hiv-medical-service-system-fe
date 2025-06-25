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
};

export default paymentService;