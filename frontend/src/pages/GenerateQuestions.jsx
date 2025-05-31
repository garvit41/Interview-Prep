// import { useEffect, useState } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { generateQuestions } from "../services/jobService";

const GenerateQuestions = () => {
	const { jobId } = useParams(); // Job ID from URL
	const [questions, setQuestions] = useState([]);
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState("");

	const handleGenerate = async () => {
		setLoading(true);
		setMessage("");
		try {
			const data = await generateQuestions(jobId);
			setQuestions(data.questions);
			setMessage("Questions generated successfully!");
		} catch (error) {
			setMessage("Failed to generate questions.", error);
		}
		setLoading(false);
	};

	return (
		<div className="min-h-screen bg-gray-100 p-6 flex justify-center items-center">
			<div className="bg-white p-6 rounded-lg shadow-md max-w-lg w-full">
				<h2 className="text-2xl font-semibold text-center mb-4">Generate Interview Questions</h2>
				{message && <p className="text-center text-green-500">{message}</p>}
				<button onClick={handleGenerate} disabled={loading} className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
					{loading ? "Generating..." : "Generate Questions"}
				</button>
				<ul className="mt-4">
					{questions.map((q, index) => (
						<li key={index} className="p-2 border-b">
							{q}
						</li>
					))}
				</ul>
			</div>
		</div>
	);
};

export default GenerateQuestions;
