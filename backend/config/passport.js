const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");
const generateToken = require("../utils/generateToken"); // This should be your JWT generation function

// Use the GoogleStrategy within Passport.
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL,
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                // Check if user already exists in the database
                let user = await User.findOne({ email: profile.emails[0].value });

                if (!user) {
                    // Create a new user if one doesn't exist
                    user = await User.create({
                        name: profile.displayName,
                        email: profile.emails[0].value,
                        googleId: profile.id, // You can store this if needed
                    });
                }

                // Generate JWT token
                const token = generateToken(user);

                // Add the token to the user object
                user.token = token;

                return done(null, user); // Returning the user after successful authentication
            } catch (err) {
                console.error(err);
                return done(err, null);
            }
        }
    )
);

// Serialize the user ID into the session
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Deserialize the user ID from the session
passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id);
    done(null, user);
});
