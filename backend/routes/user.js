import express from "express";
import { isAuthenticated } from "../middlewares/auth.js"
import { register, login, logout } from "../controllers/user.js";
 
const router = express.Router();

router.post('/register', register);

router.post('/login', login);

router.post("/logout",logout);

router.get("/me", isAuthenticated, (req, res) => {
  res.json({ message: "Private route access granted", user: req.user });
});

export default router;