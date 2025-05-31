const mongoose = require("mongoose");

const interviewSchema = new mongoose.Schema(
	{
		candidate: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		recruiter: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			require: true,
		},
		job: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Job",
			required: true,
		},
		date: {
			type: Date,
			required: true,
		},
		chatRoomId: {
			type: String,
			required: true,
			unique: true,
		},
		status: {
			type: String,
			enum: ["Scheduled", "In Progress", "Completed", "Cancelled"],
			default: "Scheduled",
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("Interview", interviewSchema);
