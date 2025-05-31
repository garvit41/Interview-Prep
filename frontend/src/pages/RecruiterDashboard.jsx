// RecruiterDashboard.jsx
import { useEffect, useState } from "react";
import {
	getRecruiterApplications,
	updateApplicationStatus,
	getJobWiseStats,
	getApplicationTrend,
	getApplicationsByJobTitle,
} from "../services/applicationService";
import { getRecruiterInterviews } from "../services/interviewService.js";
import { Link } from "react-router-dom";
import StatusPieChart from "../Components/StatusPieChart";
import JobBarChart from "../Components/JobBarChart";
import ApplicationTrendChart from "../Components/ApplicationTrendChart";
import ApplicationsBarChart from "../Components/ApplicationsBarChart";

const RecruiterDashboard = () => {
	const [jobApplicationCounts, setJobApplicationCounts] = useState([]);
	const [trendData, setTrendData] = useState([]);
	const [applications, setApplications] = useState([]);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(true);
	const [jobStats, setJobStats] = useState([]);
	const [interviews, setInterviews] = useState([]);

	useEffect(() => {
		const fetchApplications = async () => {
			try {
				const data = await getRecruiterApplications();
				if (data.success && Array.isArray(data.applications)) {
					setApplications(data.applications);
					setError(null);
				} else {
					setError("No applications found.");
					setApplications([]);
				}
			} catch (error) {
				console.error("Error fetching applications:", error);
				setError("Failed to load applications. Please try again later.");
			} finally {
				setLoading(false);
			}
		};

		const fetchStats = async () => {
			const stats = await getJobWiseStats();
			setJobStats(stats);
		};

		const fetchTrendData = async () => {
			try {
				const res = await getApplicationTrend();
				setTrendData(res.trend || []);
			} catch (error) {
				console.error("Error fetching trend data:", error);
			}
		};

		const fetchJobApplicationCounts = async () => {
			try {
				const res = await getApplicationsByJobTitle();
				setJobApplicationCounts(res);
			} catch (error) {
				console.error("Error fetching job application counts:", error);
			}
		};

		fetchJobApplicationCounts();
		fetchApplications();
		fetchStats();
		fetchTrendData();
	}, []);

	useEffect(() => {
		const fetchRecruiterInterviews = async () => {
			try {
				const data = await getRecruiterInterviews();
				setInterviews(data);
			} catch (err) {
				console.error("Failed to load recruiter interviews", err);
			}
		};

		fetchRecruiterInterviews();
	}, []);

	const handleStatusChange = async (id, status) => {
		try {
			const res = await updateApplicationStatus(id, status);
			console.log("Status Update Response:", res);

			// Optimistic UI update
			setApplications((prev) => prev.map((app) => (app._id === id ? { ...app, status: status } : app)));
		} catch (error) {
			console.error("Failed to update status:", error);
			setError("Failed to update application status.");
		}
	};

	return (
		<div className="min-h-screen bg-gray-100 p-6">
			<h2 className="text-3xl font-semibold text-center mb-6">Recruiter Dashboard</h2>

			{error && <div className="bg-red-200 text-red-800 p-3 rounded mb-4">{error}</div>}

			<div className="flex justify-end mb-6">
				<Link to="/my-jobs" className="bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600 transition">
					Manage My Jobs
				</Link>
			</div>

			{loading ? (
				<p className="text-center text-gray-500">Loading applications...</p>
			) : applications.length === 0 ? (
				<p className="text-center text-gray-500">No applications found.</p>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{applications.map((app) => (
						<div key={app._id} className="bg-white p-4 rounded-lg shadow-md">
							<h3 className="text-xl font-semibold">{app.candidate?.name || "Unknown Candidate"}</h3>
							<p className="text-gray-700">Job: {app.job?.title || "Unknown"}</p>
							<p className="text-sm text-gray-500">Status: {app.status}</p>

							{app.resume && (
								<a
									href={`https://interviewprep-platform-backend.onrender.com/${app.resume.replace(/\\/g, "/")}`}
									target="_blank"
									rel="noopener noreferrer"
									className="block mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-center"
								>
									View Resume
								</a>
							)}

							{app.status === "Pending" && (
								<>
									<button
										onClick={() => handleStatusChange(app._id, "Selected")}
										className="mt-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
									>
										Accept
									</button>
									<button
										onClick={() => handleStatusChange(app._id, "Rejected")}
										className="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 ml-2"
									>
										Reject
									</button>
								</>
							)}

							{app.status === "Selected" && (
								<Link
									to={`/schedule-interview/${app._id}`}
									className="mt-2 block text-center bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
								>
									Schedule Interview
								</Link>
							)}
						</div>
					))}
				</div>
			)}

			{/* My Scheduled Interviews */}
			<h3 className="text-2xl font-semibold mt-10 mb-4 text-center">My Scheduled Interviews</h3>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{interviews.length === 0 ? (
					<p className="text-center text-gray-600 w-full">No scheduled interviews yet.</p>
				) : (
					interviews.map((interview) => (
						<div key={interview._id} className="bg-white p-4 rounded-lg shadow-md">
							<h4 className="text-xl font-semibold">{interview.job?.title}</h4>
							<p className="text-gray-700">Candidate: {interview.candidate?.name}</p>
							<p className="text-sm text-gray-500">Scheduled on: {new Date(interview.date).toLocaleString()}</p>
							<a
								href={`/livechat/${interview.chatRoomId}`}
								className="mt-2 block text-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
							>
								Join Interview
							</a>
						</div>
					))
				)}
			</div>

			{/* ---------------- CHARTs ------------------- */}
			<div className="my-15 flex flex-col md:flex-row gap-8 px-6">
				{/* Pie Chart Box */}
				<div className="w-full md:w-1/2 bg-white rounded-lg shadow-lg p-6">
					<StatusPieChart
						stats={{
							Pending: applications.filter((app) => app.status === "Pending").length,
							Selected: applications.filter((app) => app.status === "Selected").length,
							Rejected: applications.filter((app) => app.status === "Rejected").length,
						}}
					/>
				</div>

				{/* Bar Chart Box */}
				<div className="w-full md:w-1/2 bg-white rounded-lg shadow-lg p-6">
					{jobApplicationCounts.length > 0 && <ApplicationsBarChart stats={jobApplicationCounts} />}
				</div>
			</div>
		</div>
	);
};

export default RecruiterDashboard;
