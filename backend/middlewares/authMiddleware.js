const jwt = require("jsonwebtoken");
const User = require("../models/User"); // Ensure correct path

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.header("Authorization")?.split(" ")[1];
        console.log("Received Token:", token);

        if (!token) {
            return res
                .status(401)
                .json({ success: false, message: "Access Denied. No Token Provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded User:", decoded);

        // 🔍 DEBUG: Database Query Check
        const user = await User.findById(decoded.id).select("-password");
        console.log("User from DB:", user);

        if (!user) {
            return res
                .status(401)
                .json({ success: false, message: "User not found, Invalid Token" });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("Auth Middleware Error:", error.message);
        res.status(401).json({ success: false, message: "Invalid or Expired Token" });
    }
};

module.exports = authMiddleware;
