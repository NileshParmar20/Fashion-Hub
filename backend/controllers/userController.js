import { User } from "../models/User.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export const register = async (req, res) => {
    const { name, email, password } = req.body;

    let user = await User.findOne({ email });
    if (user) return res.status(409).json({ message: "User already exists", success: false })

    const hashPassword = await bcrypt.hash(password, 10);

    const role = email === process.env.ADMIN_EMAIL ? "admin" : "user";

    user = await User.create({
        name,
        email,
        password: hashPassword,
        role,
    });

    res.status(201).json({ message: "User Register Successfully....", user, success: true })
    console.log(user);

};

export const login = async (req, res) => {
    const { email, password } = req.body;

    let user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User does not exist", success: false });

    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass)
        return res.status(401).json({ message: "Incorrect password", success: false });

    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT, {
        expiresIn: "1day"
    });

    res.status(200).json({
        success: true,
        message: `Welcome ${user.name}`,
        token,
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
    });

}

export const adminlogin = async (req, res) => {
    const { email, password } = req.body;

    const admin = await User.findOne({ email });

    if (!admin || admin.role !== "admin") {
        return res.status(401).json({ message: "Unauthorized access" });
    }

    const validPass = await bcrypt.compare(password, admin.password);
    if (!validPass)
        return res.status(401).json({ message: "Incorrect credentials" });

    const token = jwt.sign(
        { userId: admin._id, role: admin.role },
        process.env.JWT, {
        expiresIn: "1d"
    });

    res.status(200).json({ message: `Welcome ${admin.name}`, token, success: true });
};


export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}, "-password"); // Fetch all but hide passwords
        res.status(200).json({ success: true, users });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


export const logout = async (req, res) => {
    try {
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        res.status(500).json({ error: "Logout failed" });
    };
};