import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getJobById, applyForJob, generateQuestions } from "../services/jobService";

const JobDetails = () => {
    const { id } = useParams(); // Get job ID from URL
    const [job, setJob] = useState(null);
    const [resume, setResume] = useState(null);
    const [message, setMessage] = useState("");
    const [generatedQuestions, setGeneratedQuestions] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const data = await getJobById(id);
                setJob(data.job || data);
            } catch (error) {
                console.error("Error fetching job:", error);
            }
        };

        fetchJob();
    }, [id]);

    const handleApply = async () => {
        if (!resume) {
            setMessage("Please upload a resume!");
            return;
        }

        const formData = new FormData();
        formData.append("jobId", id);
        formData.append("resume", resume);

        console.log("Submitting application with data:", formData); // Log FormData

        try {
            await applyForJob(formData);
            setMessage("Application submitted successfully!");
            setResume(null); // Clear resume after successful submission
        } catch (error) {
            console.error("Error applying for job:", error); // Log error
            setMessage("Failed to apply. Try again!");
        }
    };

    const handleGenerateQuestions = async () => {
        setLoading(true);
        setMessage(""); // Clear previous messages
        try {
            const data = await generateQuestions(id);
            setGeneratedQuestions(data.questions);
            setMessage("Questions generated successfully!");
        } catch (error) {
            console.error("Error generating questions:", error); // Log error
            setMessage("Failed to generate questions.");
        }
        setLoading(false);
    };

    if (!job)
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-6">
            {/* Job Details Card */}
            <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
                {/* Header Section */}
                <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-8 text-white">
                    <h1 className="text-3xl font-bold">{job.title}</h1>
                    <p className="mt-2 text-lg">{job.description}</p>
                    <div className="flex items-center justify-between mt-4">
                        <span className="text-sm">📍 Location: {job.location}</span>
                        <span className="text-sm"> Salary: {job.salary} Rs</span>
                    </div>
                </div>

                {/* Main Content */}
                <div className="p-8">
                    {/* Interview Questions */}
                    <section className="mb-6">
                        <h2 className="text-xl font-semibold text-gray-800">Interview Questions</h2>
                        {job.questions.length > 0 ? (
                            <ul className="mt-3 space-y-2">
                                {job.questions.map((question) => (
                                    <li
                                        key={question._id}
                                        className="bg-gray-100 p-3 rounded-md text-gray-700"
                                    >
                                        {question.content}{" "}
                                        <span className="text-sm text-gray-500">
                                            (Difficulty: {question.difficulty})
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="mt-3 text-gray-600">
                                No questions available for this job.
                            </p>
                        )}
                    </section>

                    {/* Generate Questions Button */}
                    <section className="mb-6">
                        <button
                            onClick={handleGenerateQuestions}
                            disabled={loading}
                            className={`w-full py-3 rounded-lg font-semibold ${
                                loading
                                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                    : "bg-indigo-500 text-white hover:bg-indigo-600 transition duration-300"
                            }`}
                        >
                            {loading ? "Generating..." : "Generate More Questions"}
                        </button>
                        {message && (
                            <p
                                className={`mt-3 text-center ${
                                    message.includes("successfully")
                                        ? "text-green-600"
                                        : "text-red-600"
                                }`}
                            >
                                {message}
                            </p>
                        )}
                    </section>

                    {/* Generated Questions */}
                    {generatedQuestions.length > 0 && (
                        <section className="mb-6">
                            <h2 className="text-xl font-semibold text-gray-800">
                                Generated Interview Questions
                            </h2>
                            <ul className="mt-3 space-y-2">
                                {generatedQuestions.map((question, index) => (
                                    <li
                                        key={index}
                                        className="bg-gray-100 p-3 rounded-md text-gray-700"
                                    >
                                        {question}
                                    </li>
                                ))}
                            </ul>
                        </section>
                    )}

                    {/* Resume Upload and Apply Button */}
                    <section>
                        <label
                            htmlFor="resume"
                            className="block text-lg font-medium text-gray-800 mb-2"
                        >
                            Upload Resume:
                        </label>
                        <input
                            type="file"
                            id="resume"
                            onChange={(e) => {
                                if (e.target.files.length > 0) {
                                    console.log("Resume uploaded:", e.target.files[0].name); // Log uploaded file name
                                    setResume(e.target.files[0]);
                                }
                            }}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-indigo-200"
                        />
                        <button
                            onClick={handleApply}
                            className="mt-4 w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition duration-300 font-semibold"
                        >
                            Apply Now
                        </button>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default JobDetails;
