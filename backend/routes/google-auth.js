import express from "express";
import { User } from "../models/User.js"
import passport from "passport";


const router = express.Router();

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
    "/google/callback",
    passport.authenticate("google", {
        successRedirect: "/",
        failureRedirect: "/login",

    }),
    (req,res)=>{
        const token = jwt.sign(
            { userId: req.user._id, role: req.user.role },
            process.env.JWT,
            { expiresIn: "1d" }
        );

        res.cookie("token", token, { httpOnly: true, secure: true });
        res.redirect("/");
    }
);

router.get("/logout", (req, res,) => {
    req.logout(() => {
        res.redirect("/");
    });
});

export default router;