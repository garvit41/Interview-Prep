const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
	{
		title: { type: String, required: true },
		content: { type: String, required: true },
		tags: [String],
		type: { type: String, enum: ["question", "experience"], default: "question" },
		createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("Post", PostSchema);
