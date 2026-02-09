import { Product } from "../models/Product.js";
import { upload } from "../middlewares/upload.js";
import { Category } from "../models/Category.js";



export const createProduct = async (req, res) => {
    try {
        const { name, description, price, stock, category } = req.body;

        const imagePaths = req.files?.map(file => `/uploads/${file.filename}`) || [];

        const product = await Product.create({
            name,
            description,
            price,
            stock,
            category,
            images: imagePaths
        });

        res.status(201).json({ success: true, message: "product added", product });

    } catch (error) {
        console.error("DETAILED BACKEND ERROR:", error);
        res.status(500).json({ message: "something went wrong", error: error.message });
    }
};

export const getProducts = async (req, res) => {
    try {
        const { category, search, minPrice, maxPrice, limit, sort } = req.query;
        let query = {};

        // Search by name (case-insensitive)
        if (search) {
            query.name = { $regex: search, $options: "i" };
        }

        // Filter by category
        if (category) {
            query.category = category;
        }

        // Filter by price range
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        let apiQuery = Product.find(query);

        // Sorting
        if (sort === "latest") {
            apiQuery = apiQuery.sort({ createdAt: -1 });
        } else if (sort === "price-low") {
            apiQuery = apiQuery.sort({ price: 1 });
        } else if (sort === "price-high") {
            apiQuery = apiQuery.sort({ price: -1 });
        }

        // Limiting (Critical for Home Page)
        if (limit) {
            apiQuery = apiQuery.limit(Number(limit));
        }

        const products = await apiQuery;
        res.status(200).json({ success: true, products });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const getProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
        if (!product) {

            res.status(404).json({ success: false, message: "Product not Found" });
        }
        res.status(200).json({ success: true, product });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message })
    }
};

export const updateProduct = async (req, res) => {
    try {
        const updatedFields = {...req.body};


        if (req.files && req.files.length > 0) {
            const newImages = req.files.map(file => `/uploads/${file.filename}`);
            updatedFields.images = newImages;
        }

        const product = await Product.findByIdAndUpdate(req.params.id, updatedFields, {
            new: true,
            runValidators:true
        });

        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        res.status(200).json({ success: true, product, message: "Product updated" });
        console.log(product);

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }
        res.status(200).json({ success: true, message: "Product deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message })
    }
};

