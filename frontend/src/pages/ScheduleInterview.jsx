// import { useEffect, useState } from "react";
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { scheduleInterview } from "../services/interviewService";

const ScheduleInterview = () => {
	const { applicationId } = useParams(); // Get application ID from URL
  const navigate = useNavigate();
	const [date, setDate] = useState("");
	const [message, setMessage] = useState("");

	const handleSchedule = async () => {
		if (!date) {
			setMessage("Please select a date and time!");
			return;
		}

		try {
			await scheduleInterview(applicationId, date);
			setMessage("Interview scheduled successfully!");
			
			setTimeout(() => {
				navigate("/recruiter-dashboard");
			}, 500);
		} catch (error) {
			setMessage("Failed to schedule interview. Try again!", error);
		}
	};

	return (
		<div className="min-h-screen bg-gray-100 p-6 flex justify-center items-center">
			<div className="bg-white p-6 rounded-lg shadow-md max-w-md">
				<h2 className="text-2xl font-semibold text-center mb-4">Schedule Interview</h2>
				<input type="datetime-local" className="w-full p-2 border rounded mb-4" value={date} onChange={(e) => setDate(e.target.value)} />
				<button onClick={handleSchedule} className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
					Schedule
				</button>
				{message && <p className="mt-2 text-center text-green-500">{message}</p>}
			</div>
		</div>
	);
};

export default ScheduleInterview;
