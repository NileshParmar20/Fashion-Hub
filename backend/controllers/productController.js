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
        res.status(500).json({ message: "something went wrong", error: error.message });
    }
};

export const getProducts = async (req, res) => {
    try {
        const products = await Product.find().populate("category");
        res.status(200).json({ success: true, products });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message })
    }
};

export const getProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate("category");
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
    const updatedFields = req.body;

   
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => `/uploads/${file.filename}`);
      updatedFields.images = newImages;
    }

    const product = await Product.findByIdAndUpdate(req.params.id, updatedFields, {
      new: true,
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
        const product = await Product.findByIdAndDelete(req.params.id,);
        res.status(200).json({ success: true, product, message: "Prodct Deleted" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message })
    }
};

