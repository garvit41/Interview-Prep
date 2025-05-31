const Post = require("../models/Post");
const Comment = require("../models/Comment");

const createPost = async (req, res, next) => {
	try {
		const { title, content, tags, type } = req.body;
		const newPost = await Post.create({
			title,
			content,
			tags,
			type,
			createdBy: req.user._id,
		});
		res.status(201).json(newPost);
	} catch (error) {
		next(error);
	}
};

const getAllPosts = async (req, res, next) => {
	try {
		const posts = await Post.find().populate("createdBy", "name email").sort({ createdAt: -1 });

		res.json(posts);
	} catch (error) {
		next(error);
	}
};

const getPostById = async (req, res, next) => {
	console.log("get post by id hit");
	try {
		const post = await Post.findById(req.params.id).populate("createdBy", "name email");
		console.log("post : ", post);
		if (!post) return res.status(404).json({ message: "Post not found" });

		const comments = await Comment.find({ postId: post._id }).populate("createdBy", "name email");
		console.log("comments : ", comments);

		const nestComments = (comments, parentId = null) => {
			return comments
				.filter((c) => String(c.parentId) === String(parentId))
				.map((c) => ({
					_id: c._id,
					content: c.content,
					createdAt: c.createdAt,
					updatedAt: c.updatedAt,
					postId: c.postId,
					parentId: c.parentId,
					createdBy: c.createdBy, // ✅ THIS IS THE FIX
					replies: nestComments(comments, c._id),
				}));
		};

		const nested = nestComments(comments);
		console.log("🔍 nested[0].createdBy:", nested[0]?.createdBy);
		console.log("✅ Is createdBy populated?", typeof nested[0]?.createdBy === "object");
		res.json({ post, comments: nested });
	} catch (error) {
		next(error);
	}
};

const editPost = async (req, res, next) => {
	try {
		const post = await Post.findById(req.params.id);

		if (!post) return res.status(404).json({ message: "Post not found" });

		if (post.createdBy.toString() !== req.user._id.toString()) {
			return res.status(403).json({ message: "kisi aur ki post k sath ched chad mat kr" });
		}

		const { title, content, tags, type } = req.body;

		post.title = title || post.title;
		post.content = content || post.content;
		post.tags = tags || post.tags;
		post.type = type || post.type;

		const updated = await post.save();
		res.json(updated);
	} catch (error) {
		next(error);
	}
};

const deletePost = async (req, res, next) => {
	try {
		const post = await Post.findById(req.params.id);
		if (!post) return res.status(404).json({ message: "Post not fonud" });

		if (post.createdBy.toString() !== req.user._id.toString()) {
			return res.status(403).json({ message: "ksi aur ki post k sath ched chad mat kr" });
		}

		await Comment.deleteMany({ postId: post.id });
		await post.deleteOne();

		res.json({ message: "Post deleted successfully" });
	} catch (error) {
		next(error);
	}
};

const addComment = async (req, res, next) => {
	console.log("add comment called");
	try {
		const { content, parentId } = req.body;
		const newComment = await Comment.create({
			content,
			postId: req.params.postId,
			parentId: parentId || null,
			createdBy: req.user._id,
		});
		res.status(201).json(newComment);
	} catch (error) {
		next(error);
	}
};

const editComment = async (req, res, next) => {
	try {
		const comment = await Comment.findById(req.params.id);
		if (!comment) return res.status(404).json({ message: "Comment not foudn" });

		if (comment.createdBy.toString() !== req.user._id.toString()) {
			return res.status(403).json({ message: "Not authorized to edit this comment" });
		}

		comment.content = req.body.content || comment.content;
		const updated = await comment.save();
		res.json(updated);
	} catch (error) {
		next(error);
	}
};

const deleteComment = async (req, res, next) => {
	try {
		const comment = await Comment.findById(req.params.id);
		if (!comment) return res.status(404).json({ message: "Comment not found" });

		if (comment.createdBy.toString() !== req.user._id.toString()) {
			return res.status(403).json({ message: "Not authorized to delete this comment" });
		}

		await comment.deleteOne();
		res.json({ message: "Comment deleted successfully" });
	} catch (error) {
		next(error);
	}
};

module.exports = {
	createPost,
	getAllPosts,
	getPostById,
	addComment,
	editPost,
	deletePost,
	editComment,
	deleteComment,
};
