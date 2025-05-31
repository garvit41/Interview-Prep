import { useEffect, useState } from "react";
import { getCandidateInterviews } from "../services/interviewService";
import { getMyApplications, getCandidateStatusBreakdown, getCandidateApplicationTimeline } from "../services/applicationService";
import StatusPieChart from "../Components/StatusPieChart";
import ApplicationTimelineChart from "../Components/ApplicationTimelineChart";

const CandidateDashboard = () => {
	const [interviews, setInterviews] = useState([]);
	const [applications, setApplications] = useState([]);
	const [statusBreakdown, setStatusBreakdown] = useState({});
	const [applicationTimeline, setApplicationTimeline] = useState([]);

	useEffect(() => {
		const fetchInterviews = async () => {
			try {
				const data = await getCandidateInterviews();
				setInterviews(data);
			} catch (error) {
				console.error("Error fetching interviews:", error);
			}
		};

		const fetchApplications = async () => {
			try {
				const data = await getMyApplications();
				setApplications(data);
				console.log("fetched applications : ", data);
			} catch (error) {
				console.error("Error fetching applications:", error);
			}
		};

		const fetchStatusBreakdown = async () => {
			const res = await getCandidateStatusBreakdown();
			setStatusBreakdown(res);
		};

		const fetchTimeline = async () => {
			const res = await getCandidateApplicationTimeline();
			setApplicationTimeline(res);
		};

		fetchStatusBreakdown();
		fetchTimeline();
		fetchInterviews();
		fetchApplications();
	}, []);

	return (
		<div className="min-h-screen bg-gray-100 p-6">
			<h2 className="text-3xl font-semibold text-center mb-6">Candidate Dashboard</h2>

			<StatusPieChart stats={statusBreakdown} />
			<ApplicationTimelineChart trendData={applicationTimeline} />

			{/* My Applied Jobs Section */}
			<div className="bg-white p-6 rounded-lg shadow-md mb-6">
				<h3 className="text-2xl font-semibold mb-4">My Applied Jobs</h3>
				{applications.length === 0 ? (
					<p className="text-gray-600">You haven't applied for any jobs yet.</p>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{applications.map((app) => (
							<div key={app._id} className="bg-gray-200 p-4 rounded-lg shadow">
								<h4 className="text-xl font-semibold">{app.job.title}</h4>
								<p className="text-gray-700">Recruiter: {app.job.recruiter.name}</p>
								<p className="text-sm text-gray-500">
									Status: <span className="font-semibold">{app.status}</span>
								</p>
							</div>
						))}
					</div>
				)}
			</div>

			{/*  My Scheduled Interviews Section */}
			<h3 className="text-2xl font-semibold mb-4 text-center">My Scheduled Interviews</h3>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{interviews.length === 0 ? (
					<p className="text-center text-gray-600 w-full">No scheduled interviews yet.</p>
				) : (
					interviews.map((interview) => (
						<div key={interview._id} className="bg-white p-4 rounded-lg shadow-md">
							<h4 className="text-xl font-semibold">{interview.job.title}</h4>
							<p className="text-gray-700">Recruiter: {interview.recruiter.name}</p>
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
		</div>
	);
};

export default CandidateDashboard;
