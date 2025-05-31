import axios from "axios";

const API_URL = "https://interviewprep-platform-backend.onrender.com/api/applications";

// ✅ Apply for a Job
export const applyForJob = async (jobId) => {
	try {
		const token = localStorage.getItem("token");
		const response = await axios.post(
			`${API_URL}/apply`,
			{ jobId },
			{ headers: { Authorization: `Bearer ${token}` } }
		);
		return response.data;
	} catch (error) {
		throw error.response?.data?.message || "Failed to apply!";
	}
};

// 🔹 Get All Applications for Recruiter
export const getRecruiterApplications = async () => {
	try {
		const token = localStorage.getItem("token");
		const response = await axios.get(`${API_URL}/recruiter`, {
			headers: { Authorization: `Bearer ${token}` },
		});
		return response.data;
	} catch (error) {
		throw error.response?.data?.message || "Failed to fetch applications!";
	}
};

// ✅ Update Application Status
export const updateApplicationStatus = async (applicationId, status) => {
	try {
		const token = localStorage.getItem("token");
		const response = await axios.put(
			`${API_URL}/${applicationId}/status`,
			{ status },
			{ headers: { Authorization: `Bearer ${token}` } }
		);

		if (response.status !== 200) {
			throw new Error("Unexpected response from server");
		}

		return response.data;
	} catch (error) {
		console.error("❌ Axios Error:", error.response?.data || error.message);
		throw error.response?.data?.message || "Failed to update status!";
	}
};

// 🔹 Get Applications for Current User
export const getMyApplications = async () => {
	try {
		const token = localStorage.getItem("token");
		const response = await axios.get(`${API_URL}/status`, {
			headers: { Authorization: `Bearer ${token}` },
		});
		return response.data.applications;
	} catch (error) {
		throw error.response?.data?.message || "Failed to fetch applications!";
	}
};

// 📊 Get Job-wise Statistics
export const getJobWiseStats = async () => {
	const token = localStorage.getItem("token");
	const response = await axios.get(`${API_URL}/recruiter/job-stats`, {
		headers: { Authorization: `Bearer ${token}` },
	});
	return response.data.stats;
};

// 📊 Get Applications Stats by Job
export const getApplicationsStatsByJob = async () => {
	try {
		const token = localStorage.getItem("token");
		const response = await axios.get(`${API_URL}/stats-by-job`, {
			headers: { Authorization: `Bearer ${token}` },
		});
		return response.data.stats;
	} catch (error) {
		throw error.response?.data?.message || "Failed to fetch stats!";
	}
};

// 📈 Get Overall Application Trend
export const getApplicationTrend = async () => {
	const token = localStorage.getItem("token");
	const res = await axios.get(`${API_URL}/trend`, {
		headers: { Authorization: `Bearer ${token}` },
	});
	return res.data.trend;
};

// 📈 Get Applications Count by Job Title
export const getApplicationsByJobTitle = async () => {
	try {
		const token = localStorage.getItem("token");
		const response = await axios.get(`${API_URL}/job-application-counts`, {
			headers: { Authorization: `Bearer ${token}` },
		});
		return response.data.stats;
	} catch (error) {
		throw error.response?.data?.message || "Failed to fetch application counts!";
	}
};

// 📈 Get My Application Trend
export const getMyApplicationTrend = async () => {
	const token = localStorage.getItem("token");
	const res = await axios.get(`${API_URL}/my/trend`, {
		headers: { Authorization: `Bearer ${token}` },
	});
	return res.data.trend;
};

// 🔎 Get Candidate Status Breakdown
export const getCandidateStatusBreakdown = async () => {
	const token = localStorage.getItem("token");
	const res = await axios.get(`${API_URL}/candidate/status-breakdown`, {
		headers: { Authorization: `Bearer ${token}` },
	});
	return res.data.statusBreakdown;
};

// 🔎 Get Candidate Application Timeline
export const getCandidateApplicationTimeline = async () => {
	const token = localStorage.getItem("token");
	const res = await axios.get(`${API_URL}/candidate/timeline`, {
		headers: { Authorization: `Bearer ${token}` },
	});
	return res.data.timeline;
};
