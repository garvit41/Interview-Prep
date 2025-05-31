import { useState } from "react";
import { login as loginAPI } from "../services/authService"; // Corrected import name
import { useAuth } from "../context/AuthContext"; // Added import statement
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const { login } = useAuth(); // Added context
	const navigate = useNavigate();

	const handleLogin = async (e) => {
		e.preventDefault();
		setError("");
		setIsLoading(true);
		try {
			const data = await loginAPI({ email, password }); // Corrected function name
			if (!data || !data.token) {
				throw new Error("Invalid login response! Token is missing.");
			}
			console.log("Login Success:", data);
			login(data.token); // Save token globally
			navigate("/dashboard"); // Redirect to dashboard after login
		} catch (err) {
			setError(err.message || "Login failed. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-blue-800 to-purple-900">
			<div className="w-full max-w-4xl mx-4">
				<div className="flex flex-col md:flex-row rounded-2xl overflow-hidden shadow-2xl">
					{/* Left Section - Illustration Side */}
					<div className="hidden md:block w-1/2 bg-white p-12 relative overflow-hidden">
						<div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 opacity-70"></div>
						<div className="relative z-10 h-full flex flex-col justify-center">
							<div className="mb-8">
								<svg className="w-16 h-16 text-indigo-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
									<path
										fillRule="evenodd"
										d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
										clipRule="evenodd"
									></path>
								</svg>
							</div>
							<h2 className="text-3xl font-bold text-gray-800 mb-6">Welcome Back!</h2>
							<p className="text-lg text-gray-600 mb-8">Enter your credentials to access your account and explore amazing features.</p>
							<div className="space-y-4">
								<div className="flex items-center">
									<div className="bg-indigo-100 rounded-full p-2 mr-4">
										<svg
											className="w-5 h-5 text-indigo-600"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth="2"
												d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
											></path>
										</svg>
									</div>
									<span className="text-gray-700">Access to Premium Features</span>
								</div>
								<div className="flex items-center">
									<div className="bg-indigo-100 rounded-full p-2 mr-4">
										<svg
											className="w-5 h-5 text-indigo-600"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth="2"
												d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
											></path>
										</svg>
									</div>
									<span className="text-gray-700">Personalized Dashboard</span>
								</div>
								<div className="flex items-center">
									<div className="bg-indigo-100 rounded-full p-2 mr-4">
										<svg
											className="w-5 h-5 text-indigo-600"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth="2"
												d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
											></path>
										</svg>
									</div>
									<span className="text-gray-700">Expert Interview Resources</span>
								</div>
							</div>
						</div>
					</div>

					{/* Right Section - Login Form */}
					<div className="w-full md:w-1/2 bg-white p-8 md:p-12">
						<div className="max-w-md mx-auto">
							<h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Log In</h2>

							{error && (
								<div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded">
									<div className="flex items-center">
										<svg
											className="w-5 h-5 text-red-500 mr-2"
											fill="currentColor"
											viewBox="0 0 20 20"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path
												fillRule="evenodd"
												d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
												clipRule="evenodd"
											></path>
										</svg>
										<span className="text-red-800">{error}</span>
									</div>
								</div>
							)}

							<form onSubmit={handleLogin} className="space-y-6">
								{/* Email Input */}
								<div>
									<label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
										Email Address
									</label>
									<div className="relative">
										<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
											<svg
												className="h-5 w-5 text-gray-400"
												xmlns="http://www.w3.org/2000/svg"
												viewBox="0 0 20 20"
												fill="currentColor"
											>
												<path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
												<path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
											</svg>
										</div>
										<input
											type="email"
											id="email"
											placeholder="Enter your email"
											className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
											value={email}
											onChange={(e) => setEmail(e.target.value)}
											required
										/>
									</div>
								</div>

								{/* Password Input */}
								<div>
									<div className="flex items-center justify-between mb-1">
										<label htmlFor="password" className="block text-sm font-medium text-gray-700">
											Password
										</label>
										<a href="/forgot-password" className="text-sm text-indigo-600 hover:text-indigo-800">
											Forgot password?
										</a>
									</div>
									<div className="relative">
										<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
											<svg
												className="h-5 w-5 text-gray-400"
												xmlns="http://www.w3.org/2000/svg"
												viewBox="0 0 20 20"
												fill="currentColor"
											>
												<path
													fillRule="evenodd"
													d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2-2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
													clipRule="evenodd"
												/>
											</svg>
										</div>
										<input
											type="password"
											id="password"
											placeholder="Enter your password"
											className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
											value={password}
											onChange={(e) => setPassword(e.target.value)}
											required
										/>
									</div>
								</div>

								{/* Login Button */}
								<button
									type="submit"
									className="w-full flex justify-center items-center bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-lg transition duration-300 ease-in-out"
									disabled={isLoading}
								>
									{isLoading ? (
										<>
											<svg
												className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
												xmlns="http://www.w3.org/2000/svg"
												fill="none"
												viewBox="0 0 24 24"
											>
												<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
												<path
													className="opacity-75"
													fill="currentColor"
													d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
												></path>
											</svg>
											Logging In...
										</>
									) : (
										"Log In"
									)}
								</button>
							</form>

							{/* Social Login */}
							<div className="mt-6 pt-6 border-t border-gray-200">
								<p className="text-center text-gray-500 mb-4">Or continue with</p>
								<div className="flex justify-center space-x-4">
									<button className="py-3 px-6 border rounded-full border-gray-300 hover:border-gray-500 transition duration-300">
										Google
									</button>
									<button className="py-3 px-6 border rounded-full border-gray-300 hover:border-gray-500 transition duration-300">
										Twitter
									</button>
								</div>
							</div>

							{/* Sign Up Link */}
							<div className="mt-6 text-center">
								<p className="text-gray-600">
									Don't have an account?
									<Link to="/signup" className="text-indigo-600 hover:underline">
										Sign Up
									</Link>
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Login;
