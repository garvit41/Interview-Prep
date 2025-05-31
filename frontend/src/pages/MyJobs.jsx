import { useEffect, useState } from "react";
import { getMyJobs, deleteJob } from "../services/jobService";
import { Link } from "react-router-dom";

const MyJobs = () => {
    const [jobs, setJobs] = useState([]);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const data = await getMyJobs();
                console.log("data ", data);
                setJobs(data);
            } catch (error) {
                console.error("Error fetching jobs:", error);
            }
        };

        fetchJobs();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this job?")) return;

        try {
            await deleteJob(id);
            setJobs((prevJobs) => prevJobs.filter((job) => job._id !== id));
        } catch (error) {
            console.error("Failed to delete job:", error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <h2 className="text-3xl font-semibold text-center mb-6">My Posted Jobs</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {jobs.length === 0 ? (
                    <p className="text-center text-gray-600 w-full">No jobs posted yet.</p>
                ) : (
                    jobs.map((job) => (
                        <div key={job._id} className="bg-white p-4 rounded-lg shadow-md">
                            <h3 className="text-xl font-semibold">{job.title}</h3>
                            <p className="text-gray-700">{job.description}</p>
                            <p className="text-sm text-gray-500">Location: {job.location}</p>
                            <p className="text-sm text-gray-500">Salary: ${job.salary}</p>
                            <div className="mt-2 flex gap-2">
                                <Link
                                    to={`/edit-job/${job._id}`}
                                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                >
                                    Edit
                                </Link>

                                <button
                                    onClick={() => handleDelete(job._id)}
                                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
            <Link
                to="/post-job"
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
                + Post New Job
            </Link>
        </div>
    );
};

export default MyJobs;
