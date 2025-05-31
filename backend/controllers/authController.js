const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");

const signup = async (req, res) => {
	try {
		const { name, email, password, role } = req.body;

		// Check if user already exists
		const userExists = await User.findOne({ email });
		if (userExists) {
			return res.status(400).json({ message: "User already exists" });
		}

		// Create new user
		const user = await User.create({ name, email, password, role });

		if (user) {
			res.status(201).json({
				_id: user._id,
				name: user.name,
				email: user.email,
				role: user.role,
				token: generateToken(user),
			});
		} else {
			res.status(400).json({ message: "Invalid user data" });
		}
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const login = async (req, res) => {
	try {
		const { email, password } = req.body;

		// Check user exists
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(401).json({ message: "Invalid email or password" });
		}

		// Verify password
		const isMatch = await user.matchPassword(password);
		if (!isMatch) {
			return res.status(401).json({ message: "Invalid email or password" });
		}

		// Send response with JWT token
		res.json({
			_id: user._id,
			name: user.name,
			email: user.email,
			role: user.role,
			token: generateToken(user),
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const forgotPassword = async (req, res) => {
	try {
		const { email } = req.body;

		// Check if user exists
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(404).json({ success: false, message: "User not found" });
		}

		// Generate reset token (valid for 15 min)
		const resetToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
			expiresIn: "15m",
		});

		// Reset link (frontend me implement karna padega)
		const resetLink = `http://localhost:5173/reset-password/${resetToken}`;

		// Send email (abhi ke liye console me print karenge)
		console.log(`Reset Link: ${resetLink}`);
		await sendEmail(user.email, "Password Reset Request", `Click here to reset your password: ${resetLink}`);

		return res.status(200).json({ success: true, message: "Reset link sent to your email" });
	} catch (error) {
		console.error("Forgot Password Error:", error);
		return res.status(500).json({ success: false, message: "Server error" });
	}
};

// const resetPassword = async (req, res) => {
//     try {
//         const { token } = req.params;
//         const { newPassword } = req.body;

//         // Verify token
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         if (!decoded) {
//             return res.status(400).json({ success: false, message: "Invalid or expired token" });
//         }

//         // Find user
//         const user = await User.findById(decoded.userId);
//         if (!user) {
//             return res.status(404).json({ success: false, message: "User not found" });
//         }
//         console.log(user);
//         console.log(newPassword);

//         // Hash new password
//         const salt = await bcryptjs.genSalt(10);
//         user.password = await bcryptjs.hash(newPassword, salt);

//         // Save updated password
//         await user.save();

//         return res.status(200).json({ success: true, message: "Password updated successfully!" });
//     } catch (error) {
//         console.error("Reset Password Error:", error);
//         return res.status(500).json({ success: false, message: "Server error" });
//     }
// };
const resetPassword = async (req, res) => {
	try {
		const { token } = req.params;
		const { newPassword } = req.body;

		// Decode the token
		console.log("Token received:", token);
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		console.log("Decoded token:", decoded);

		// Find user by decoded userId
		const user = await User.findById(decoded.userId);
		if (!user) {
			console.log("User not found");
			return res.status(404).json({ success: false, message: "User not found" });
		}

		console.log("User found:", user.email);

		// ✅ Set new password directly (will be hashed by pre('save'))
		user.password = newPassword;

		// Save user with new password
		await user.save();

		console.log("Password updated and saved!");

		return res.status(200).json({ success: true, message: "Password updated successfully!" });
	} catch (error) {
		console.error("Reset Password Error:", error);
		return res.status(500).json({ success: false, message: "Server error" });
	}
};

module.exports = { signup, login, forgotPassword, resetPassword };
