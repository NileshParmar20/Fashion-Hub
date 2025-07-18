import express from "express";
import { User } from "../models/User.js"
import passport from "passport";


const router = express.Router();

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
    "/google/callback",
    passport.authenticate("google", {
        successRedirect: "/profile",
        failureRedirect: "/login",

    })
);

router.get("/logout", (req, res,) => {
    req.logout(() => {
        res.redirect("/");
    });
});

export default router;