// src/pages/ForumPage.jsx
import React, { useEffect, useState } from "react";
import forumService from "../services/forumService.js";
import PostCard from "./PostCard";
import { useNavigate, Link } from "react-router-dom";

const ForumPage = () => {
	const [posts, setPosts] = useState([]);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchPosts = async () => {
			try {
				const res = await forumService.getAllPosts();
				setPosts(res.data);
			} catch (error) {
				console.error("Error fetching posts:", error);
			}
		};

		fetchPosts();
	}, []);

	return (
		<div className="max-w-4xl mx-auto p-4">
			<h1 className="text-3xl font-bold mb-6">📢 Community Forum</h1>
			<Link to="/community/new" className="inline-block bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
				New Post
			</Link>

			{posts.length === 0 ? (
				<p className="text-gray-600">No posts yet.</p>
			) : (
				posts.map((post) => <PostCard key={post._id} post={post} onClick={() => navigate(`/forum/${post._id}`)} />)
			)}
		</div>
	);
};

export default ForumPage;
