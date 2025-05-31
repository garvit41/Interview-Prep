import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // ✅ Import useAuth

const Navbar = () => {
	const { token, user, logout } = useAuth(); // ✅ Get User Data

	return (
		<nav className="bg-white shadow-md py-4 sticky top-0 z-50">
			<div className="container mx-auto flex justify-between items-center px-6">
				<Link to="/" className="text-3xl font-bold text-indigo-600">
					InterviewPrep
				</Link>

				<div className="flex space-x-6 items-center">
					<Link to="/" className="text-gray-700 hover:text-indigo-500">
						Home
					</Link>

					<Link to="/forum" className="text-gray-700 hover:text-indigo-500">
						Forum
					</Link>

					{token && (
						<Link to="/profile" className="text-gray-700 hover:text-indigo-500">
							Profile
						</Link>
					)}

					{/* 🚀 Show User Role (Recruiter / Candidate) */}
					{user && (
						<span className="text-gray-600 bg-gray-200 px-4 py-1 rounded-full text-sm">
							{user.role === "recruiter" ? "Recruiter" : "Candidate"}
						</span>
					)}

					{token ? (
						<button onClick={logout} className="bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-600 transition">
							Logout
						</button>
					) : (
						<Link to="/login" className="bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700 transition">
							Sign In
						</Link>
					)}
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
