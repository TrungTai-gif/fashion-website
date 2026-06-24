import axios from "axios";

// API để get admin từ user service
export const getAdmin = async () => {
  try {
    const response = await axios.get("http://localhost:8001/api/users/admin");
    return response.data;
  } catch (error) {
    console.error("Error getting admin from user service:", error);
    throw error;
  }
};

// API để get user by ID từ user service
export const getUserById = async (userId) => {
  try {
    const response = await axios.get(
      `http://localhost:8001/api/users/${userId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error getting user by ID:", error);
    throw error;
  }
};