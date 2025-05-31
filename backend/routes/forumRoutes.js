const express = require("express");
const router = express.Router();
const { createPost, getAllPosts, getPostById, addComment, editPost, deletePost, editComment, deleteComment } = require("../controllers/forumController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/post", authMiddleware, createPost);           // create a new post
router.put("/post/:id", authMiddleware, editPost);          // edit a post
router.delete("/post/:id", authMiddleware, deletePost);     // delete a post
router.get("/posts", getAllPosts);                          // get all jobs
router.get("/post/:id", getPostById);                       // get single posts + comments

router.post("/comment/:postId", authMiddleware, addComment);    // add a comment
router.put('/comment/:id', authMiddleware, editComment);        // edit comment
router.delete('/comment/:id', authMiddleware, deleteComment);   // delete comment

module.exports = router;
