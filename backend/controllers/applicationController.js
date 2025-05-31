const Application = require("../models/Application");
const Job = require("../models/Job");
const sendEmail = require("../utils/sendEmail");
const mongoose = require("mongoose");

//  Apply for a job (Candidate)
const applyForJob = async (req, res) => {
	try {
		const { jobId } = req.body;
		console.log("apply job hit with ", req.body);
		// resume bheja bhi h k nahi
		if (!req.file) {
			return res.status(400).json({
				success: false,
				message: "Please resume upload kro",
			});
		}

		const resumePath = req.file.path;

		// Check if job exists
		const job = await Job.findById(jobId);
		if (!job) {
			return res.status(404).json({ success: false, message: "Job not found" });
		}

		// Check if user already applied
		const existingApplication = await Application.findOne({
			job: jobId,
			candidate: req.user.id,
		});

		if (existingApplication) {
			return res.status(400).json({
				success: false,
				message: "You have already applied for this job",
			});
		}

		// Create new application
		const application = new Application({
			job: jobId,
			candidate: req.user.id,
			resume: resumePath,
		});

		await application.save();
		res.status(201).json({
			success: true,
			message: "Job application submitted successfully",
			application,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Error applying for job",
			error: error.message,
		});
	}
};

// user apni application ka status dekh skta h
const getApplicationStatus = async (req, res) => {
	try {
		// Application ID ko params se le rahe hain
		const applicationId = req.params.id;
		console.log("application id : ", applicationId); // Logging application ID

		// Application ko find karenge based on the applicationId
		const application = await Application.findById(applicationId)
			.populate("job", "title") // Job title bhi populate karenge
			.select("job status createdAt candidate"); // Adding candidate in select for debugging

		console.log("application : ", application); // Logging application

		if (!application) {
			return res.status(404).json({
				success: false,
				message: "No application found for the given application ID",
			});
		}

		// Ensure the application belongs to the logged-in user
		if (application.candidate.toString() !== req.user.id) {
			return res.status(403).json({
				success: false,
				message: "You are not authorized to view this application's status",
			});
		}

		// Return the application status to the user
		res.status(200).json({
			success: true,
			message: "Application status fetched successfully",
			status: application.status,
			job: application.job.title, // Adding job title
			createdAt: application.createdAt, // Adding the application date
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Error fetching application status",
			error: error.message,
		});
	}
};

// user ki applications
const getMyApplications = async (req, res) => {
	try {
		// Find all applications where the user is the candidate
		const applications = await Application.find({ candidate: req.user.id })
			.populate({
				path: "job",
				select: "title recruiter", // ✅ Fetch job title and recruiter
				populate: { path: "recruiter", select: "name email" }, // ✅ Fetch recruiter details
			})
			.select("job status createdAt"); // ✅ Select only required fields

		if (!applications.length) {
			return res.status(404).json({
				success: false,
				message: "No applications found",
			});
		}

		res.status(200).json({
			success: true,
			applications,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Error fetching your applications",
			error: error.message,
		});
	}
};

//  Get applications for a recruiter's jobs
const getRecruiterApplications = async (req, res) => {
	try {
		const jobs = await Job.find({ recruiter: req.user.id });
		console.log("jobs : ", jobs);
		const jobIds = jobs.map((job) => job._id);

		const applications = await Application.find({ job: { $in: jobIds } })
			.populate("candidate", "name email")
			.populate("job", "title");

		res.status(200).json({ success: true, applications });
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Error fetching applications",
			error: error.message,
		});
	}
};

// Update application status (Pending -> Selected -> Rejected)
const updateApplicationStatus = async (req, res) => {
	try {
		const applicationId = req.params.id;
		const { status } = req.body;

		// Fetch the application by ID and populate the candidate field
		const application = await Application.findById(applicationId).populate("candidate");
		// console.log("application : ",application);
		if (!application) {
			return res.status(404).json({
				success: false,
				message: "Application not found",
			});
		}

		// Update the status of the application
		application.status = status;
		await application.save();

		// Log the updated application and user details
		console.log("Application found:", application);
		const user = application.candidate;
		console.log("User details:", user);

		// Send an email to the user notifying them about the application status update
		const message = `Your application for the job has been updated to: ${status}.`;

		// Ensure the user exists before sending the email
		if (user && user.email) {
			await sendEmail(user.email, "Application Status Update", message);
			console.log("Email sent to:", user.email);
		} else {
			console.log("User email not found, unable to send email.");
		}

		// Send success response back to the recruiter
		res.status(200).json({
			success: true,
			message: `Application status updated to ${status}`,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({
			success: false,
			message: "Server error",
		});
	}
};

// 📊 Get job-wise application count for the recruiter
const getJobWiseStats = async (req, res) => {
	try {
		const jobs = await Job.find({ recruiter: req.user.id }).select("_id title");

		const jobIds = jobs.map((job) => job._id);

		const applications = await Application.aggregate([
			{ $match: { job: { $in: jobIds } } },
			{
				$group: {
					_id: "$job",
					count: { $sum: 1 },
				},
			},
		]);

		// Map job ID to title
		const jobMap = {};
		jobs.forEach((job) => {
			jobMap[job._id.toString()] = job.title;
		});

		const stats = applications.map((app) => ({
			jobTitle: jobMap[app._id.toString()] || "Unknown",
			count: app.count,
		}));

		res.status(200).json({ success: true, stats });
	} catch (error) {
		console.error("Job-wise stats error:", error);
		res.status(500).json({ success: false, message: "Failed to fetch job-wise stats" });
	}
};

const getApplicationStatsByJob = async (req, res) => {
	try {
		// Step 1: Find job IDs posted by this recruiter
		const jobs = await Job.find({ recruiter: req.user.id }).select("_id title");
		const jobIdTitleMap = {};
		jobs.forEach((job) => {
			jobIdTitleMap[job._id.toString()] = job.title;
		});
		const jobIds = jobs.map((job) => job._id);

		// Step 2: Aggregate application counts by job ID
		const stats = await Application.aggregate([{ $match: { job: { $in: jobIds } } }, { $group: { _id: "$job", count: { $sum: 1 } } }]);

		// Step 3: Map back job titles
		const results = stats.map((stat) => ({
			jobId: stat._id,
			title: jobIdTitleMap[stat._id.toString()],
			count: stat.count,
		}));

		res.status(200).json({ success: true, stats: results });
	} catch (error) {
		console.error("📉 Error in getApplicationStatsByJob:", error);
		res.status(500).json({
			success: false,
			message: "Failed to fetch application stats",
		});
	}
};

// ------------------------- FOR CHARTS --------------------------------
// 🚀 Get application trend data grouped by date
const getApplicationTrend = async (req, res) => {
	try {
		// Step 1: Find job IDs posted by this recruiter
		const jobs = await Job.find({ recruiter: req.user.id }).select("_id");
		const jobIds = jobs.map((job) => job._id);

		// Step 2: Group applications by date
		const trendData = await Application.aggregate([
			{ $match: { job: { $in: jobIds } } },
			{
				$group: {
					_id: {
						$dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
					},
					count: { $sum: 1 },
				},
			},
			{ $sort: { _id: 1 } },
		]);

		// Step 3: Format for frontend
		const formatted = trendData.map((entry) => ({
			date: entry._id,
			count: entry.count,
		}));

		res.status(200).json({ success: true, trend: formatted });
	} catch (error) {
		console.error("❌ Error in getApplicationTrend:", error);
		res.status(500).json({ success: false, message: "Failed to fetch trend data" });
	}
};

// 📊 Get application count per job title
const getApplicationsByJobTitle = async (req, res) => {
	try {
		const jobs = await Job.find({ recruiter: req.user.id });

		const jobIds = jobs.map((j) => j._id);

		const result = await Application.aggregate([
			{ $match: { job: { $in: jobIds } } },
			{
				$lookup: {
					from: "jobs",
					localField: "job",
					foreignField: "_id",
					as: "jobInfo",
				},
			},
			{ $unwind: "$jobInfo" },
			{
				$group: {
					_id: "$jobInfo.title",
					count: { $sum: 1 },
				},
			},
			{ $project: { title: "$_id", count: 1, _id: 0 } },
		]);

		res.status(200).json({ success: true, stats: result });
	} catch (error) {
		console.error("🔥 Error fetching job app count:", error);
		res.status(500).json({ success: false, message: "Server error" });
	}
};

// 🚀 Get application submission trend for a candidate
const getMyApplicationTrend = async (req, res) => {
	try {
		const trend = await Application.aggregate([
			{ $match: { candidate: req.user.id } },
			{
				$group: {
					_id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
					count: { $sum: 1 },
				},
			},
			{ $sort: { _id: 1 } },
		]);

		const formatted = trend.map((entry) => ({
			date: entry._id,
			count: entry.count,
		}));

		res.status(200).json({ success: true, trend: formatted });
	} catch (error) {
		console.error("🔥 Error in getMyApplicationTrend:", error);
		res.status(500).json({ success: false, message: "Failed to fetch candidate trend" });
	}
};

// 📊 Get status breakdown for candidate
const getCandidateStatusBreakdown = async (req, res) => {
	try {
		const userId = req.user.id;

		const result = await Application.aggregate([
			{ $match: { candidate: new mongoose.Types.ObjectId(userId) } },
			{ $group: { _id: "$status", count: { $sum: 1 } } },
		]);

		// Convert to object with default 0s
		const statusBreakdown = { Pending: 0, Selected: 0, Rejected: 0 };
		result.forEach((r) => {
			statusBreakdown[r._id] = r.count;
		});

		res.status(200).json({ success: true, statusBreakdown });
	} catch (error) {
		console.error("❌ Candidate status breakdown error:", error);
		res.status(500).json({ success: false, message: "Failed to fetch status breakdown" });
	}
};

// 📈 Candidate application timeline (date-wise)
const getCandidateApplicationTimeline = async (req, res) => {
	try {
		const userId = req.user.id;

		const timeline = await Application.aggregate([
			{ $match: { candidate: new mongoose.Types.ObjectId(userId) } },
			{
				$group: {
					_id: {
						$dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
					},
					count: { $sum: 1 },
				},
			},
			{ $sort: { _id: 1 } },
		]);

		const formatted = timeline.map((entry) => ({
			date: entry._id,
			count: entry.count,
		}));

		res.status(200).json({ success: true, timeline: formatted });
	} catch (error) {
		console.error("❌ Timeline error:", error);
		res.status(500).json({ success: false, message: "Failed to fetch timeline" });
	}
};

module.exports = {
	applyForJob,
	getRecruiterApplications,
	updateApplicationStatus,
	getApplicationStatus,
	getMyApplications,
	getJobWiseStats,
	getApplicationStatsByJob,
	getApplicationTrend,
	getApplicationsByJobTitle,
	getMyApplicationTrend,
	getCandidateStatusBreakdown,
	getCandidateApplicationTimeline,
};
