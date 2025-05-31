// const express = require("express");
// const passport = require("passport");
// const { signup, login, forgotPassword, resetPassword } = require("../controllers/authController");

// const router = express.Router();

// // Existing routes
// router.post("/signup", signup);
// router.post("/login", login);
// router.post("/forgot-password", forgotPassword);
// router.post("/reset-password/:token", resetPassword);

// // Google authentication route to start the OAuth flow
// router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// // Google callback route to handle the OAuth response
// router.get(
//     "/google/callback",
//     passport.authenticate("google", { failureRedirect: "/login" }),
//     (req, res) => {
//         // If authentication is successful, send back the token
//         res.json({
//             success: true,
//             message: "Authentication successful",
//             token: req.user.token, // JWT token generated after successful authentication
//         });
//     }
// );

// module.exports = router;

const express = require("express");
const passport = require("passport");
const { signup, login, forgotPassword, resetPassword } = require("../controllers/authController");

const router = express.Router();

// Regular authentication routes
router.post("/signup", signup);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

// Google OAuth Routes
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
    "/google/callback",
    passport.authenticate("google", { failureRedirect: "/login" }),
    (req, res) => {
        // Successful authentication, send JWT token.
        res.json({
            message: "Google login successful",
            token: req.user.token, // This token is generated during the Passport strategy
        });
    }
);

module.exports = router;
