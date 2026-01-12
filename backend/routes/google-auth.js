import express from "express";
import { User } from "../models/User.js"
import passport from "passport";
import jwt from "jsonwebtoken";


const router = express.Router();

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
    "/google/callback",
    passport.authenticate("google", {
        failureRedirect: "/login",
        session: true,

    }),
    (req, res) => {
        const token = jwt.sign(
            { userId: req.user._id, role: req.user.role },
            process.env.JWT,
            { expiresIn: "1d" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production"
        });
        res.redirect(`http://localhost:5173/google-success?token=${token}`);
    }
);

router.get("/logout", (req, res,) => {
    req.logout(() => {
        res.redirect("/");
    });
});

export default router;