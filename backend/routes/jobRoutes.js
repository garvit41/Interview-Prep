const express = require("express");
const {
    createJob,
    getAllJobs,
    getJobById,
    updateJob,
    deleteJob,
    generateQuestions,
    getMyJobs
} = require("../controllers/jobController");

const authMiddleware = require("../middlewares/authMiddleware");
const rbacMiddleware = require("../middlewares/rbacMiddleware"); // ✅ Fix import
const router = express.Router();

router.post("/", authMiddleware, rbacMiddleware(["recruiter"]), createJob); // Create a new job (Only Recruiters)
router.get("/", getAllJobs); // Get all jobs (Public)
router.put("/:id", authMiddleware, rbacMiddleware(["recruiter"]), updateJob); // Update a job (Only Recruiters who created it)
router.delete("/:id", authMiddleware, rbacMiddleware(["recruiter"]), deleteJob); // Delete a job (Only Recruiters who created it)
router.get("/generate-questions/:jobId", authMiddleware, rbacMiddleware(["normal"]), generateQuestions);
router.get("/my-jobs", authMiddleware, rbacMiddleware(["recruiter"]), getMyJobs);
router.get("/:id", getJobById); // Get single job by ID (Public)

module.exports = router;

// router.post("/add-question", authMiddleware, rbacMiddleware(["recruiter"]), addQuestionToJob);  // add question to a job (only recruiter)