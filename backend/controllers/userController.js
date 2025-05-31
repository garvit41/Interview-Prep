const User = require("../models/User");

//  GET User Profile
const getUserProfile = async (req, res) => {
	try {
		const user = await User.findById(req.user._id).select("-password");

		if (!user) {
			return res.status(404).json({ success: false, message: "User not found" });
		}

		// res.json({
		// 	success: true,
		// 	user: {
		// 		name: user.name,
		// 		email: user.email,
		// 		role: user.role,
		// 		createdAt: user.createdAt,
		// 	},
		// });

		res.json({
			success: true,
			user: {
				_id: user._id,
				name: user.name,
				email: user.email,
				role: user.role,
				createdAt: user.createdAt,
			},
		});
	} catch (error) {
		res.status(500).json({ success: false, message: "Server Error" });
	}
};

//  UPDATE User Profile
const updateUserProfile = async (req, res) => {
	try {
		const user = await User.findById(req.user._id);

		if (!user) {
			return res.status(404).json({ success: false, message: "User not found" });
		}

		user.name = req.body.name || user.name;
		user.email = req.body.email || user.email;

		const updatedUser = await user.save();

		res.json({
			success: true,
			message: "Profile updated successfully",
			user: {
				name: updatedUser.name,
				email: updatedUser.email,
				role: updatedUser.role,
				createdAt: updatedUser.createdAt,
			},
		});
	} catch (error) {
		res.status(500).json({ success: false, message: "Server Error" });
	}
};

module.exports = { getUserProfile, updateUserProfile };
