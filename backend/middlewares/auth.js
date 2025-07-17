import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

export const isAuthenticated = async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token)
        return res.status(401).json({ message: "Unauthorized - Token not provided", success: false });

    try {
        const decoded = jwt.verify(token, process.env.JWT);
        req.user = await User.findById(decoded.userId).select("-password");
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid or expired token", success: false });
    }
}