import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar"
import Footer from "./Components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import JobDetails from "./pages/JobDetails";
import RecruiterDashboard from "./pages/RecruiterDashboard";
import ScheduleInterview from "./pages/ScheduleInterview";
import CandidateDashboard from "./pages/CandidateDashboard";
import MyJobs from "./pages/MyJobs";
import PostJob from "./pages/PostJob";
import EditJob from "./pages/EditJob";
import GenerateQuestions from "./pages/GenerateQuestions";
import AppliedJobs from "./pages/AppliedJobs";
import ProtectedRoute from "./Components/ProtectedRoute";
import Profile from "./pages/Profile";
import RedirectIfAuthenticated from "./Components/RedirectIfAuthenticated";
import NewPostForm from "./pages/NewPostForm";
import ForumPage from "./pages/ForumPage";
import PostDetails from "./pages/PostDetails";
import LiveChat from "./pages/LiveChat";

const AppRoutes = () => {
	return (
		<Router>
			<div className="bg-gray-100 min-h-screen flex flex-col">
				<Navbar />

				<main className="flex-grow">
					<Routes>
						{/*Public Routes */}
						<Route path="/" element={<Home />} />

						<Route element={<RedirectIfAuthenticated />}>
							<Route path="/login" element={<Login />} />
							<Route path="/signup" element={<Signup />} />
						</Route>
						<Route path="/job/:id" element={<JobDetails />} />

						{/* Forum Routes */}
						<Route path="/forum" element={<ForumPage />} />
						<Route path="/forum/:id" element={<PostDetails />} />
						<Route path="/community/new" element={<NewPostForm />} />
						<Route path="/profile" element={<Profile />} />

						{/* Protected Routes (Only for Logged-in Users) */}
						<Route element={<ProtectedRoute />}>
							<Route path="/dashboard" element={<Dashboard />} />
							<Route path="/recruiter-dashboard" element={<RecruiterDashboard />} />
							<Route path="/schedule-interview/:applicationId" element={<ScheduleInterview />} />
							<Route path="/candidate-dashboard" element={<CandidateDashboard />} />
							<Route path="/my-jobs" element={<MyJobs />} />
							<Route path="/post-job" element={<PostJob />} />
							<Route path="/edit-job/:id" element={<EditJob />} />
							<Route path="/generate-questions/:jobId" element={<GenerateQuestions />} />
							<Route path="/applied-jobs" element={<AppliedJobs />} />
							<Route path="/livechat/:chatRoomId" element={<LiveChat />} />
						</Route>
					</Routes>
				</main>

				<Footer />
			</div>
		</Router>
	);
};

export default AppRoutes;
