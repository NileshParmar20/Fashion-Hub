import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20"; // Updated Import
import { User } from "../models/User.js";
import bcrypt from "bcryptjs";


console.log("DEBUG: Checking ENV Variables...");
console.log("GOOGLE_CLIENT_ID:", process.env.GOOGLE_CLIENT_ID ? "FOUND" : "NOT FOUND / UNDEFINED");

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL || "/auth/google/callback"
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const email = profile.emails[0].value;

                let user = await User.findOne({ email });
                
                if (!user) {
                    // Create user if they don't exist
                    const hashedpassword = await bcrypt.hash(Math.random().toString(36), 10);

                    user = await User.create({
                        name: profile.displayName,
                        email,
                        password: hashedpassword,
                        role: "user", // Ensure role is set for JWT consistency
                    });
                }

                return done(null, user);
            } catch (error) {
                return done(error, null);
            }
        }
    )
);