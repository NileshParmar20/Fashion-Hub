import express from "express";
import { createProduct, getProducts, getProduct, updateProduct, deleteProduct } from "../controllers/productController.js";
import { isAdmin } from "../middlewares/isadmin.js";

const router = express.Router();

router.post("/create", isAdmin, createProduct);
router.get("/", getProducts);
router.get("/:id", getProduct);
router.put("/:id", isAdmin, updateProduct);
router.delete("/:id", isAdmin, deleteProduct);

export default router;
