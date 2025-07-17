import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    UserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    itmes: {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        quantity: { type: mongoose.Schema.Types.ObjectId, required: true, default: 1 }
    }
});

export const Cart = mongoose.model("cart", cartSchema);