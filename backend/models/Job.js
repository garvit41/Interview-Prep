const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Job title is required"],
        },
        description: {
            type: String,
            required: [true, "Job description is required"],
        },
        location: {
            type: String,
            required: [true, "Location is required"],
        },
        salary: {
            type: Number,
            required: [true, "Salary is required"],
        },
        recruiter: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        questions: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Question",
            },
        ],
    },
    { timestamps: true }
);

module.exports = mongoose.model("Job", jobSchema);
