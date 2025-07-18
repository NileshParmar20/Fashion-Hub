import passport, { Passport } from "passport";
import GoogleStrategy from "passport-google-oauth20";
import { User } from "../models/User.js";
import bcrypt from "bcryptjs";

passport.serializeUser((user, done) => {
    done(null, user.id);

});

passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id);
    done(null, user);
});

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL
        },
        async (accessToken, refereshToken, profile, done) => {
            const email = profile.emails[0].value;

            let user = await User.findOne({ email });
            if (!user) {
                const hashedpassword = await bcrypt.hash("google-auth", 10);

                user = await User.create({
                    name: profile.displayName,
                    email,
                    password: hashedpassword,
                });
            }

            done(null, user);
        }
    )
)