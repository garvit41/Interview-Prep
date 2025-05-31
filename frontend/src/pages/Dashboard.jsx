// import { useEffect, useState } from "react";
// import { getJobs } from "../services/jobService";
// import {Link} from "react-router-dom";

// const Dashboard = () => {
//     const [jobs, setJobs] = useState([]);

//     useEffect(() => {
//         const fetchJobs = async () => {
//             try {
//                 const data = await getJobs();
//                 console.log("JOBS : ", data);
//                 setJobs(data);
//             } catch (error) {
//                 console.error("Error fetching jobs:", error);
//             }
//         };

//         fetchJobs();
//     }, []);

//     return (
//         <div className="min-h-screen bg-gray-100 p-6">
//             <h2 className="text-3xl font-semibold text-center mb-6">Job Listings</h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {jobs.map((job) => (
//                     <div key={job._id} className="bg-white p-4 rounded-lg shadow-md">
//                         <h3 className="text-xl font-semibold">{job.title}</h3>
//                         <p className="text-gray-700">{job.description}</p>
//                         <p className="text-sm text-gray-500">Location: {job.location}</p>
//                         <p className="text-sm text-gray-500">Salary: ${job.salary}</p>
//                         <button className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
//                             <Link
//                                 to={`/job/${job._id}`}
//                                 className="mt-2 block text-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//                             >
//                                 View Details
//                             </Link>
//                         </button>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// };

// export default Dashboard;

import { useEffect, useState } from "react";
import { getJobs } from "../services/jobService";
import { Link } from "react-router-dom";

const Dashboard = () => {
    const [jobs, setJobs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState("");

    useEffect(() => {
        const fetchJobs = async () => {
            setIsLoading(true);
            try {
                const data = await getJobs();
                setJobs(data);
            } catch (error) {
                console.error("Error fetching jobs:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchJobs();
    }, []);

    const filteredJobs = jobs.filter(
        (job) =>
            job.title.toLowerCase().includes(filter.toLowerCase()) ||
            job.location.toLowerCase().includes(filter.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-12 px-8">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-4xl font-bold mb-3">Find Your Dream Career</h1>
                    <p className="text-xl text-blue-100 mb-6">
                        Explore opportunities that match your skills and aspirations
                    </p>

                    {/* Search Bar */}
                    <div className="relative max-w-xl">
                        <input
                            type="text"
                            placeholder="Search by title or location..."
                            className="w-full py-3 px-4 pr-10 rounded-lg text-gray-800 focus:outline-none focus:ring-2 text-white focus:ring-blue-400"
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                        />
                        <svg
                            className="absolute right-3 top-3 h-6 w-6 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-6xl mx-auto px-8 py-10">
                {/* Stats Summary */}
                <div className="flex flex-wrap gap-4 mb-10">
                    <div className="bg-white rounded-lg shadow-sm p-6 flex-1">
                        <p className="text-gray-500 text-sm font-medium">Total Opportunities</p>
                        <p className="text-3xl font-bold text-gray-800">{jobs.length}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm p-6 flex-1">
                        <p className="text-gray-500 text-sm font-medium">Latest Update</p>
                        <p className="text-3xl font-bold text-gray-800">
                            {new Date().toLocaleDateString()}
                        </p>
                    </div>
                </div>

                <h2 className="text-2xl font-semibold text-gray-800 mb-6">Available Positions</h2>

                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                ) : (
                    <>
                        {filteredJobs.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredJobs.map((job) => (
                                    <div
                                        key={job._id}
                                        className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300"
                                    >
                                        <div className="p-6">
                                            <div className="flex justify-between items-start mb-3">
                                                <h3 className="text-xl font-semibold text-gray-800 line-clamp-1">
                                                    {job.title}
                                                </h3>
                                                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                                    New
                                                </span>
                                            </div>

                                            <p className="text-gray-600 mb-4 line-clamp-2">
                                                {job.description}
                                            </p>

                                            <div className="flex flex-col gap-2 text-sm text-gray-500 mb-5">
                                                <div className="flex items-center">
                                                    <svg
                                                        className="w-4 h-4 mr-2"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="2"
                                                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                                        />
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="2"
                                                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                                        />
                                                    </svg>
                                                    {job.location}
                                                </div>
                                                <div className="flex items-center">
                                                    <svg
                                                        className="w-4 h-4 mr-2"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="2"
                                                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                        />
                                                    </svg>
                                                    {job.salary} Rs
                                                </div>
                                            </div>

                                            <Link
                                                to={`/job/${job._id}`}
                                                className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-md transition duration-300"
                                            >
                                                View Details
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                                <svg
                                    className="w-16 h-16 mx-auto text-gray-400 mb-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                                <h3 className="text-xl font-medium text-gray-700 mb-2">
                                    No matching jobs found
                                </h3>
                                <p className="text-gray-500">
                                    Try adjusting your search criteria or check back later for new
                                    opportunities.
                                </p>
                                {filter && (
                                    <button
                                        className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
                                        onClick={() => setFilter("")}
                                    >
                                        Clear search
                                    </button>
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
