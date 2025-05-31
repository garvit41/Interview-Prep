import axios from "axios";

const API_URL = "https://interviewprep-platform-backend.onrender.com/api/jobs";
const APPLICATION_URL = "https://interviewprep-platform-backend.onrender.com/api/applications";

//  Create/Post a Job
export const createJob = async (jobData) => {
	try {
		const token = localStorage.getItem("token");
		const response = await axios.post(API_URL, jobData, {
			headers: { Authorization: `Bearer ${token}` },
		});
		return response.data;
	} catch (error) {
		throw error.response?.data?.message || "Failed to post job!";
	}
};

//  Fetch All Jobs
export const getJobs = async () => {
	try {
		const response = await axios.get(API_URL);
		return response.data.jobs;
	} catch (error) {
		throw error.response?.data?.message || "Failed to fetch jobs!";
	}
};

//  Fetch Job by ID
export const getJobById = async (jobId) => {
	try {
		const response = await axios.get(`${API_URL}/${jobId}`);
		return response.data.job;
	} catch (error) {
		throw error.response?.data?.message || "Failed to fetch job!";
	}
};

//  Apply for a Job (with file upload)
export const applyForJob = async (formData) => {
	try {
		const token = localStorage.getItem("token");
		const response = await axios.post(`${APPLICATION_URL}/apply`, formData, {
			headers: {
				"Content-Type": "multipart/form-data",
				Authorization: `Bearer ${token}`,
			},
		});
		return response.data;
	} catch (error) {
		throw error.response?.data?.message || "Failed to apply!";
	}
};

//  Get Jobs Posted by Logged-in Recruiter
export const getMyJobs = async () => {
	try {
		const token = localStorage.getItem("token");
		const response = await axios.get(`${API_URL}/my-jobs`, {
			headers: { Authorization: `Bearer ${token}` },
		});
		return response.data.jobs;
	} catch (error) {
		throw error.response?.data?.message || "Failed to fetch jobs!";
	}
};

//  Delete a Job
export const deleteJob = async (jobId) => {
	try {
		const token = localStorage.getItem("token");
		await axios.delete(`${API_URL}/${jobId}`, {
			headers: { Authorization: `Bearer ${token}` },
		});
	} catch (error) {
		throw error.response?.data?.message || "Failed to delete job!";
	}
};

//  Update a Job
export const updateJob = async (jobId, updatedData) => {
	try {
		const token = localStorage.getItem("token");
		const response = await axios.put(`${API_URL}/${jobId}`, updatedData, {
			headers: { Authorization: `Bearer ${token}` },
		});
		return response.data;
	} catch (error) {
		throw error.response?.data?.message || "Failed to update job!";
	}
};

//  Generate Interview Questions via Gemini API
export const generateQuestions = async (jobId) => {
	try {
		const token = localStorage.getItem("token");
		const response = await axios.get(`${API_URL}/generate-questions/${jobId}`, {
			headers: { Authorization: `Bearer ${token}` },
		});
		return response.data;
	} catch (error) {
		throw error.response?.data?.message || "Failed to generate questions!";
	}
};
