import { useState } from "react";
import { createJob } from "../services/jobService";
import { useNavigate } from "react-router-dom";

const PostJob = () => {
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [location, setLocation] = useState("");
	const [salary, setSalary] = useState("");
	const [questions, setQuestions] = useState([{ content: "", difficulty: "easy" }]);
	const [message, setMessage] = useState("");
	const navigate = useNavigate();

	const handleAddQuestion = () => {
		setQuestions([...questions, { content: "", difficulty: "easy" }]);
	};

	const handleQuestionChange = (index, field, value) => {
		const updatedQuestions = [...questions];
		updatedQuestions[index][field] = value;
		setQuestions(updatedQuestions);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			await createJob({ title, description, location, salary, questions });
			setMessage("Job posted successfully!");
			setTimeout(() => navigate("/my-jobs"), 2000);
		} catch (error) {
			setMessage("Failed to post job.", error);
		}
	};

	return (
		<div className="min-h-screen bg-gray-100 p-6 flex justify-center items-center">
			<div className="bg-white p-6 rounded-lg shadow-md max-w-lg w-full">
				<h2 className="text-2xl font-semibold text-center mb-4">Post a New Job</h2>
				{message && <p className="text-center text-green-500">{message}</p>}
				<form onSubmit={handleSubmit} className="space-y-4">
					<input
						type="text"
						placeholder="Job Title"
						className="w-full p-2 border rounded"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						required
					/>
					<textarea
						placeholder="Job Description"
						className="w-full p-2 border rounded"
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						required
					/>
					<input
						type="text"
						placeholder="Location"
						className="w-full p-2 border rounded"
						value={location}
						onChange={(e) => setLocation(e.target.value)}
						required
					/>
					<input
						type="number"
						placeholder="Salary"
						className="w-full p-2 border rounded"
						value={salary}
						onChange={(e) => setSalary(e.target.value)}
						required
					/>

					<h3 className="text-lg font-semibold">Interview Questions</h3>
					{questions.map((q, index) => (
						<div key={index} className="flex gap-2">
							<input
								type="text"
								placeholder="Question"
								className="w-full p-2 border rounded"
								value={q.content}
								onChange={(e) => handleQuestionChange(index, "content", e.target.value)}
								required
							/>
							<select
								className="p-2 border rounded"
								value={q.difficulty}
								onChange={(e) => handleQuestionChange(index, "difficulty", e.target.value)}
							>
								<option value="easy">Easy</option>
								<option value="medium">Medium</option>
								<option value="hard">Hard</option>
							</select>
						</div>
					))}
					<button type="button" className="w-full bg-gray-500 text-white p-2 rounded hover:bg-gray-600" onClick={handleAddQuestion}>
						+ Add Question
					</button>

					<button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
						Post Job
					</button>
				</form>
			</div>
		</div>
	);
};

export default PostJob;
