// routes/interviewRoutes.js
const express = require("express");
const {
	scheduleInterview,
	getInterviewsByCandidate,
	getInterviewsByRecruiter,
	updateInterviewStatus,
	getInterviewByChatRoom,
} = require("../controllers/interviewController");
const authMiddleware = require("../middlewares/authMiddleware");
const rbacMiddleware = require("../middlewares/rbacMiddleware");

const router = express.Router();

router.post("/schedule", authMiddleware, rbacMiddleware(["recruiter"]), scheduleInterview); // recruiter interview schedule krega

router.get("/candidate", authMiddleware, rbacMiddleware(["normal"]), getInterviewsByCandidate); // Route to get interviews by the candidate

router.get("/recruiter", authMiddleware, rbacMiddleware(["recruiter"]), getInterviewsByRecruiter); // Route to get interviews by the recruiter

router.put("/:id/status", authMiddleware, rbacMiddleware(["recruiter"]), updateInterviewStatus); // Route to update interview status (Scheduled -> In Progress -> Completed)

router.get("/by-room/:chatRoomId", authMiddleware, getInterviewByChatRoom);

module.exports = router;
