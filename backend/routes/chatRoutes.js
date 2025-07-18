const express = require("express");
const router = express.Router();
const { getChatHistory } = require("../controllers/chatController");
const authMiddleware = require("../middlewares/authMiddleware");

router.get("/:chatRoomId", authMiddleware, getChatHistory);

module.exports = router;
