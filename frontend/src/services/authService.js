import axios from "axios";

const API_URL = "https://interviewprep-platform-backend.onrender.com/api/auth"; // Backend base URL

// 🔹 Signup Function
export const signup = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/signup`, userData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Signup failed!";
  }
};

// 🔹 Login Function
export const login = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/login`, userData);
    if (response.data.token) {
      localStorage.setItem("token", response.data.token); // Save token in local storage
    }
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Login failed!";
  }
};

// 🔹 Logout Function
export const logout = () => {
  localStorage.removeItem("token"); // Remove token
};

// 🔹 Forgot Password
export const forgotPassword = async (email) => {
  try {
    const response = await axios.post(`${API_URL}/forgot-password`, { email });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to send reset email!";
  }
};

// 🔹 Reset Password
export const resetPassword = async (token, newPassword) => {
  try {
    const response = await axios.post(`${API_URL}/reset-password/${token}`, { newPassword });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Password reset failed!";
  }
};
