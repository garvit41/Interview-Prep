import axios from "axios";

const API_URL = "https://interviewprep-platform-backend.onrender.com/api/user";

export const getUserProfile = async (logoutFn) => {
	try {
		const token = localStorage.getItem("token");
		const response = await axios.get(`${API_URL}/profile`, {
			headers: { Authorization: `Bearer ${token}` },
		});
		return response.data;
	} catch (error) {
		if (error.response?.status === 401 || error.response?.status === 403 || error.code === "ERR_NETWORK") {
			if (logoutFn) logoutFn(); // ✅ logout if server down or token invalid
		}
		throw error.response?.data?.message || "Failed to fetch user profile.";
	}
};

// 🔹 Update User Profile
export const updateUserProfile = async (updatedData) => {
	try {
		const token = localStorage.getItem("token");
		const response = await axios.put(`${API_URL}/update`, updatedData, {
			headers: { Authorization: `Bearer ${token}` },
		});
		return response.data;
	} catch (error) {
		throw error.response?.data?.message || "Failed to update profile.";
	}
};
