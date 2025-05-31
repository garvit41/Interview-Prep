import { useState, useEffect } from "react";
import { getUserProfile, updateUserProfile } from "../services/userService"; //  API Calls
import { useAuth } from "../context/AuthContext"; //  Auth Context for Token
import { useNavigate, Link } from "react-router-dom";

const Profile = () => {
	const { token } = useAuth(); //   Get User Token
	const navigate = useNavigate();
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [editMode, setEditMode] = useState(false);
	const [updatedUser, setUpdatedUser] = useState({ name: "", email: "" });

	useEffect(() => {
		if (!token) {
			navigate("/login"); //   Redirect if user is not logged in
		}
		const fetchProfile = async () => {
			try {
				const data = await getUserProfile();
				console.log("User from frontend:", data);
				setUser(data.user); //   Store `user` object only
				setUpdatedUser({ name: data.user.name, email: data.user.email });
			} catch (err) {
				setError(err.message || "Failed to load profile.");
			} finally {
				setLoading(false);
			}
		};
		fetchProfile();
	}, [token, navigate]);

	const handleUpdate = async () => {
		try {
			setError("");
			const updatedData = await updateUserProfile(updatedUser);
			setUser(updatedData.user); //   Update Profile Data
			setEditMode(false);
		} catch (err) {
			setError(err.message || "Failed to update profile.");
		}
	};

	if (loading) {
		return <p className="text-center mt-10">Loading profile...</p>;
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
			<div className="w-full max-w-2xl bg-white rounded-lg shadow-md p-6">
				<h2 className="text-3xl font-bold text-gray-800 text-center mb-6">My Profile</h2>

				{error && <p className="text-red-500 text-center mb-4">{error}</p>}

				<div className="flex flex-col items-center space-y-4">
					{/* Profile Details */}
					{!editMode ? (
						<div className="text-center">
							<p className="text-xl font-semibold">{user?.name}</p> {/*   Fix: Correct Access */}
							<p className="text-gray-600">{user?.email}</p>
							<p className="text-gray-500 capitalize">{user?.role}</p>
							{/* 🚀 Role-Based Dashboard Button */}
							{user?.role === "normal" && (
								<Link
									to="/candidate-dashboard"
									className="mt-4 block bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600 transition"
								>
									Go to Candidate Dashboard
								</Link>
							)}
							{user?.role === "recruiter" && (
								<Link
									to="/recruiter-dashboard"
									className="mt-4 block bg-green-500 text-white px-5 py-2 rounded-lg hover:bg-green-600 transition"
								>
									Go to Recruiter Dashboard
								</Link>
							)}
							<button
								onClick={() => setEditMode(true)}
								className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
							>
								Edit Profile
							</button>
						</div>
					) : (
						// Edit Profile Mode
						<div className="w-full">
							<input
								type="text"
								placeholder="Name"
								className="w-full p-2 border rounded"
								value={updatedUser.name}
								onChange={(e) => setUpdatedUser({ ...updatedUser, name: e.target.value })}
							/>
							<input
								type="email"
								placeholder="Email"
								className="w-full p-2 border rounded mt-2"
								value={updatedUser.email}
								onChange={(e) => setUpdatedUser({ ...updatedUser, email: e.target.value })}
							/>
							<div className="flex space-x-4 mt-4">
								<button onClick={handleUpdate} className="w-full bg-green-500 text-white p-2 rounded-lg hover:bg-green-600">
									Save Changes
								</button>
								<button onClick={() => setEditMode(false)} className="w-full bg-gray-400 text-white p-2 rounded-lg hover:bg-gray-500">
									Cancel
								</button>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default Profile;
