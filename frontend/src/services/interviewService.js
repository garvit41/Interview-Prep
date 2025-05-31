import axios from "axios";

const API_URL = "https://interviewprep-platform-backend.onrender.com/api/interviews";

// 🔹 Schedule Interview
export const scheduleInterview = async (applicationId, date) => {
	try {
		const token = localStorage.getItem("token");
		console.log(token);
		const response = await axios.post(`${API_URL}/schedule`, { applicationId, date }, { headers: { Authorization: `Bearer ${token}` } });
		return response.data;
	} catch (error) {
		console.error("error:", error);
		throw error.response?.data?.message || "Failed to schedule interview!";
	}
};

// 🔹 Get Candidate Interviews
export const getCandidateInterviews = async () => {
	try {
		const token = localStorage.getItem("token");
		const response = await axios.get(`${API_URL}/candidate`, {
			headers: { Authorization: `Bearer ${token}` },
		});
		return response.data.interviews;
	} catch (error) {
		throw error.response?.data?.message || "Failed to fetch interviews!";
	}
};

// get recruiter interviews
export const getRecruiterInterviews = async () => {
	const token = localStorage.getItem("token");
	const response = await axios.get(`${API_URL}/recruiter`, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
	return response.data.interviews;
};

export const getInterviewByChatRoom = async (chatRoomId) => {
	const token = localStorage.getItem("token");
	const res = await axios.get(`${API_URL}/by-room/${chatRoomId}`, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
	return res.data;
};
