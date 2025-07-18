import jwt from "jsonwebtoken";

export const isAdmin = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    try {
        const decoded = jwt.verify(token, process.env.JWT);
        if (!decoded.isAdmin) return res.status(403).json({ message: "Admins only" });
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid token" });
    }
};
