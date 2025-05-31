const Chat = require("../models/Chat");

const getChatHistory = async (req, res) => {
	try {
		const { chatRoomId } = req.params;

		const messages = await Chat.find({ chatRoomId }).populate("sender", "name").sort({ createdAt: 1 });

		res.status(200).json(messages);
	} catch (error) {
		console.error("Error fetching the chat history:", error);
		res.status(500).json({ message: "Failed to fetch messages" });
	}
};

module.exports = { getChatHistory };
