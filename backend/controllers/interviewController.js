// controllers/interviewController.js
const Interview = require("../models/Interview");
const Job = require("../models/Job");
const User = require("../models/User");
const Application = require("../models/Application");
const sendEmail = require("../utils/sendEmail");
const { v4: uuidv4 } = require("uuid");

// Schedule an interview (Recruiter)
// const scheduleInterview = async (req, res) => {
// 	try {
// 		const { applicationId, date } = req.body; // Pass the applicationId in the request body

// 		// Fetch the application details from the Application model
// 		const application = await Application.findById(applicationId)
// 			.populate("candidate", "email name") // Populate candidate details
// 			.populate("job", "title"); // Populate job details

// 		if (!application) {
// 			return res.status(404).json({
// 				success: false,
// 				message: "Application not found",
// 			});
// 		}

// 		const candidate = application.candidate; // Candidate from the application
// 		const job = application.job; // Job from the application
// 		const chatRoomId = uuidv4();
// 		const recruiter = req.user;
// 		console.log("candidate : ", candidate);
// 		console.log("job : ", job);
// 		console.log(newRoomId);
// 		// Create the interview with status "Scheduled"
// 		const interview = new Interview({
// 			candidate: candidate._id,
// 			recruiter: recruiter._id,
// 			job: job._id,
// 			date,
// 			status: "Scheduled",
// 			chatRoomId,
// 		});

// 		console.log("interview : ", interview);
// 		await interview.save();

// 		// Send confirmation emails to both the recruiter and candidate
// 		const candidateMessage = `Your interview has been scheduled for the job position "${job.title}" on ${date}.`;
// 		await sendEmail(candidate.email, "Interview Scheduled", candidateMessage);

// 		const recruiterMessage = `You have scheduled an interview with ${candidate.name} for the job position "${job.title}" on ${date}.`;
// 		await sendEmail(req.user.email, "Interview Scheduled - Confirmation", recruiterMessage);

// 		res.status(201).json({
// 			success: true,
// 			message: "Interview scheduled successfully",
// 			interview,
// 		});

// 		return res.status(200).json({ success: true, interview });
// 	} catch (error) {
// 		res.status(500).json({
// 			success: false,
// 			message: "Error scheduling interview",
// 			error: error.message,
// 		});
// 	}
// };

const scheduleInterview = async (req, res) => {
	try {
		const { applicationId, date } = req.body;

		// 1. Find the application and populate candidate + job
		const application = await Application.findById(applicationId).populate("candidate", "email name").populate("job", "title");

		if (!application) {
			return res.status(404).json({
				success: false,
				message: "Application not found",
			});
		}

		const candidate = application.candidate;
		const job = application.job;
		const recruiter = req.user; // ✅ properly defined
		const chatRoomId = uuidv4(); // ✅ properly defined

		// 2. Create Interview
		const interview = new Interview({
			candidate: candidate._id,
			recruiter: recruiter._id,
			job: job._id,
			date,
			status: "Scheduled",
			chatRoomId,
		});

		await interview.save();

		// 3. Send emails
		await sendEmail(candidate.email, "Interview Scheduled", `Your interview for "${job.title}" is scheduled on ${date}`);

		await sendEmail(
			recruiter.email,
			"Interview Scheduled - Confirmation",
			`You have scheduled an interview with ${candidate.name} for "${job.title}" on ${date}`
		);

		// 4. Respond
		res.status(201).json({
			success: true,
			message: "Interview scheduled successfully",
			interview,
		});
	} catch (error) {
		console.error("Interview scheduling failed:", error); // 🔍 log exact error
		res.status(500).json({
			success: false,
			message: "Error scheduling interview",
			error: error.message,
		});
	}
};

// Get interviews by candidate
const getInterviewsByCandidate = async (req, res) => {
	try {
		const interviews = await Interview.find({ candidate: req.user.id }).populate("job", "title").populate("recruiter", "name email");

		if (!interviews.length) {
			return res.status(404).json({
				success: false,
				message: "No interviews found for this candidate",
			});
		}

		res.status(200).json({
			success: true,
			interviews,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Error fetching interviews",
			error: error.message,
		});
	}
};

// Get interviews by recruiter
const getInterviewsByRecruiter = async (req, res) => {
	console.log("get interviews by recruiter called");
	try {
		const interviews = await Interview.find({ recruiter: req.user.id }).populate("job", "title").populate("candidate", "name email");

		console.log("Interviews : ", interviews);

		res.status(200).json({
			success: true,
			interviews,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Error fetching interviews",
			error: error.message,
		});
	}
};

// Update interview status (Scheduled -> In Progress -> Completed)
const updateInterviewStatus = async (req, res) => {
	try {
		const { status } = req.body;
		console.log("status : ", status);
		// Ensure valid status
		if (!["Scheduled", "In Progress", "Completed"].includes(status)) {
			return res.status(400).json({
				success: false,
				message: "Invalid status provided",
			});
		}

		const interview = await Interview.findById(req.params.id);
		if (!interview) {
			return res.status(404).json({
				success: false,
				message: "Interview not found",
			});
		}

		// Check if the recruiter owns the interview
		if (interview.recruiter.toString() !== req.user.id) {
			return res.status(403).json({
				success: false,
				message: "Unauthorized to update this interview status",
			});
		}

		interview.status = status;
		await interview.save();

		res.status(200).json({
			success: true,
			message: `Interview status updated to ${status}`,
			interview,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Error updating interview status",
			error: error.message,
		});
	}
};

const getInterviewByChatRoom = async (req, res) => {
	try {
		const { chatRoomId } = req.params;

		const interview = await Interview.findOne({ chatRoomId })
			.populate("candidate", "name")
			.populate("recruiter", "name")
			.populate("job", "title");

		if (!interview) {
			return res.status(404).json({ success: false, message: "Interview not found" });
		}

		res.json(interview);
	} catch (error) {
		res.status(500).json({ success: false, message: "Server Error" });
	}
};

module.exports = {
	scheduleInterview,
	getInterviewsByCandidate,
	getInterviewsByRecruiter,
	updateInterviewStatus,
	getInterviewByChatRoom,
};
