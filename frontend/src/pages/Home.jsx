import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
	return (
		<div className="font-sans bg-slate-50 min-h-screen">
			{/* Hero Section*/}
			<header className="relative h-screen flex items-center bg-gradient-to-br from-indigo-900 via-blue-800 to-purple-900 overflow-hidden">
				<div className="container mx-auto px-6 z-10">
					<div className="max-w-2xl mx-auto md:mx-0">
						<h1 className="text-xl md:text-xl font-extrabold text-white leading-tight tracking-tight">
							Master Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-teal-300">Interviews</span>
						</h1>
						<p className="text-xl text-gray-100 mt-6 leading-relaxed">Prepare with expert questions, insights, and community support.</p>
						<Link
							to="/signup"
							className="mt-8 inline-flex items-center px-8 py-4 rounded-full bg-green-500 text-white font-medium shadow-lg hover:bg-green-600 transition duration-300 transform hover:-translate-y-1"
						>
							Get Started
							<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
								<path
									fillRule="evenodd"
									d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
									clipRule="evenodd"
								/>
							</svg>
						</Link>
					</div>
				</div>
			</header>

			{/* Features Section */}
			<section className="py-24 px-6">
				<div className="container mx-auto">
					<h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-16">Why Choose Us?</h2>
					<div className="grid md:grid-cols-3 gap-8">
						<div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 hover:shadow-xl transition duration-300">
							<div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center mb-6">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-7 w-7 text-blue-600"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
									/>
								</svg>
							</div>
							<h3 className="text-xl font-semibold text-gray-900 mb-3">Extensive Question Bank</h3>
							<p className="text-gray-600">Access a vast collection of domain-specific interview questions.</p>
						</div>

						<div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 hover:shadow-xl transition duration-300">
							<div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mb-6">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-7 w-7 text-green-600"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
									/>
								</svg>
							</div>
							<h3 className="text-xl font-semibold text-gray-900 mb-3">Expert Resources</h3>
							<p className="text-gray-600">Get curated insights from industry professionals.</p>
						</div>

						<div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 hover:shadow-xl transition duration-300">
							<div className="w-14 h-14 rounded-full bg-purple-100 flex items-center justify-center mb-6">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-7 w-7 text-purple-600"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
									/>
								</svg>
							</div>
							<h3 className="text-xl font-semibold text-gray-900 mb-3">Community Support</h3>
							<p className="text-gray-600">Engage with peers and professionals for guidance.</p>
						</div>
					</div>
				</div>
			</section>

			{/* AI-Powered Questions */}
			<section className="py-24 bg-gradient-to-r from-blue-50 to-indigo-50">
				<div className="container mx-auto px-6">
					<div className="max-w-4xl mx-auto">
						<div className="flex flex-col md:flex-row items-center justify-between gap-12">
							<div className="md:w-1/2">
								<h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Generate AI-Powered Questions</h2>
								<p className="text-lg text-gray-700 mb-8">Leverage AI to get customized interview questions for your job role.</p>
								<Link
									to="/generate-questions"
									className="inline-flex items-center px-6 py-3 rounded-lg bg-blue-600 text-white font-medium shadow-md hover:bg-blue-700 transition duration-300"
								>
									Try Now
									<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
										<path
											fillRule="evenodd"
											d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z"
											clipRule="evenodd"
										/>
									</svg>
								</Link>
							</div>
							<div className="md:w-1/2">
								<div className="relative">
									<div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl blur opacity-25"></div>
									<div className="relative bg-white rounded-xl shadow-lg p-6 md:p-8">
										<div className="flex items-center mb-6">
											<div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
											<div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
											<div className="w-3 h-3 rounded-full bg-green-500"></div>
										</div>
										<div className="bg-gray-100 rounded-lg p-4 mb-4">
											<div className="text-gray-500 text-sm mb-2">→ Generate questions for:</div>
											<div className="font-medium">Senior Frontend Developer</div>
										</div>
										<div className="space-y-3">
											<p className="bg-blue-50 border-l-4 border-blue-500 p-3 text-sm text-gray-700">
												Explain the concept of React's virtual DOM and its benefits.
											</p>
											<p className="bg-blue-50 border-l-4 border-blue-500 p-3 text-sm text-gray-700">
												How would you optimize a React application for performance?
											</p>
											<p className="bg-blue-50 border-l-4 border-blue-500 p-3 text-sm text-gray-700">
												What are your experiences with state management libraries?
											</p>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Call to Action */}
			<section className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white py-20">
				<div className="container mx-auto px-6 text-center">
					<div className="max-w-3xl mx-auto">
						<h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Elevate Your Interview Game?</h2>
						<p className="text-xl opacity-90 mb-10">Sign up today and unlock premium content, mock interviews, and expert advice.</p>
						<Link
							to="/signup"
							className="inline-flex items-center px-8 py-4 rounded-lg bg-white text-indigo-600 font-medium shadow-lg hover:bg-gray-100 transition duration-300"
						>
							Sign Up Now
							<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
								<path
									fillRule="evenodd"
									d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
									clipRule="evenodd"
								/>
							</svg>
						</Link>
					</div>
				</div>
			</section>
		</div>
	);
};

export default Home;
