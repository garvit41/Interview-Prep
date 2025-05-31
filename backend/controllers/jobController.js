const Job = require("../models/Job");
const Question = require("../models/Question");

const { GoogleGenerativeAI } = require("@google/generative-ai");
const GEMINI_API_KEY = process.env.API_KEY;
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Function to dynamically generate questions for a job
const generateQuestions = async (req, res) => {
    const { jobId } = req.params; // Get jobId from URL params

    if (!jobId) {
        return res.status(400).json({ Error: "Job ID is required" });
    }

    try {
        // Step 1: Fetch job details using jobId
        const job = await Job.findById(jobId);

        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Job not found",
            });
        }

        // Step 2: Generate questions using Gemini API based on job title or description
        const jobrole = job.title || "Software Engineer"; // Example job role; you can use job.description if needed
        const result = await model.generateContent(
            `Generate 5 interview questions for the role of ${jobrole}. 
             1 easy question, 2 medium questions, and 2 hard questions. 
             Format:
             Easy: <question>
             Medium: <question>
             Medium: <question>
             Hard: <question>
             Hard: <question>`
        );

        // Log the result to inspect the structure
        console.log("Result from Gemini API:", result);

        // Check if the response contains the text function and invoke it
        if (result.response && typeof result.response.text === 'function') {
            const questionsText = await result.response.text();  // Invoke the text function to get the content
            const questions = questionsText
                .split("\n")
                .map((question) => question.trim())
                .filter(Boolean);

            // Step 3: Send the generated questions as response
            return res.status(200).json({
                success: true,
                message: "Questions generated successfully",
                questions: questions,
            });
        } else {
            throw new Error("Invalid response format from Gemini API.");
        }
    } catch (error) {
        console.error("Error in generateQuestions:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
};

// Create a new job
const createJob = async (req, res) => {
    try {
        console.log("req.body : ", req.body);
        const { title, description, location, salary, questions } = req.body;

        // Create the job with provided details
        const job = new Job({
            title,
            description,
            location,
            salary,
            recruiter: req.user.id, // Recruiter ID from Auth Middleware
        });

        // Save the job first
        await job.save();

        // Now, create questions and associate them with the job
        for (let q of questions) {
            const question = new Question({
                content: q.content,
                difficulty: q.difficulty,
                job: job._id, // Linking the question to the job
            });
            await question.save();
            job.questions.push(question._id); // Add question ID to job.questions
        }

        // Save the job again with updated questions
        await job.save();

        // Return response
        res.status(201).json({
            success: true,
            message: "Job and questions created successfully",
            job,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error creating job",
            error: error.message,
        });
    }
};

//  Get all jobs
const getAllJobs = async (req, res) => {
    try {
        const jobs = await Job.find().populate("recruiter", "name email");
        res.status(200).json({ success: true, jobs });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching jobs",
            error: error.message,
        });
    }
};

//  Get a single job by ID
// const getJobById = async (req, res) => {
//     try {
//         const job = await Job.findById(req.params.id).populate("recruiter", "name email");
//         // console.log("get job by id hit", job);

//         if (!job) {
//             return res.status(404).json({ success: false, message: "Job not found" });
//         }

//         res.status(200).json({ success: true, job });
//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: "Error fetching job",
//             error: error.message,
//         });
//     }
// };

//  Get a single job by ID

const getJobById = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id)
            .populate("recruiter", "name email") // ✅ Recruiter details
            .populate({
                path: "questions",
                select: "content difficulty" // ✅ Only fetch necessary fields
            });

        if (!job) {
            return res.status(404).json({ success: false, message: "Job not found" });
        }

        res.status(200).json({ success: true, job });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching job",
            error: error.message,
        });
    }
};

//  Update a job
const updateJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({ success: false, message: "Job not found" });
        }

        if (job.recruiter.toString() !== req.user.id) {
            return res
                .status(403)
                .json({ success: false, message: "Unauthorized to update this job" });
        }

        const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json({
            success: true,
            message: "Job updated successfully",
            job: updatedJob,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error updating job",
            error: error.message,
        });
    }
};

//  Delete a job
const deleteJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({ success: false, message: "Job not found" });
        }

        if (job.recruiter.toString() !== req.user.id) {
            return res
                .status(403)
                .json({ success: false, message: "Unauthorized to delete this job" });
        }

        await Job.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: "Job deleted successfully" });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error deleting job",
            error: error.message,
        });
    }
};

// recruiter ne jo jobs dali hui h
const getMyJobs = async (req, res) => {
    console.log("get my jobs function called");
    try {
        const jobs = await Job.find({ recruiter: req.user.id }); // Recruiter ke jobs fetch karna
        res.status(200).json({ success: true, jobs });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching job",
            error: error.message,
        });
    }
};


module.exports = { createJob, getAllJobs, getJobById, updateJob, deleteJob, generateQuestions, getMyJobs};