import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import forumService from "../services/forumService";
import Comment from "../Components/Comment";
import CommentForm from "../Components/CommentForm";
import { useAuth } from "../context/AuthContext";

const PostDetails = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const { user, token } = useAuth();

	const [post, setPost] = useState(null);
	const [comments, setComments] = useState([]);
	const [editMode, setEditMode] = useState(false);
	const [editPostData, setEditPostData] = useState({ title: "", content: "" });

	const fetchPost = async () => {
		try {
			// console.log("🔥 Fetching post data...");
			const res = await forumService.getPostById(id);
			// console.log("📦 API Response:", res.data);

			setPost(res.data.post);
			setComments(res.data.comments);
			setEditPostData({
				title: res.data.post.title,
				content: res.data.post.content,
			});
		} catch (err) {
			console.error("❌ Error loading post:", err);
		}
	};

	useEffect(() => {
		// console.log("fetchPost called with ", id);
		fetchPost();
	}, [id]);

	const handleNewComment = async (content, parentId = null) => {
		try {
			// agar content mila toh hi comment add karo
			if (content) {
				await forumService.addComment(id, { content, parentId }, token);
			}
			await fetchPost(); // ✅ hamesha reload post & comments
		} catch (err) {
			console.error("Error adding comment:", err);
		}
	};

	const handleEditPost = async () => {
		try {
			await forumService.editPost(id, editPostData, token);
			setEditMode(false);
			fetchPost();
		} catch (err) {
			console.error("Error updating post:", err);
		}
	};

	const handleDeletePost = async () => {
		if (!window.confirm("Are you sure you want to delete this post?")) return;
		try {
			await forumService.deletePost(id, token);
			navigate("/forum");
		} catch (err) {
			console.error("Error deleting post:", err);
		}
	};

	if (!post) return <p className="text-center p-4">Loading...</p>;

	const isOwner = user && post.createdBy?._id === user._id;

	return (
		<div className="max-w-4xl mx-auto p-4">
			{editMode ? (
				<>
					<input
						type="text"
						value={editPostData.title}
						onChange={(e) => setEditPostData({ ...editPostData, title: e.target.value })}
						className="w-full p-2 mb-2 border rounded"
					/>
					<textarea
						value={editPostData.content}
						onChange={(e) => setEditPostData({ ...editPostData, content: e.target.value })}
						className="w-full p-2 mb-2 border rounded"
						rows={5}
					/>
					<div className="flex gap-2">
						<button onClick={handleEditPost} className="bg-blue-600 text-white px-3 py-1 rounded">
							Save
						</button>
						<button onClick={() => setEditMode(false)} className="text-gray-600 px-3 py-1 rounded">
							Cancel
						</button>
					</div>
				</>
			) : (
				<>
					<h1 className="text-2xl font-bold mb-2">{post.title}</h1>
					<p className="text-sm text-gray-500 mb-2">By {post.createdBy?.name}</p>
					<p className="mb-4 text-gray-800">{post.content}</p>

					{isOwner && (
						<div className="flex gap-2 mb-6">
							<button onClick={() => setEditMode(true)} className="text-sm bg-yellow-500 text-white px-3 py-1 rounded">
								Edit
							</button>
							<button onClick={handleDeletePost} className="text-sm bg-red-600 text-white px-3 py-1 rounded">
								Delete
							</button>
						</div>
					)}
				</>
			)}

			<h2 className="text-lg font-semibold mb-2">💬 Comments</h2>
			<CommentForm onSubmit={handleNewComment} />

			<div className="mt-4">
				{comments.length === 0 ? (
					<p className="text-gray-500">No comments yet.</p>
				) : (
					comments.map((comment) => <Comment key={comment._id} comment={comment} onReply={handleNewComment} />)
				)}
			</div>
		</div>
	);
};

export default PostDetails;
