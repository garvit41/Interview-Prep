// src/Components/PostCard.jsx
import React from "react";

const PostCard = ({ post, onClick }) => {
    if(!post) return null;
	return (
		<div className="bg-white border border-gray-300 rounded-lg p-4 mb-4 shadow-md hover:shadow-lg cursor-pointer transition" onClick={onClick}>
			<div className="flex items-center justify-between mb-2">
				<h2 className="text-lg font-bold">{post.title}</h2>
				<span className="text-sm text-gray-500">{post.type.toUpperCase()}</span>
			</div>

			<p className="text-sm text-gray-700 line-clamp-2">{post.content?.slice(0, 150)}...</p>

			<div className="flex flex-wrap gap-2 mt-3">
				{post.tags?.map((tag, idx) => (
					<span key={idx} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
						#{tag}
					</span>
				))}
			</div>

			<p className="text-xs text-gray-500 mt-2">Posted by: {post.createdBy?.name || "Anonymous"}</p>
		</div>
	);
};

export default PostCard;
