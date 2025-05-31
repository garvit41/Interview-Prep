import { useEffect, useState } from "react";
import { getMyApplications } from "../services/applicationService";

const AppliedJobs = () => {
    const [applications, setApplications] = useState([]);

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const data = await getMyApplications();
                setApplications(data);
            } catch (error) {
                console.error("Error fetching applications:", error);
            }
        };

        fetchApplications();
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <h2 className="text-3xl font-semibold text-center mb-6">My Applied Jobs</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {applications.length === 0 ? (
                    <p className="text-gray-600">You haven't applied for any jobs yet.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {applications.map((app) => (
                            <div key={app._id} className="bg-gray-200 p-4 rounded-lg shadow">
                                <h4 className="text-xl font-semibold">
                                    {app.job?.title || "No Job Title"}
                                </h4>
                                <p className="text-gray-700">
                                    Recruiter: {app.job?.recruiter?.name || "Unknown"}
                                </p>
                                <p className="text-sm text-gray-500">
                                    Status: <span className="font-semibold">{app.status}</span>
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AppliedJobs;
