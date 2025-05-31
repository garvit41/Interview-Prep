import React, { useState } from "react";
import CommentForm from "./CommentForm";
import { useAuth } from "../context/AuthContext";
import forumService from "../services/forumService";

const Comment = ({ comment, onReply }) => {
	const { user, token } = useAuth();

	if (!user) {
		console.warn("⚠️ User not loaded yet");
	}

	// console.log("comment : ", comment);
	// console.log("current user : ", user);
	const [showReplyForm, setShowReplyForm] = useState(false);
	const [editing, setEditing] = useState(false);

	// console.log(" user._id:", user?._id);
	// console.log(" comment.createdBy._id:", comment?.createdBy?._id);
	// console.log(" strict compare:", comment?.createdBy?._id === user?._id);
	// console.log(" loose compare:", comment?.createdBy?._id == user?._id); // try loose comparison

	// const isOwner = user && String(comment.createdBy?._id) === String(user._id);
	const isOwner = user && comment.createdBy?._id && user._id && String(comment.createdBy._id) === String(user._id);

	// console.log(isOwner);
	const handleEdit = async (newContent) => {
        try {
            await forumService.editComment(comment._id, { content: newContent }, token);
            setEditing(false);
            await onReply(); // ✅ reload updated comments
        } catch (err) {
            console.error("Edit failed:", err);
        }
    };
    
	const handleDelete = async () => {
		if (!window.confirm("Delete this comment?")) return;
		try {
			await forumService.deleteComment(comment._id, token);
			onReply("", null); // refresh
		} catch (err) {
			console.error("Delete failed:", err);
		}
	};

	return (
		<div className="border-l-2 border-gray-300 pl-4 mb-4">
			<div className="bg-white p-3 rounded shadow-sm">
				{editing ? (
					<CommentForm onSubmit={handleEdit} initialContent={comment.content} />
				) : (
					<>
						<p className="text-sm text-gray-800">{comment.content}</p>
						<p className="text-xs text-gray-500 mt-1">By {comment.createdBy?.name}</p>
					</>
				)}

				<div className="flex gap-3 mt-2 text-xs text-blue-500">
					<button onClick={() => setShowReplyForm(!showReplyForm)}>{showReplyForm ? "Cancel" : "Reply"}</button>

					{isOwner && !editing && (
						<>
							<button onClick={() => setEditing(true)}>Edit</button>
							<button className="text-red-500" onClick={handleDelete}>
								Delete
							</button>
						</>
					)}
				</div>

				{showReplyForm && (
					<div className="mt-2">
						<CommentForm
							onSubmit={(content) => {
								onReply(content, comment._id);
								setShowReplyForm(false);
							}}
						/>
					</div>
				)}
			</div>

			{comment.replies?.length > 0 && (
				<div className="mt-3">
					{comment.replies.map((reply) => (
						<Comment key={reply._id} comment={reply} onReply={onReply} />
					))}
				</div>
			)}
		</div>
	);
};

export default Comment;
