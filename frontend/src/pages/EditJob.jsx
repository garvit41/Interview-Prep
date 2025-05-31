import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getJobById, updateJob } from "../services/jobService";

const EditJob = () => {
	const { id } = useParams(); // Job ID from URL
	const navigate = useNavigate();
	const [job, setJob] = useState({ title: "", description: "", location: "", salary: "" });
	const [message, setMessage] = useState("");

	useEffect(() => {
		const fetchJob = async () => {
			try {
				const data = await getJobById(id);
				setJob(data);
			} catch (error) {
				setMessage("Error fetching job details.", error);
			}
		};

		fetchJob();
	}, [id]);

	const handleChange = (e) => {
		setJob({ ...job, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			await updateJob(id, job);
			setMessage("Job updated successfully!");
			setTimeout(() => navigate("/my-jobs"), 2000);
		} catch (error) {
			setMessage("Failed to update job.", error);
		}
	};

	return (
		<div className="min-h-screen bg-gray-100 p-6 flex justify-center items-center">
			<div className="bg-white p-6 rounded-lg shadow-md max-w-lg w-full">
				<h2 className="text-2xl font-semibold text-center mb-4">Edit Job</h2>
				{message && <p className="text-center text-green-500">{message}</p>}
				<form onSubmit={handleSubmit} className="space-y-4">
					<input
						type="text"
						name="title"
						placeholder="Job Title"
						className="w-full p-2 border rounded"
						value={job.title}
						onChange={handleChange}
						required
					/>
					<textarea
						name="description"
						placeholder="Job Description"
						className="w-full p-2 border rounded"
						value={job.description}
						onChange={handleChange}
						required
					/>
					<input
						type="text"
						name="location"
						placeholder="Location"
						className="w-full p-2 border rounded"
						value={job.location}
						onChange={handleChange}
						required
					/>
					<input
						type="number"
						name="salary"
						placeholder="Salary"
						className="w-full p-2 border rounded"
						value={job.salary}
						onChange={handleChange}
						required
					/>

					<button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
						Update Job
					</button>
				</form>
			</div>
		</div>
	);
};

export default EditJob;
