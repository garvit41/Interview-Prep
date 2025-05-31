import axios from "axios";

const BASE_URL = "https://interviewprep-platform-backend.onrender.com/api/forum";

const getAllPosts = () => axios.get(`${BASE_URL}/posts`);

const getPostById = (postId) => axios.get(`${BASE_URL}/post/${postId}`);

const addComment = (postId, data, token) =>
	axios.post(`${BASE_URL}/comment/${postId}`, data, {
		headers: { Authorization: `Bearer ${token}` },
	});

const editPost = (postId, data, token) =>
	axios.put(`${BASE_URL}/post/${postId}`, data, {
		headers: { Authorization: `Bearer ${token}` },
	});

const deletePost = (postId, token) =>
	axios.delete(`${BASE_URL}/post/${postId}`, {
		headers: { Authorization: `Bearer ${token}` },
	});

const editComment = (commentId, data, token) =>
	axios.put(`${BASE_URL}/comment/${commentId}`, data, {
		headers: { Authorization: `Bearer ${token}` },
	});

const deleteComment = (commentId, token) =>
	axios.delete(`${BASE_URL}/comment/${commentId}`, {
		headers: { Authorization: `Bearer ${token}` },
	});

const createPost = (data, token) =>
	axios.post(`${BASE_URL}/post`, data, {
		headers: { Authorization: `Bearer ${token}` },
	});

const forumService = {
	getAllPosts,
	getPostById,
	addComment,
	editPost,
	deletePost,
	editComment,
	deleteComment,
	createPost,
};

export default forumService;
