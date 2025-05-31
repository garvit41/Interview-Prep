const express = require("express");
const {
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
} = require("../controllers/applicationController");
const authMiddleware = require("../middlewares/authMiddleware");
const rbacMiddleware = require("../middlewares/rbacMiddleware");
const upload = require("../middlewares/uploadMiddleware");
const router = express.Router();

router.post("/apply", authMiddleware, rbacMiddleware(["normal"]), upload.single("resume"), applyForJob); // job k liye apply kro
router.get("/recruiter", authMiddleware, rbacMiddleware(["recruiter"]), getRecruiterApplications); // Recruiter gets applications for their jobs
router.put("/:id/status", authMiddleware, rbacMiddleware(["recruiter"]), updateApplicationStatus); // Recruiter accepts/rejects applications
router.get("/status", authMiddleware, rbacMiddleware(["normal"]), getMyApplications); // user ki applications ka kya status h
router.get("/status/:id", authMiddleware, rbacMiddleware(["normal"]), getApplicationStatus); //user check his application status



// ------ CHARTS------------
router.get("/recruiter/job-stats", authMiddleware, rbacMiddleware(["recruiter"]), getJobWiseStats);
router.get("/stats-by-job", authMiddleware, rbacMiddleware(["recruiter"]), getApplicationStatsByJob);
router.get("/trend", authMiddleware, getApplicationTrend);
router.get("/job-application-counts", authMiddleware, getApplicationsByJobTitle);
router.get("/my/trend", authMiddleware, rbacMiddleware(["normal"]), getMyApplicationTrend);
router.get("/candidate/status-breakdown", authMiddleware, rbacMiddleware(["normal"]), getCandidateStatusBreakdown);
router.get("/candidate/timeline", authMiddleware, rbacMiddleware(["normal"]), getCandidateApplicationTimeline);

module.exports = router;
