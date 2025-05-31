const express = require("express");
const { getUserProfile, updateUserProfile } = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// GET User Profile 
router.get("/profile", authMiddleware, getUserProfile);

// PUT Update User Profile
router.put("/update", authMiddleware, updateUserProfile);

module.exports = router;