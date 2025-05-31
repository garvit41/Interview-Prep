import axios from "axios";
const BASE_URL = "https://interviewprep-platform-backend.onrender.com/api/chat";

export const getChatMessages = async (chatRoomId, token) => {
	const res = await axios.get(`${BASE_URL}/${chatRoomId}`, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
	return res.data;
};
