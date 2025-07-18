import express from "express";
import { addToCart, removeFromCart, viewCart } from "../controllers/cartController.js";
import { isAuthenticated } from "../middlewares/auth.js"

const router = express.Router();

router.post("/add", isAuthenticated, addToCart);
router.post("/remove", isAuthenticated, removeFromCart);
router.get("/view", isAuthenticated, viewCart);

export default router;

