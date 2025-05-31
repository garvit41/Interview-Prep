const express = require("express");
const cors = require("cors");
const http = require("http"); // socket server k liye
const { Server } = require("socket.io");
const connectDB = require("./config/db"); // Import MongoDB connection
const errorMiddleware = require("./middlewares/errorMiddleware");
const path = require("path");
require("dotenv").config();
//--------------------------------------------------------------------------------------------------

// Import Routes
const authRoutes = require("./routes/authRoutes");
const jobRoutes = require("./routes/jobRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const interviewRoutes = require("./routes/interviewRoutes");
const chatRoutes = require("./routes/chatRoutes");
const userRoutes = require("./routes/userRoutes");
const forumRoutes = require("./routes/forumRoutes");
//--------------------------------------------------------------------------------------------------

// Connect to MongoDB & Start Server
connectDB();
//--------------------------------------------------------------------------------------------------

const app = express();

// socket.io server
const server = http.createServer(app);

const io = new Server(server, {
	cors: {
		origin: "https://interview-prepration-platform-client.onrender.com",
		methods: ["GET", "POST"],
	},
});

require("./services/socketService")(io);

//--------------------------------------------------------------------------------------------------

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
//--------------------------------------------------------------------------------------------------

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/interviews", interviewRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/user", userRoutes);
app.use("/api/forum", forumRoutes);

// Error Middleware
app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
