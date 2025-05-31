import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { jwtDecode } from "jwt-decode";
import { getChatMessages } from "../services/chatService.js";
import { getInterviewByChatRoom } from "../services/interviewService";

const LiveChat = () => {
	const { chatRoomId } = useParams();
	const [socket, setSocket] = useState(null);
	const [messages, setMessages] = useState([]);
	const [inputMessage, setInputMessage] = useState("");
	const [userId, setUserId] = useState(null);
	const [userRole, setUserRole] = useState(null);
	const [interviewId, setInterviewId] = useState(null);
	const [interviewStatus, setInterviewStatus] = useState(null);
	const chatEndRef = useRef(null);
	const navigate = useNavigate();

	const token = localStorage.getItem("token");

	// =================== Validate Access ===================
	useEffect(() => {
		const validateAccess = async () => {
			console.log("🔍 Running validateAccess()");
			try {
				const decoded = jwtDecode(token);
				console.log("✅ Token decoded:", decoded);
				setUserId(decoded.id);
				setUserRole(decoded.role);

				console.log("📨 Fetching interview for chatRoomId:", chatRoomId);

				const interview = await getInterviewByChatRoom(chatRoomId);

				console.log("✅ Interview fetched:", interview);

				console.log("✅ Interview found:", interview);
				setInterviewId(interview._id);
				setInterviewStatus(interview.status);

				const now = new Date();
				const scheduledTime = new Date(interview.date);
				const isAuthorized = interview.candidate._id === decoded.id || interview.recruiter._id === decoded.id;

				if (!isAuthorized) {
					alert("You are not authorized to join this interview.");
					return navigate("/dashboard");
				}

				if (interview.status === "Completed") {
					alert("This interview has already ended.");
					return navigate("/dashboard");
				}

				if (now < scheduledTime) {
					alert("You can only join at the scheduled time.");
					return navigate("/dashboard");
				}

				const newSocket = io("https://interviewprep-platform-backend.onrender.com");
				// ✅ Authorized & On Time → Connect Socket
				newSocket.on("connect_error", (err) => {
					console.error("❌ Socket connect error:", err.message);
				});

				setSocket(newSocket);

				newSocket.on("connect", () => {
					console.log("✅ Socket connected:", newSocket.id);
				});

				newSocket.emit("joinRoom", { chatRoomId });

				newSocket.on("receiveMessage", (msg) => {
					setMessages((prev) => [...prev, msg]);
				});
				return () => socket.off("receiveMessage");
			} catch (err) {
				console.error("❌ validateAccess failed:", err?.response?.data || err.message || err);
				alert("Unable to verify interview access.");
				navigate("/");
			}
		};

		if (chatRoomId && token) {
			validateAccess();
		}
	}, [chatRoomId]);

	// =================== Fetch Chat History ===================
	useEffect(() => {
		const fetchMessages = async () => {
			try {
				const data = await getChatMessages(chatRoomId, token);
				setMessages(data);
			} catch (err) {
				console.error("Failed to fetch message history:", err);
			}
		};
		if (chatRoomId && token) fetchMessages();
	}, [chatRoomId]);

	// =================== Auto-scroll on new messages ===================
	useEffect(() => {
		chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	// =================== Clean up on unmount ===================
	useEffect(() => {
		return () => {
			if (socket) {
				socket.disconnect();
			}
		};
	}, [socket]);

	// =================== Send Message ===================
	const sendMessage = () => {
		if (!socket || socket.disconnected) {
			console.warn("🛑 Socket not connected yet.");
			return;
		}

		if (inputMessage.trim() === "") return;

		socket.emit("sendMessage", {
			chatRoomId,
			senderId: userId,
			message: inputMessage,
		});

		setInputMessage("");
	};

	// =================== End Interview (Recruiter Only) ===================
	const endInterview = async () => {
		if (!interviewId) return;

		try {
			await fetch(`https://interviewprep-platform-backend.onrender.com/api/interviews/${interviewId}/status`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({ status: "Completed" }),
			});
			alert("Interview ended.");
			navigate("/dashboard");
		} catch (err) {
			console.error("Failed to end interview:", err);
			alert("Something went wrong while ending the interview.");
		}
	};

	// =================== JSX ===================
	return (
		<div style={{ maxWidth: 600, margin: "auto", padding: 20 }}>
			<h2>Live Interview Chat</h2>

			<div
				style={{
					border: "1px solid #ccc",
					height: 400,
					overflowY: "scroll",
					padding: 10,
					marginBottom: 10,
					background: "#f9f9f9",
				}}
			>
				{messages.map((msg, index) => (
					<div
						key={index}
						style={{
							marginBottom: 10,
							textAlign: msg.sender?._id === userId ? "right" : "left",
						}}
					>
						<strong>{msg.sender?._id === userId ? "You" : msg.sender?.name || "User"}:</strong> {msg.message}
					</div>
				))}
				<div ref={chatEndRef} />
			</div>

			{interviewStatus !== "Completed" ? (
				<div style={{ display: "flex", gap: 10 }}>
					<input
						type="text"
						value={inputMessage}
						onChange={(e) => setInputMessage(e.target.value)}
						style={{ flex: 1, padding: 8 }}
						placeholder="Type your message..."
					/>
					<button
						onClick={sendMessage}
						disabled={!socket || socket.disconnected}
						style={{
							padding: "8px 16px",
							opacity: !socket || socket.disconnected ? 0.5 : 1,
							cursor: !socket || socket.disconnected ? "not-allowed" : "pointer",
						}}
					>
						Send
					</button>
				</div>
			) : (
				<p style={{ color: "red", marginTop: 10 }}>Interview has ended. You can no longer send messages.</p>
			)}

			{/* Show End Interview button if recruiter */}
			{userRole === "recruiter" && interviewStatus !== "Completed" && (
				<button
					onClick={endInterview}
					style={{
						marginTop: 20,
						backgroundColor: "#dc2626",
						color: "white",
						padding: "10px",
						borderRadius: "5px",
					}}
				>
					End Interview
				</button>
			)}
		</div>
	);
};

export default LiveChat;
