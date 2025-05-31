const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
    {
        job: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Job",
            required: true,
        },
        candidate: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        resume: {
            type: String, // URL to the candidate's resume
            required: true,
        },

        status: {
            type: String,
            enum: ["Pending", "Selected", "Rejected"],
            default: "Pending",
        },
    },
    { timestamps: true }
);

const Application = mongoose.model("Application", applicationSchema);

module.exports = Application;
