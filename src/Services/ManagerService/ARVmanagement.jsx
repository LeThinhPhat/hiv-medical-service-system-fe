const BASE_URL = "http://localhost:3000";
const token = localStorage.getItem("token");

const ARVmanagementService = {
  getRegiments: async () => {
    try {
      const response = await fetch(`${BASE_URL}/regiments`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error fetching regiments: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Failed to get ARV regiments:", error);
      throw error;
    }
  },
  createRegiment: async (regimentData) => {
  try {
    const response = await fetch(`${BASE_URL}/regiments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(regimentData),
    });

    if (!response.ok) {
      throw new Error(`Error creating regimen: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to create ARV regimen:", error);
    throw error;
  }
},
updateRegiment: async (id, regimentData) => {
    try {
      const response = await fetch(`${BASE_URL}/regiments/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(regimentData),
      });

      if (!response.ok) {
        throw new Error(`Error updating regimen with ID ${id}: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Failed to update ARV regimen:", error);
      throw error;
    }
  },
 deleteRegiment: async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/regiments/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error deleting regimen with ID ${id}: ${response.status}`);
      }

      return true;
    } catch (error) {
      console.error("Failed to delete ARV regimen:", error);
      throw error;
    }
  },
};

export default ARVmanagementService;
