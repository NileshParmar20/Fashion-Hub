import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

export const isAuthenticated = async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1] || req.cookies.token;

    if (!token)
        return res.status(401).json({ message: "Unauthorized - Token not provided", success: false });

    try {
        const decoded = jwt.verify(token, process.env.JWT);
        req.user = await User.findById(decoded.userId).select("-password");
        if (!req.user) return res.status(404).json({ message: "User not found" });
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid or expired token", success: false });
    }
}