import mongoose from "mongoose";


const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 0.01 },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  images: [{ type: Array }],
  stock: { type: Number, min: 0 },
}, { timestamps: true });

export const Product = mongoose.model("product", productSchema);
