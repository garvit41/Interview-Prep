import React, { useState } from "react";

const CommentForm = ({ onSubmit }) => {
	const [content, setContent] = useState("");

	const handleSubmit = (e) => {
		e.preventDefault();
		if (!content.trim()) return;
		onSubmit(content);
		setContent("");
	};

	return (
		<form onSubmit={handleSubmit} className="flex flex-col gap-2">
			<textarea
				className="border border-gray-300 rounded p-2 text-sm resize-none"
				rows={2}
				placeholder="Write a comment..."
				value={content}
				onChange={(e) => setContent(e.target.value)}
			/>
			<button type="submit" className="bg-blue-600 text-white px-3 py-1 rounded text-sm self-start hover:bg-blue-700">
				Submit
			</button>
		</form>
	);
};

export default CommentForm;
