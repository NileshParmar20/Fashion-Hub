import express from "express";
import { isAuthenticated } from "../middlewares/auth.js"
import { register, login, logout, adminlogin } from "../controllers/userController.js";

 
const router = express.Router();

router.post('/register', register);

router.post('/login', login);

router.post("/logout",logout);

router.post("/adminlogin",adminlogin);

router.get("/me", isAuthenticated, (req, res) => {
  res.json({ message: "Private route access granted", user: req.user });
});

export default router;