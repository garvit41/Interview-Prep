// // backend/services/socketService.js
// const Chat = require("../models/Chat");

// module.exports = function (io) {
// 	io.on("connection", (socket) => {
// 		console.log("🟢 New client connected:", socket.id);

// 		// Join a chat room
// 		socket.on("joinRoom", ({ chatRoomId }) => {
// 			socket.join(chatRoomId);
// 			console.log(`Socket ${socket.id} joined room ${chatRoomId}`);
// 		});

// 		// Receive and broadcast a message
// 		socket.on("sendMessage", async ({ chatRoomId, senderId, message }) => {
// 			// Save to MongoDB
// 			const newMessage = new Chat({ chatRoomId, sender: senderId, message });
// 			await newMessage.save();

// 			// Broadcast to room
// 			io.to(chatRoomId).emit("receiveMessage", {
// 				senderId,
// 				message,
// 				timestamp: newMessage.timestamp,
// 			});
// 		});

// 		socket.on("disconnect", () => {
// 			console.log("🔴 Client disconnected:", socket.id);
// 		});
// 	});
// };

const Chat = require("../models/Chat");

module.exports = function (io) {
	io.on("connection", (socket) => {
		console.log("🟢 New client connected:", socket.id);

		// Join a chat room
		socket.on("joinRoom", ({ chatRoomId }) => {
			socket.join(chatRoomId);
			console.log(`Socket ${socket.id} joined room ${chatRoomId}`);
		});

		// Receive and broadcast a message
		socket.on("sendMessage", async ({ chatRoomId, senderId, message }) => {
			try {
				// Save to MongoDB
				const newMessage = new Chat({ chatRoomId, sender: senderId, message });
				await newMessage.save();

				// ✅ Populate sender to include name
				const populatedMessage = await newMessage.populate("sender", "name");

				// Emit to the room
				io.to(chatRoomId).emit("receiveMessage", populatedMessage);
			} catch (err) {
				console.error("❌ Error saving/sending message:", err);
			}
		});

		socket.on("disconnect", () => {
			console.log("🔴 Client disconnected:", socket.id);
		});
	});
};
