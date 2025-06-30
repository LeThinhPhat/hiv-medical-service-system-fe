const BASE_URL = "http://localhost:3000";

const UserService = {
    getUserInfo: async (userId) => {
        try {
            const token = localStorage.getItem("token"); 
            const response = await fetch(`${BASE_URL}/users/${userId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`, 
                },
            });

            if (!response.ok) {
                throw new Error("Không thể lấy thông tin người dùng");
            }

            const result = await response.json();
            console.log("Fetched user info:", result);
            return result.data;
        } catch (error) {
            console.error("Error fetching user info:", error);
            throw error;
        }
    },
};
export default UserService;