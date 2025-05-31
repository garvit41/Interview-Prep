import { useState } from "react";
import { useNavigate } from "react-router-dom";
import forumService from "../services/forumService";

const NewPostForm = () => {
	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");
	const [tags, setTags] = useState("");
	const [type, setType] = useState("question");
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const token = localStorage.getItem("token");
			const tagArray = tags.split(",").map((tag) => tag.trim()); // Convert to array

			await forumService.createPost({ title, content, tags: tagArray, type }, token);
			alert("Post created successfully!");
			navigate("/forum");
		} catch (error) {
			console.error("Error creating post:", error);
			alert("Failed to create post.");
		}
	};

	return (
		<div className="max-w-2xl mx-auto mt-10 bg-white shadow p-6 rounded-lg">
			<h2 className="text-2xl font-semibold mb-4">Create New Post</h2>
			<form onSubmit={handleSubmit}>
				<div className="mb-4">
					<label className="block font-medium mb-1">Title</label>
					<input
						type="text"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						className="w-full border border-gray-300 p-2 rounded"
						required
					/>
				</div>

				<div className="mb-4">
					<label className="block font-medium mb-1">Content</label>
					<textarea
						value={content}
						onChange={(e) => setContent(e.target.value)}
						className="w-full border border-gray-300 p-2 rounded"
						rows={6}
						required
					/>
				</div>

				<div className="mb-4">
					<label className="block font-medium mb-1">Tags (comma separated)</label>
					<input
						type="text"
						value={tags}
						onChange={(e) => setTags(e.target.value)}
						placeholder="e.g. React, Backend, Interview"
						className="w-full border border-gray-300 p-2 rounded"
					/>
				</div>

				<div className="mb-4">
					<label className="block font-medium mb-1">Type</label>
					<select value={type} onChange={(e) => setType(e.target.value)} className="w-full border border-gray-300 p-2 rounded">
						<option value="question">Question</option>
						<option value="experience">Experience</option>
					</select>
				</div>

				<button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
					Submit
				</button>
			</form>
		</div>
	);
};

export default NewPostForm;
